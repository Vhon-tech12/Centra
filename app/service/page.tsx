"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    XMarkIcon,
    ChevronDownIcon,
    ArrowRightIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Footer from "../../components/Footer";

// ---------- TYPES ----------
interface FAQ {
    question: string;
    answer: string;
}

interface ServiceDetails {
    heroImage: string;
    overview: string;
    idealCandidates: string[];
    procedureOptions: string[];
    benefits: string[];
    recoveryTimeline: string;
    beforeSurgery: string;
    aftercare: string;
    risks: string;
    faqs: FAQ[];
}

interface Service {
    id: string;
    category: string;
    name?: string;
    title: string;
    description: string;
    icon: string;
    status: "Active" | "Inactive";
    image?: string;
    details: ServiceDetails;
}

// ---------- VALUE PROPS ----------
const valueProps = [
    "Expert ENT Specialists with years of experience",
    "Integrated medical & aesthetic care under one roof",
    "Personalized treatment plans tailored to your needs",
    "State-of-the-art diagnostic and treatment technology",
    "Compassionate, patient-centered approach",
];

// ---------- HELPERS ----------
const accentColors = [
    "from-teal-500 to-teal-600",
    "from-cyan-500 to-cyan-600",
    "from-emerald-500 to-emerald-600",
    "from-sky-500 to-sky-600",
    "from-teal-500 to-teal-600",
    "from-cyan-500 to-cyan-600",
];

const getDescription = (service: Service) =>
    service.description ||
    `Comprehensive ${service.category} care tailored to your needs — delivered by our
     experienced specialists at Centra Clinic PH.`;

