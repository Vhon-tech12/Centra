"use client";

import { useState } from "react";

const steps = [
  {
    number: "01",
    title: "Choose Your Service & Specialist",
    description:
      "Select the ENT concern (ear, nose, throat) and pick the right doctor based on expertise.",
  },
  {
    number: "02",
    title: "Select Date & Time",
    description:
      "Choose a convenient date and time from the doctor's available schedule to book your appointment without any hassle.",
  },
  {
    number: "03",
    title: "Confirm via SMS",
    description:
      "Receive an SMS confirmation with your appointment details, schedule, and reminders — no app download required.",
  },
];

export default function AppointmentJourney() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="overflow-hidden bg-[#f7f6f2] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-x-14 gap-y-14 lg:grid-cols-2">

          {/* ===== LEFT COLUMN ===== */}
          <div className="flex flex-col">
            <div className="max-w-xl lg:max-w-lg">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#0d2323] px-4 py-1.5 shadow-sm">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1d8d8a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  Our Process
                </span>
              </div>

              {/* Heading */}
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#0d2323] sm:text-5xl">
                Our Appointment Journey
              </h2>
            </div>

            {/* Image — stretches to fill remaining height */}
            <div className="relative mt-10 flex-1">
              <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-[#1d8d8a]/10 blur-3xl" />
              <div className="absolute -right-8 bottom-0 h-48 w-48 rounded-full bg-sky-200/30 blur-3xl" />

              <div className="relative h-full min-h-[280px] overflow-hidden rounded-[28px] border border-[#dbe9e7] bg-white p-3 shadow-[0_20px_60px_rgba(16,37,37,0.08)]">
                <div className="h-full overflow-hidden rounded-[22px]">
                  <img
                    src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1200&q=80"
                    alt="Doctor consulting with a patient"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="flex flex-col justify-center">
            {/* Description — sits above the step containers */}
            <p className="mb-6 text-base leading-8 text-[#5f7b79] sm:text-lg">
              Booking an ENT consultation is easy and transparent. Patients
              can explore services, select an experienced ENT specialist,
              schedule a suitable date and time, and receive an SMS
              confirmation — all in just a few minutes.
            </p>

            {/* Step containers */}
            <div className="flex flex-col gap-4">
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                return (
                  <button
                    key={step.number}
                    type="button"
                    onMouseEnter={() => setActiveStep(index)}
                    onFocus={() => setActiveStep(index)}
                    onClick={() => setActiveStep(index)}
                    className={`group w-full text-left rounded-[24px] border p-6 transition-all duration-300 ${
                      isActive
                        ? "border-[#1d8d8a] bg-[#1d8d8a] text-white shadow-[0_18px_45px_rgba(29,141,138,0.25)]"
                        : "border-[#dbe9e7] bg-white hover:border-[#bcdedb] hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-5">
                      <div
                        className={`text-3xl font-bold leading-none tracking-tight sm:text-4xl ${
                          isActive ? "text-white" : "text-[#c8d9d7]"
                        }`}
                      >
                        {step.number}
                      </div>

                      <div className="flex-1 pt-0.5">
                        <h3
                          className={`text-lg font-semibold sm:text-xl ${
                            isActive ? "text-white" : "text-[#0d2323]"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`mt-2 text-sm leading-7 sm:text-base ${
                            isActive ? "text-white/85" : "text-[#5f7b79]"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
