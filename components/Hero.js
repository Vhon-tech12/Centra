"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Stethoscope,
  HeartPulse,
  ScanLine,
  ShieldCheck,
  Clock3,
  Globe2,
  Star,
  Phone,
  CalendarCheck,
  Sparkles,
  Award,
  HeartHandshake,
  Microscope,
  Check,
  MapPin,
} from "lucide-react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

/**
 * @typedef {Object} Announcement
 * @property {string} [id]
 * @property {string} title
 * @property {string} description
 * @property {string|null} [bannerImage]
 */

const specialties = [
  {
    title: "Ear",
    desc: "Expert assessment and care for hearing concerns, infections, pain, and other ear-related conditions.",
    icon: Stethoscope,
    number: "01",
  },
  {
    title: "Nose",
    desc: "Diagnosis and treatment for congestion, sinus issues, allergies, and breathing-related concerns.",
    icon: ScanLine,
    number: "02",
  },
  {
    title: "Throat",
    desc: "Focused care for voice problems, swallowing difficulties, infections, and throat discomfort.",
    icon: HeartPulse,
    number: "03",
  },
  {
    title: "Aesthetics",
    desc: "High-quality aesthetic procedures performed with a medically guided approach and trusted materials.",
    icon: Star,
    number: "04",
  },
];

const features = [
  {
    number: "01",
    title: "By Appointment Only",
    desc: "All consultations and procedures are handled strictly by scheduled appointment.",
    icon: CalendarCheck,
  },
  {
    number: "02",
    title: "Holistic ENT Care",
    desc: "We approach ear, nose, and throat concerns as connected parts of your overall wellness.",
    icon: HeartHandshake,
  },
  {
    number: "03",
    title: "Medically Sound Advice",
    desc: "Every recommendation is guided by professional medical judgment and patient safety.",
    icon: Award,
  },
  {
    number: "04",
    title: "Top-Notch Facilities",
    desc: "Quality procedures, reliable materials, and a comfortable clinical environment you can trust.",
    icon: Microscope,
  },
];

const trustPills = [
  "Board-certified specialists",
  "Modern diagnostic tools",
  "Patient-first approach",
];