// ---------- MAIN COMPONENT ----------
export default function ServicesSection() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);

    // Fetch services from API
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch("/api/services");
                if (res.ok) {
                    const data = await res.json();
                    const activeServices = data.filter((s: Service) => s.status === "Active");
                    setServices(activeServices);
                } else {
                    console.error("Failed to fetch services");
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const openModal = (service: Service) => {
        setSelectedService(service);
        setIsModalOpen(true);
        setExpandedAccordion(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedService(null);
    };

    const toggleAccordion = (sectionId: string) => {
        setExpandedAccordion(expandedAccordion === sectionId ? null : sectionId);
    };

    const getModalSections = (service: Service) => {
        return [
            { id: "overview", title: "Overview", content: service.details.overview },
            {
                id: "ideal-candidates",
                title: "Ideal Candidates",
                content: (
                    <ul className="list-disc pl-5 space-y-1">
                        {service.details.idealCandidates.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                ),
            },
            {
                id: "procedure-options",
                title: "Procedure Options",
                content: (
                    <ul className="list-disc pl-5 space-y-1">
                        {service.details.procedureOptions.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                ),
            },
            {
                id: "benefits",
                title: "Benefits",
                content: (
                    <ul className="list-disc pl-5 space-y-1">
                        {service.details.benefits.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                ),
            },
            {
                id: "recovery",
                title: "Recovery Timeline",
                content: service.details.recoveryTimeline,
            },
            {
                id: "before-surgery",
                title: "Before Surgery",
                content: service.details.beforeSurgery,
            },
            {
                id: "aftercare",
                title: "Aftercare",
                content: service.details.aftercare,
            },
            {
                id: "risks",
                title: "Risks & Complications",
                content: service.details.risks,
            },
            {
                id: "faqs",
                title: "Frequently Asked Questions",
                content: (
                    <div className="space-y-4">
                        {service.details.faqs.map((faq, idx) => (
                            <div key={idx}>
                                <p className="font-medium text-gray-800">{faq.question}</p>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                ),
            },
        ];
    };

    const modalSections = selectedService ? getModalSections(selectedService) : [];

    // Group services by category (preserves first-seen order)
    const groupedServices = useMemo(() => {
        const groups: { category: string; items: Service[] }[] = [];
        services.forEach((service) => {
            const existing = groups.find((g) => g.category === service.category);
            if (existing) {
                existing.items.push(service);
            } else {
                groups.push({ category: service.category, items: [service] });
            }
        });
        return groups;
    }, [services]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading services...</p>
                </div>
            </div>
        );
    }

    // No services
    if (services.length === 0) {
        return (
            <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-semibold">No Services Available</h1>
                    <p className="text-gray-500 mt-2">Please check back later.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,rgba(29,141,138,0.10),rgba(247,246,242,1))]" />

                {/* ===== CENTERED HERO ===== */}
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-28 text-center">
                    {/* Badge */}
                    <p className="inline-flex items-center rounded-full bg-teal-50 px-4 py-1.5 text-sm font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20">
                        ENT &amp; Aesthetics Services
                    </p>

                    {/* Headline */}
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                        Expert ENT Care &amp;{" "}
                        <span className="text-teal-600">Aesthetic Excellence</span>
                    </h1>

                    {/* Description */}
                    <p className="mt-5 text-base leading-relaxed text-gray-700 sm:text-lg">
                        Centra Clinic PH delivers world-class ENT treatments and advanced
                        aesthetic procedures under one roof. Our integrated, patient-first
                        approach ensures you receive comprehensive, compassionate care for
                        your ear, nose, throat, and cosmetic needs.
                    </p>

                    {/* Value Props */}
                    <div className="mt-8 mx-auto max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-left">
                        {valueProps.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-teal-600 mt-0.5" />
                                <span className="text-sm text-gray-700 sm:text-base">{item}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
                        <a
                            href="#"
                            className="rounded-md bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition-colors"
                        >
                            Book a Consultation
                        </a>
                        <a
                            href="#services"
                            className="inline-flex items-center text-sm font-semibold text-gray-700 hover:text-teal-600 transition-colors"
                        >
                            Browse Services
                            <ArrowRightIcon className="ml-1 h-4 w-4" />
                        </a>
                    </div>
                </div>

                {/* ===== SERVICES GROUPED BY CATEGORY ===== */}
                <div id="services" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 space-y-16">
                    {groupedServices.map((group, groupIdx) => (
                        <section key={group.category}>
                            {/* Category header */}
                            <div className="flex items-center gap-4 mb-6 sm:mb-8">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                                        Category {String(groupIdx + 1).padStart(2, "0")}
                                    </p>
                                    <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900">
                                        {group.category}
                                    </h2>
                                </div>
                                <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-teal-200 to-transparent" />
                            </div>

                            {/* Cards grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                                {group.items.map((service) => {
                                    const displayTitle = service.name || service.title;
                                    const heroSrc =
                                        service.details?.heroImage || service.image || "";
                                    const colorIndex =
                                        services.indexOf(service) % accentColors.length;
                                    const accentClass = accentColors[colorIndex];

                                    return (
                                        <button
                                            key={service.id}
                                            type="button"
                                            className="group relative text-left bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                                            onClick={() => openModal(service)}
                                        >
                                            {/* Image */}
                                            <div className="relative h-44 w-full overflow-hidden">
                                                {heroSrc ? (
                                                    <img
                                                        src={heroSrc}
                                                        alt={displayTitle}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div
                                                        className={`h-full w-full bg-gradient-to-br ${accentClass}`}
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                                                {/* Category chip */}
                                                <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-teal-700">
                                                    {service.category}
                                                </span>

                                                {/* Title over image */}
                                                <h3 className="absolute bottom-3 left-4 right-4 text-white text-base font-semibold leading-tight drop-shadow-sm">
                                                    {displayTitle}
                                                </h3>
                                            </div>

                                            {/* Body */}
                                            <div className="relative flex flex-1 flex-col p-4">
                                                <p className="text-sm text-gray-600 line-clamp-3 flex-1">
                                                    {getDescription(service)}
                                                </p>

                                                <div className="mt-4 flex items-center text-sm font-medium text-teal-600 group-hover:gap-2 transition-all">
                                                    Learn More
                                                    <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            {/* ===== CENTERED MODAL ===== */}
            {isModalOpen && selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    {/* Panel */}
                    <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                        {/* Hero Image */}
                        <div className="relative h-48 sm:h-56 w-full overflow-hidden flex-shrink-0">
                            {selectedService.details.heroImage || selectedService.image ? (
                                <img
                                    src={
                                        selectedService.details.heroImage ||
                                        selectedService.image ||
                                        "/placeholder.jpg"
                                    }
                                    alt={selectedService.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-gradient-to-br from-teal-500 to-teal-600" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                            <div className="absolute bottom-5 left-6 right-16 text-white">
                                <p className="text-xs font-medium uppercase tracking-wide text-teal-200">
                                    {selectedService.category}
                                </p>
                                <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
                                    {selectedService.name || selectedService.title}
                                </h2>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            aria-label="Close"
                            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 shadow-md transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>

                        {/* Scrollable content */}
                        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
                            {modalSections.map((section) => {
                                const isExpanded = expandedAccordion === section.id;
                                return (
                                    <div
                                        key={section.id}
                                        className="border-b border-gray-200 pb-4 last:border-b-0"
                                    >
                                        <button
                                            className="flex w-full items-center justify-between text-left font-medium text-gray-900 hover:text-teal-600 transition-colors"
                                            onClick={() => toggleAccordion(section.id)}
                                        >
                                            <span>{section.title}</span>
                                            <ChevronDownIcon
                                                className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
                                                    isExpanded ? "rotate-180" : ""
                                                }`}
                                            />
                                        </button>
                                        {isExpanded && (
                                            <div className="pt-3 text-gray-700 text-sm leading-relaxed">
                                                {section.content}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Sticky footer buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 p-5 sm:p-6 border-t border-gray-200 bg-gray-50/80 flex-shrink-0">
                            <button className="w-full sm:w-auto rounded-md bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition-colors">
                                Book Consultation
                            </button>
                            <button
                                onClick={closeModal}
                                className="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                Back to Services
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== FOOTER ===== */}
            <Footer />
        </>
    );
}
