"use client";

import React, { useState, useEffect } from "react";
import {
    XMarkIcon,
    ChevronDownIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    StarIcon,
    ClockIcon,
    UserGroupIcon,
    BuildingOfficeIcon,
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

// ---------- STATS & VALUE PROPS ----------
const stats = [
    { label: "Years of Excellence", value: "10+", icon: ClockIcon },
    { label: "Patients Served", value: "5,000+", icon: UserGroupIcon },
    { label: "Patient Satisfaction", value: "4.9/5", icon: StarIcon },
    { label: "Modern Facilities", value: "State-of-the-art", icon: BuildingOfficeIcon },
];

const valueProps = [
    "Expert ENT Specialists with years of experience",
    "Integrated medical & aesthetic care under one roof",
    "Personalized treatment plans tailored to your needs",
    "State-of-the-art diagnostic and treatment technology",
    "Compassionate, patient-centered approach",
];

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
            <div className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
                {/* Background gradient */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,rgba(29,141,138,0.10),rgba(247,246,242,1))]" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">

                        {/* ===== LEFT SIDE: Engaging Content ===== */}
                        <div className="lg:pt-4 lg:pr-6 xl:pr-10">
                            <div className="lg:max-w-lg">
                                {/* Badge */}
                                <p className="inline-flex items-center rounded-full bg-teal-50 px-4 py-1.5 text-sm font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20">
                                    ENT & Aesthetics Services
                                </p>

                                {/* Headline */}
                                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                                    Expert ENT Care &amp; <br />
                                    <span className="text-teal-600">Aesthetic Excellence</span>
                                </h1>

                                {/* Description */}
                                <p className="mt-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                                    Centra Clinic PH delivers world-class ENT treatments and advanced
                                    aesthetic procedures under one roof. Our integrated, patient-first
                                    approach ensures you receive comprehensive, compassionate care for
                                    your ear, nose, throat, and cosmetic needs.
                                </p>

                                {/* Value Props */}
                                <div className="mt-6 space-y-2">
                                    {valueProps.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-teal-600 mt-0.5" />
                                            <span className="text-sm text-gray-700 sm:text-base">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Stats */}
                                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    {stats.map((stat, idx) => {
                                        const Icon = stat.icon;
                                        return (
                                            <div
                                                key={idx}
                                                className="rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100/80 p-4 text-center shadow-sm"
                                            >
                                                <Icon className="h-5 w-5 text-teal-600 mx-auto" />
                                                <p className="mt-1 text-xl font-bold text-gray-900">{stat.value}</p>
                                                <p className="text-xs text-gray-500">{stat.label}</p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* CTAs */}
                                <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
                                    <a
                                        href="#"
                                        className="rounded-md bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition-colors"
                                    >
                                        Book a Consultation
                                    </a>
                                    <a
                                        href="#"
                                        className="inline-flex items-center text-sm font-semibold text-gray-700 hover:text-teal-600 transition-colors"
                                    >
                                        Learn more
                                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* ===== RIGHT SIDE: Service Cards (no icons) ===== */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                            {services.map((service) => {
                                const displayTitle = service.name || service.title;
                                // Color accent based on index for variety
                                const accentColors = [
                                    "from-teal-500 to-teal-600",
                                    "from-cyan-500 to-cyan-600",
                                    "from-emerald-500 to-emerald-600",
                                    "from-sky-500 to-sky-600",
                                    "from-teal-500 to-teal-600",
                                    "from-cyan-500 to-cyan-600",
                                ];
                                const colorIndex = services.indexOf(service) % accentColors.length;
                                const accentClass = accentColors[colorIndex];

                                return (
                                    <div
                                        key={service.id}
                                        className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
                                        onClick={() => openModal(service)}
                                    >
                                        {/* Top accent bar */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentClass}`} />

                                        <div className="relative z-10 flex-1 flex flex-col pt-2">
                                            {/* Service Name */}
                                            <h3 className="text-base font-semibold text-gray-900 leading-tight">
                                                {displayTitle}
                                            </h3>

                                            {/* Description */}
                                            <p className="mt-2 text-sm text-gray-600 flex-1">
                                                {service.description}
                                            </p>

                                            {/* Learn More */}
                                            <div className="mt-4 flex items-center text-sm font-medium text-teal-600 group-hover:gap-2 transition-all">
                                                Learn More
                                                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== MODAL / SLIDE-OVER PANEL ===== */}
            {isModalOpen && selectedService && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={closeModal}
                    />
                    {/* Panel */}
                    <div
                        className="relative w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out"
                        style={{ transform: isModalOpen ? "translateX(0)" : "translateX(100%)" }}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 shadow-md"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>

                        {/* Hero Image */}
                        <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                            <img
                                src={selectedService.details.heroImage || selectedService.image || "/placeholder.jpg"}
                                alt={selectedService.title}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <p className="text-sm font-medium text-teal-200">{selectedService.category}</p>
                                <h2 className="text-2xl sm:text-3xl font-bold">
                                    {selectedService.name || selectedService.title}
                                </h2>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 sm:p-6 space-y-5">
                            {/* Accordion sections */}
                            {modalSections.map((section) => {
                                const isExpanded = expandedAccordion === section.id;
                                return (
                                    <div key={section.id} className="border-b border-gray-200 pb-4">
                                        <button
                                            className="flex w-full items-center justify-between text-left font-medium text-gray-900 hover:text-teal-600 transition-colors"
                                            onClick={() => toggleAccordion(section.id)}
                                        >
                                            <span>{section.title}</span>
                                            <ChevronDownIcon
                                                className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>
                                        {isExpanded && (
                                            <div className="pt-3 text-gray-700">{section.content}</div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Bottom Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
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
                </div>
            )}

            {/* ===== FOOTER ===== */}
            <Footer />
        </>
    );
}