export default function Hero({ announcements = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  const goToNext = () =>
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  const handleCloseBanner = () => setIsBannerVisible(false);

  const currentAnnouncement = announcements[currentIndex];

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#0d2323] antialiased">
      {/* ================= ANNOUNCEMENT BANNER ================= */}
      {isBannerVisible && announcements.length > 0 && currentAnnouncement && (
        <div className="w-full bg-[#0c2222] text-white">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-2 lg:px-10">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {currentAnnouncement.bannerImage && (
                <img
                  src={currentAnnouncement.bannerImage}
                  alt=""
                  className="h-7 w-7 flex-shrink-0 rounded-full object-cover ring-2 ring-white/10"
                />
              )}
              <div className="flex min-w-0 items-center gap-3 truncate">
                <span className="hidden rounded-full bg-[#1d8d8a] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white sm:inline">
                  New
                </span>
                <p className="truncate text-sm font-medium">
                  {currentAnnouncement.title}
                </p>
                <span className="hidden text-white/40 lg:inline">·</span>
                <p className="hidden truncate text-sm text-white/60 lg:inline">
                  {currentAnnouncement.description}
                </p>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-1">
              {announcements.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="rounded-full p-1.5 transition hover:bg-white/10"
                    aria-label="Previous"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="rounded-full p-1.5 transition hover:bg-white/10"
                    aria-label="Next"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </>
              )}
              <button
                onClick={handleCloseBanner}
                className="ml-1 rounded-full p-1.5 transition hover:bg-white/10"
                aria-label="Close"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full overflow-hidden bg-[#fafaf8]">
        {/* Ambient background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(16,37,37,0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(16,37,37,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -left-40 top-10 h-[560px] w-[560px] rounded-full bg-[#1d8d8a]/8 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-40 top-40 h-[520px] w-[520px] rounded-full bg-[#e6b422]/6 blur-[120px]"
        />

        <div className="relative mx-auto max-w-[1400px] px-6 pb-12 pt-10 sm:pt-14 lg:px-10 lg:pb-16 lg:pt-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            {/* ===== LEFT COPY ===== */}
            <div className="relative">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0c2222]/8 bg-white px-3.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#e6b422]/15">
                  <Star className="h-2.5 w-2.5 fill-[#e6b422] text-[#e6b422]" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0c2222]">
                  Trusted ENT &amp; Aesthetic Care
                </span>
              </div>

              {/* Headline */}
              <h1 className="mt-5 max-w-[620px] text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[#0c2222] sm:text-6xl lg:text-[64px]">
                Holistic
                <br />
                ENT &amp;{" "}
                <span className="relative italic font-normal">
                  <span className="relative z-10">Aesthetic</span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-1 z-0 h-3 bg-[#1d8d8a]/15"
                  />
                </span>{" "}
                Care
                <br />
                at{" "}
                <span className="bg-gradient-to-r from-[#1d8d8a] to-[#2ba8a4] bg-clip-text text-transparent">
                  CENTRA
                </span>
              </h1>

              {/* Description */}
              <p className="mt-5 max-w-[520px] text-[15px] leading-[1.7] text-[#5f7b79] sm:text-base">
                At CENTRA, we believe in a holistic approach to your ears, nose,
                throat, and aesthetic needs. We provide medically sound advice
                and high-quality procedures supported by top-notch facilities.
              </p>

              {/* Trust pills */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {trustPills.map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#0c2222]/6 bg-white px-3 py-1.5 text-xs font-medium text-[#102525] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  >
                    <Check className="h-3 w-3 text-[#1d8d8a]" strokeWidth={3} />
                    {pill}
                  </span>
                ))}
              </div>

              {/* Contact strip */}
              <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-[#0c2222]/6 bg-white/70 px-5 py-3.5 shadow-[0_2px_12px_rgba(16,37,37,0.04)] backdrop-blur-sm sm:gap-5">
                <a
                  href="tel:09989562468"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0c2222] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1d8d8a]"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7b9290]">
                    Direct line
                  </span>
                  <span className="text-base font-bold tracking-tight text-[#0c2222] sm:text-lg">
                    0998 956 2468
                  </span>
                </div>
                <span className="hidden h-8 w-px bg-[#0c2222]/10 sm:block" />
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-[#1d8d8a]" />
                  <span className="text-xs font-medium text-[#5f7b79]">
                    By appointment only
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href="#"
                  className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#1d8d8a] to-[#177a77] py-1.5 pl-6 pr-1.5 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(29,141,138,0.32)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(29,141,138,0.42)]"
                >
                  Book Appointment
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1d8d8a] transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>

                <a
                  href="#specialties"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#102525] transition hover:text-[#1d8d8a]"
                >
                  <span className="border-b border-[#102525]/20 pb-0.5 transition group-hover:border-[#1d8d8a]">
                    Explore specialties
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>

            {/* ===== RIGHT VISUAL ===== */}
            <div className="relative mx-auto w-full max-w-[540px] lg:mx-0">
              <div className="relative">
                {/* Offset frame */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-[40px] bg-gradient-to-br from-[#1d8d8a]/15 via-transparent to-[#e6b422]/10 blur-2xl"
                />

                <div className="relative overflow-hidden rounded-[32px] bg-white p-2.5 shadow-[0_30px_80px_-20px_rgba(16,37,37,0.25)] ring-1 ring-black/5">
                  <div className="relative overflow-hidden rounded-[26px]">
                    <img
                      src="/Centra-Doctor.jpg"
                      alt="CENTRA ENT Specialist"
                      className="h-[440px] w-full object-cover object-top sm:h-[500px]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c2222]/50 via-transparent to-transparent"
                    />

                    <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                      <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                          Lead Specialist
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-white">
                          ENT &amp; Aesthetic Surgery
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating: appointment */}
                <div className="absolute -right-3 top-8 z-20 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-[0_16px_40px_-12px_rgba(16,37,37,0.2)] backdrop-blur-md sm:-right-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9f7f6] text-[#1d8d8a]">
                      <Clock3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#102525]">
                        By Appointment
                      </p>
                      <p className="text-[10px] text-[#68817f]">
                        Scheduled only
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating: patients */}
                <div className="absolute -left-3 bottom-8 z-20 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-[0_16px_40px_-12px_rgba(16,37,37,0.2)] backdrop-blur-md sm:-left-6">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2.5">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                        alt=""
                        className="h-9 w-9 rounded-full border-2 border-white object-cover"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                        alt=""
                        className="h-9 w-9 rounded-full border-2 border-white object-cover"
                      />
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#0c2222] text-[10px] font-bold text-white">
                        1.5k
                      </div>
                    </div>
                    <div>
                      <p className="text-base font-bold leading-none text-[#102525]">
                        1,500+
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#68817f]">
                        Happy Patients
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= REST OF SECTIONS ================= */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* ================= WHY CHOOSE US ================= */}
        <section className="relative py-16 sm:py-20 lg:py-24">
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#7b9290]">
              02 — Why CENTRA
            </span>
            <span className="h-px flex-1 bg-[#0c2222]/10" />
          </div>

          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* Left: heading */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1d8d8a]/15 bg-[#e9f7f6] px-3 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#1d8d8a]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1d8d8a]">
                  Why Choose Us
                </span>
              </div>

              <h2 className="mt-4 text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#0c2222] sm:text-4xl lg:text-[42px]">
                Why patients choose{" "}
                <span className="italic font-normal text-[#1d8d8a]">
                  CENTRA
                </span>
              </h2>

              <p className="mt-4 max-w-md text-sm leading-[1.7] text-[#68817f] sm:text-base">
                Patient-centered ENT and aesthetic care delivered with quality,
                safety, and professional medical guidance.
              </p>

              <a
                href="#"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0c2222] transition hover:text-[#1d8d8a]"
              >
                <span className="border-b border-[#0c2222]/20 pb-0.5 transition group-hover:border-[#1d8d8a]">
                  Our approach
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            {/* Right: list */}
            <div>
              {features.map((item, index) => {
                const Icon = item.icon;
                const isLast = index === features.length - 1;

                return (
                  <div
                    key={item.number}
                    className={`group relative grid grid-cols-[auto_1fr] gap-5 py-5 ${
                      !isLast ? "border-b border-[#0c2222]/8" : ""
                    }`}
                  >
                    <div className="pt-0.5">
                      <span className="block text-[2rem] font-black leading-none tracking-tighter text-[#e0e6e5] transition-colors duration-300 group-hover:text-[#1d8d8a] sm:text-[2.25rem]">
                        {item.number}
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-[#1d8d8a]/10 bg-[#e9f7f6] text-[#1d8d8a] transition-all duration-300 group-hover:-rotate-6 group-hover:bg-[#1d8d8a] group-hover:text-white">
                        <Icon className="h-[18px] w-[18px]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[17px] font-semibold tracking-tight text-[#0c2222] transition-colors group-hover:text-[#1d8d8a] sm:text-lg">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-[1.65] text-[#68817f] sm:text-[15px]">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= SPECIALTIES ================= */}
        <section id="specialties" className="relative py-12 sm:py-16 lg:py-20">
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#7b9290]">
              03 — Specialties
            </span>
            <span className="h-px flex-1 bg-[#0c2222]/10" />
          </div>

          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="max-w-2xl text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#0c2222] sm:text-4xl lg:text-[42px]">
                Ear, Nose, Throat
                <br />
                &amp;{" "}
                <span className="italic font-normal">Aesthetics</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-[1.7] text-[#5f7b79] sm:text-base">
                Focused care designed for ENT concerns and aesthetic needs — all
                delivered with quality, safety, and medical expertise.
              </p>
            </div>

            <a
              href="#"
              className="group inline-flex items-center gap-3 self-start rounded-full border border-[#0c2222]/10 bg-white px-5 py-2.5 text-sm font-semibold text-[#0c2222] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:border-[#1d8d8a]/30 hover:shadow-[0_8px_24px_rgba(16,37,37,0.08)]"
            >
              View all specialties
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0c2222] text-white transition group-hover:bg-[#1d8d8a]">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {specialties.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#0c2222]/6 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-[#1d8d8a]/20 hover:shadow-[0_24px_48px_-16px_rgba(16,37,37,0.12)]"
                >
                  <span className="pointer-events-none absolute -right-2 -top-4 select-none text-[4.5rem] font-black leading-none tracking-tighter text-[#f4f5f4] transition-colors group-hover:text-[#e9f7f6]">
                    {item.number}
                  </span>

                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1d8d8a]/10 bg-[#e9f7f6] text-[#1d8d8a] transition-all duration-300 group-hover:-rotate-6 group-hover:bg-[#1d8d8a] group-hover:text-white">
                      <Icon className="h-[22px] w-[22px]" />
                    </div>

                    <h3 className="mt-6 text-xl font-semibold tracking-tight text-[#0c2222]">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-[1.65] text-[#68817f]">
                      {item.desc}
                    </p>

                    <a
                      href="#"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0c2222] transition group-hover:text-[#1d8d8a]"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= CTA STRIP ================= */}
        <section className="pb-16 pt-4 sm:pb-20 lg:pb-24">
          <div className="relative overflow-hidden rounded-[32px] bg-[#0c2222] p-7 text-white shadow-[0_30px_80px_-24px_rgba(16,37,37,0.4)] sm:p-9 lg:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-[#1d8d8a]/30 blur-[100px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-[#e6b422]/10 blur-[100px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px",
              }}
            />

            <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4dd0c8]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">
                    Accepting new patients
                  </span>
                </div>

                <h3 className="mt-5 max-w-xl text-[1.6rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-4xl lg:text-[40px]">
                  ENT and aesthetic care with{" "}
                  <span className="italic font-normal text-[#4dd0c8]">
                    medically sound
                  </span>{" "}
                  treatment.
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-[1.7] text-white/70 sm:text-base">
                  Expert guidance, high-quality procedures, and a
                  patient-centered experience supported by top-notch facilities
                  and reliable materials.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <a
                    href="#"
                    className="group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-6 pr-1.5 text-sm font-semibold text-[#0c2222] shadow-lg transition-all hover:-translate-y-0.5"
                  >
                    Book Appointment
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0c2222] text-white transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </a>

                  <a
                    href="tel:09989562468"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
                  >
                    <Phone className="h-4 w-4" />
                    0998 956 2468
                  </a>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs text-white/50">
                  <MapPin className="h-3.5 w-3.5" />
                  1488 A. Apolinario St., Makati City
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 text-base font-semibold">Safe &amp; Trusted</h4>
                  <p className="mt-2 text-sm leading-[1.65] text-white/65">
                    Professional care, trusted standards, and patient-first
                    procedures.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <Globe2 className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 text-base font-semibold">
                    Quality Experience
                  </h4>
                  <p className="mt-2 text-sm leading-[1.65] text-white/65">
                    Comfortable consultations and carefully delivered treatments
                    in a modern clinic setting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
