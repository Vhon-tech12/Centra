"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SoapNoteModal from "./soapnotemodal";

type Prescription = {
    id?: string;
    medicationId?: string | null;
    generic: string;
    brandName?: string | null;
    quantity?: string | null;
    dosage?: string | null;
    instructions?: string | null;
};

type RawPrescription = {
    id?: string;
    medicationId?: string | null;
    generic?: string;
    drug?: string;
    brandName?: string;
    quantity?: string;
    dosage?: string;
    dose?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
};

type SoapNote = {
    id?: string;
    chiefComplaint?: string | null;
    historyOfIllness?: string | null;
    remarks?: string | null;
    diagnosis?: string | null;
    plan?: string | null;
    followUp?: string | null;
    imageData?: string | null;
    diagnosticImages?: string[];
    prescriptions?: Prescription[];
    createdAt?: string;
};

function getPrescriptionTitle(rx: Prescription) {
    return rx.brandName?.trim()
        ? `${rx.generic} (${rx.brandName})`
        : rx.generic;
}

function getPrescriptionMeta(rx: Prescription) {
    return [rx.quantity, rx.dosage].filter(Boolean).join(" • ");
}

function safeText(value: unknown) {
    return typeof value === "string" ? value : "";
}

function normalizeStringArray(value: unknown) {
    if (!Array.isArray(value)) return [] as string[];
    return value
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter((item) => item.length > 0);
}

function normalizeSoapNote(note: any): SoapNote | null {
    if (!note) return null;
    const rawPrescriptions = Array.isArray(note?.prescriptions)
        ? note.prescriptions
        : Array.isArray(note?.prescriptionsList)
            ? note.prescriptionsList
            : [];
    const prescriptions: Prescription[] = rawPrescriptions
        .map((rx: RawPrescription) => ({
            id: rx?.id,
            medicationId: rx?.medicationId ?? null,
            generic: safeText(rx?.generic || rx?.drug),
            brandName: safeText(rx?.brandName),
            quantity: safeText(rx?.quantity),
            dosage: safeText(rx?.dosage) ||
                [safeText(rx?.dose), safeText(rx?.frequency), safeText(rx?.duration)]
                .filter(Boolean)
                .join(" • "),
            instructions: safeText(rx?.instructions),
        }))
        .filter((rx: Prescription) => rx.generic.trim().length > 0);

    const fallbackImage = safeText(note?.imageData);
    const diagnosticImages = normalizeStringArray(note?.diagnosticImages);
    return {
        id: note?.id,
        chiefComplaint: safeText(note?.chiefComplaint),
        historyOfIllness: safeText(note?.historyOfIllness),
        remarks: safeText(note?.remarks),
        diagnosis: safeText(note?.diagnosis),
        plan: safeText(note?.plan),
        followUp: safeText(note?.followUp),
        imageData: diagnosticImages[0] || fallbackImage || null,
        diagnosticImages: diagnosticImages.length > 0
            ? diagnosticImages
            : fallbackImage
                ? [fallbackImage]
                : [],
        prescriptions,
        createdAt: note?.createdAt,
    };
}

async function safeJson(res: Response) {
    try {
        return await res.json();
    } catch {
        return null;
    }
}

const PatientNotes = ({ patient }: any) => {
    const { data: session, status } = useSession();
    const [soapNotes, setSoapNotes] = useState<SoapNote[]>([]);
    const [selectedSoapNote, setSelectedSoapNote] = useState<SoapNote | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isSoapModalOpen, setIsSoapModalOpen] = useState(false);
    const patientId = patient?.id;

    const fetchSoapNotes = useCallback(async () => {
        if (!patientId || status === "loading") return;
        const role = String(session?.user?.role || "").toUpperCase();
        if (role !== "ADMIN" && role !== "DOCTOR") {
            const note = normalizeSoapNote(patient?.soapNote);
            setSoapNotes(note ? [note] : []);
            setSelectedSoapNote(note);
            return;
        }
        try {
            setLoading(true);
            setError("");
            const apiPath =
                role === "DOCTOR"
                    ? `/api/doctor/soap-notes?patientId=${patientId}`
                    : `/api/admin/soap-notes?patientId=${patientId}`;
            const res = await fetch(apiPath, { cache: "no-store" });
            const data = await safeJson(res);
            if (!res.ok) {
                throw new Error(data?.error || "Failed to load SOAP notes");
            }
            const notes = Array.isArray(data?.soapNotes) ? data.soapNotes : [];
            const normalizedNotes = notes.map(normalizeSoapNote).filter(Boolean) as SoapNote[];
            setSoapNotes(normalizedNotes);
            if (normalizedNotes.length > 0) {
                setSelectedSoapNote(normalizedNotes[0]);
            } else {
                const fallback = normalizeSoapNote(patient?.soapNote);
                setSelectedSoapNote(fallback);
                if (fallback) {
                    setSoapNotes([fallback]);
                }
            }
        } catch (err) {
            console.error("[PATIENT-NOTES-FETCH-ERROR]", err);
            setError(err instanceof Error ? err.message : "Failed to load SOAP notes");
            const fallback = normalizeSoapNote(patient?.soapNote);
            setSelectedSoapNote(fallback);
            if (fallback) {
                setSoapNotes([fallback]);
            }
        } finally {
            setLoading(false);
        }
    }, [patientId, patient?.soapNote, session?.user?.role, status]);

    useEffect(() => {
        void fetchSoapNotes();
    }, [fetchSoapNotes]);

    useEffect(() => {
        const handleSoapSaved = (event: Event) => {
            const customEvent = event as CustomEvent<{ patientId?: string }>;
            if (customEvent.detail?.patientId === patientId) {
                void fetchSoapNotes();
            }
        };
        window.addEventListener("soap-note-saved", handleSoapSaved as EventListener);
        return () => {
            window.removeEventListener("soap-note-saved", handleSoapSaved as EventListener);
        };
    }, [fetchSoapNotes, patientId]);

    const handleSoapNoteSaved = () => {
        void fetchSoapNotes();
    };

    const renderPrescriptions = (prescriptions?: Prescription[]) => {
        if (!prescriptions || prescriptions.length === 0) return null;
        return (
            <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Prescriptions</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                    {prescriptions.map((rx: Prescription, idx: number) => (
                        <div
                            key={rx.id || idx}
                            className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 to-white px-4 py-3 shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-emerald-900">{getPrescriptionTitle(rx)}</p>
                                <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                    RX
                                </span>
                            </div>
                            {!!getPrescriptionMeta(rx) && (
                                <p className="mt-0.5 text-xs text-emerald-700/80">{getPrescriptionMeta(rx)}</p>
                            )}
                            {rx.instructions?.trim() && (
                                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{rx.instructions}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderDiagnosticImages = (diagnosticImages?: string[]) => {
        if (!diagnosticImages || diagnosticImages.length === 0) return null;
        return (
            <div className="mt-3">
                <div className="flex items-center gap-2 mb-2.5">
                    <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Diagnostic Images</p>
                    <span className="ml-auto text-[10px] text-slate-400">{diagnosticImages.length} image(s)</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {diagnosticImages.map((image, index) => (
                        <button
                            key={`${index}-${image.slice(0, 20)}`}
                            type="button"
                            onClick={() => setPreviewImage(image)}
                            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition hover:border-indigo-300 hover:shadow-md hover:ring-2 hover:ring-indigo-100/50"
                        >
                            <div className="aspect-video w-full overflow-hidden bg-slate-100">
                                <img
                                    src={image}
                                    alt={`Diagnostic image ${index + 1}`}
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 opacity-0 shadow-sm transition group-hover:opacity-100">
                                    🔍 View
                                </span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-2">
                                <p className="text-[10px] font-medium text-white/90">Image {index + 1}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderSoapNoteCard = (note: SoapNote, index: number) => {
        const isSelected = selectedSoapNote?.id === note.id;
        const dateObj = note.createdAt ? new Date(note.createdAt) : null;
        const formattedDate = dateObj
            ? dateObj.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })
            : "Date unknown";
        const formattedTime = dateObj
            ? dateObj.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })
            : "";

        return (
            <div
                key={note.id || index}
                className={`group rounded-2xl border transition-all duration-200 cursor-pointer ${isSelected
                        ? "border-sky-400 bg-gradient-to-br from-sky-50/80 to-white shadow-lg shadow-sky-100/50 ring-2 ring-sky-200/60"
                        : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/60"
                    }`}
                onClick={() => setSelectedSoapNote(note)}
            >
                {/* Header — always visible */}
                <div className="px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${isSelected
                                    ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
                                    : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                                }`}>
                                {index + 1}
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-700">{formattedDate}</span>
                                    {formattedTime && (
                                        <span className="text-xs text-slate-400">{formattedTime}</span>
                                    )}
                                </div>
                                {note.chiefComplaint && (
                                    <p className="truncate text-xs text-slate-500 max-w-[220px] sm:max-w-[300px]">
                                        {note.chiefComplaint}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            {note.diagnosis && (
                                <span className="hidden sm:inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-medium text-indigo-700 border border-indigo-100/60">
                                    DX
                                </span>
                            )}
                            {note.prescriptions && note.prescriptions.length > 0 && (
                                <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100/60">
                                    {note.prescriptions.length} RX
                                </span>
                            )}
                            <svg
                                className={`h-5 w-5 transition-transform duration-200 ${isSelected ? "rotate-180 text-sky-500" : "text-slate-400"
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Expanded content */}
                {isSelected && (
                    <div className="border-t border-slate-200/80 px-5 py-4 space-y-4 bg-white/50 rounded-b-2xl">
                        {/* Chief Complaint */}
                        {note.chiefComplaint && (
                            <div className="rounded-xl bg-sky-50/60 px-4 py-3 border border-sky-100/60">
                                <div className="flex items-center gap-2">
                                    <svg className="h-4 w-4 text-sky-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-700">Chief Complaint</p>
                                </div>
                                <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{note.chiefComplaint}</p>
                            </div>
                        )}

                        {/* History of Illness */}
                        {note.historyOfIllness && (
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">History of Present Illness</p>
                                </div>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50/60 rounded-xl px-4 py-3 border border-slate-100/60">
                                    {note.historyOfIllness}
                                </p>
                            </div>
                        )}

                        {/* Remarks */}
                        {note.remarks && (
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Remarks</p>
                                </div>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50/60 rounded-xl px-4 py-3 border border-slate-100/60">
                                    {note.remarks}
                                </p>
                            </div>
                        )}

                        {/* Diagnosis + Images */}
                        {note.diagnosis && (
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Diagnosis</p>
                                </div>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-indigo-50/40 rounded-xl px-4 py-3 border border-indigo-100/60">
                                    {note.diagnosis}
                                </p>
                                {renderDiagnosticImages(note.diagnosticImages)}
                            </div>
                        )}

                        {/* Plan */}
                        {note.plan && (
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <svg className="h-4 w-4 text-teal-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Treatment Plan</p>
                                </div>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-teal-50/40 rounded-xl px-4 py-3 border border-teal-100/60">
                                    {note.plan}
                                </p>
                            </div>
                        )}

                        {/* Follow-up */}
                        {note.followUp && (
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <svg className="h-4 w-4 text-rose-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Follow-up</p>
                                </div>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-rose-50/40 rounded-xl px-4 py-3 border border-rose-100/60">
                                    {note.followUp}
                                </p>
                            </div>
                        )}

                        {renderPrescriptions(note.prescriptions)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="space-y-5">
                {/* Header with count and status */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700">
                                {soapNotes.length > 0
                                    ? `${soapNotes.length} consultation${soapNotes.length > 1 ? "s" : ""} recorded`
                                    : "No consultations recorded"}
                            </p>
                            {loading && (
                                <p className="mt-0.5 text-xs text-sky-600 flex items-center gap-1.5">
                                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500" />
                                    Loading consultations...
                                </p>
                            )}
                            {!!error && (
                                <p className="mt-0.5 text-xs text-rose-600 flex items-center gap-1.5">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </p>
                            )}
                        </div>
                    </div>
                    {soapNotes.length > 0 && !loading && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100/60">
                            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {soapNotes.length} record{soapNotes.length > 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                {/* Loading skeleton */}
                {loading && soapNotes.length === 0 && (
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                                        <div className="h-3 w-48 animate-pulse rounded bg-slate-100" />
                                    </div>
                                    <div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && soapNotes.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50/80 to-white p-10 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                            <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-600">No consultation records yet</p>
                        <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                            Click the &ldquo;Add SOAP Note&rdquo; button to create the first consultation record for this patient.
                        </p>
                    </div>
                )}

                {/* Notes list */}
                {!loading && soapNotes.length > 0 && (
                    <div className="space-y-3">
                        {soapNotes.map((note, index) => renderSoapNoteCard(note, index))}
                    </div>
                )}
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            onClick={() => setPreviewImage(null)}
                            className="absolute -right-3 -top-3 z-10 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg transition hover:bg-slate-100 hover:shadow-xl"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Close
                        </button>
                        <div className="overflow-hidden rounded-2xl bg-white/10 p-2 shadow-2xl backdrop-blur-sm">
                            <div className="overflow-hidden rounded-xl bg-white">
                                <img
                                    src={previewImage}
                                    alt="Diagnostic preview"
                                    className="max-h-[85vh] w-full object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SOAP Note Modal */}
            <SoapNoteModal
                open={isSoapModalOpen}
                onClose={() => {
                    setIsSoapModalOpen(false);
                    handleSoapNoteSaved();
                }}
                patient={patient}
                onSaved={handleSoapNoteSaved}
            />
        </>
    );
};

export default PatientNotes;