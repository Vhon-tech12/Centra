"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Activity,
  BarChart3,
  CalendarDays,
  RefreshCcw,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  UserCheck,
  Stethoscope,
  Shield,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  Filter,
  Search,
  Sparkles,
  HeartPulse,
  Hospital,
  Brain,
  Ear,
  Eye,
  Bone,
  Printer,
  ChevronDown,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Cell } from "recharts";

// ─── Dynamic imports ───
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), {
  ssr: false,
});
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), {
  ssr: false,
});
const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), {
  ssr: false,
});
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), {
  ssr: false,
});
const LineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  { ssr: false }
);
const Line = dynamic(() => import("recharts").then((mod) => mod.Line), {
  ssr: false,
});
const AreaChart = dynamic(
  () => import("recharts").then((mod) => mod.AreaChart),
  { ssr: false }
);
const Area = dynamic(() => import("recharts").then((mod) => mod.Area), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), {
  ssr: false,
});
const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false }
);
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), {
  ssr: false,
});
const Legend = dynamic(() => import("recharts").then((mod) => mod.Legend), {
  ssr: false,
});

// ─── TYPES ───
type AppointmentBarItem = {
  month: string;
  count: number;
};

type ConsultationItem = {
  name: string;
  value: number;
};

type ServiceStat = {
  name: string;
  percentage: number;
};

type TodayAppointment = {
  id: string;
  fullName: string;
  appointmentTime: string;
  serviceType: string;
  status: string;
};

type BusinessServiceStat = {
  name: string;
  count: number;
  percentage: number;
};

type BusinessDayStat = {
  day: string;
  count: number;
  percentage: number;
};

type BusinessTimeStat = {
  timeBlock: string;
  count: number;
  percentage: number;
};

type StatusBreakdownItem = {
  status: string;
  count: number;
  percentage: number;
};

type DoctorWorkloadItem = {
  doctorId: string;
  doctorName: string;
  count: number;
  percentage: number;
};

type BusinessInsights = {
  generatedAt: string;
  currentMonthLabel: string;
  previousMonthLabel: string;
  currentMonthBookings: number;
  previousMonthBookings: number;
  bookingGrowthPercentage: number;
  growthDirection: "up" | "down" | "flat";
  topService: BusinessServiceStat | null;
  lowestService: BusinessServiceStat | null;
  busiestDay: BusinessDayStat | null;
  peakTime: BusinessTimeStat | null;
  cancellationRate: number;
  cancelledOrRejectedCount: number;
  statusBreakdown: StatusBreakdownItem[];
  serviceStats: BusinessServiceStat[];
  dayStats: BusinessDayStat[];
  timeBlockStats: BusinessTimeStat[];
  doctorWorkload: DoctorWorkloadItem[];
  recommendations: string[];
};

type ClinicalFindingItem = {
  anatomy: string;
  diagnosis: string;
  count: number;
};

type PrescriptionStats = {
  totalPrescriptions: number;
  topMeds: { name: string; count: number }[];
  monthlyTrend: { month: string; count: number }[];
};

type AgeDistribution = {
  ageGroups: { group: string; count: number }[];
  avgAge: number;
};

type GenderDistribution = {
  genderData: { name: string; count: number }[];
};

// ─── COLOR SCHEMES ───
const COLOR_SCHEMES = [
  { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200", dot: "bg-indigo-500", fill: "#6366f1", gradFrom: "#818cf8", gradTo: "#4f46e5" },
  { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", dot: "bg-emerald-500", fill: "#10b981", gradFrom: "#34d399", gradTo: "#059669" },
  { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", dot: "bg-amber-500", fill: "#f59e0b", gradFrom: "#fbbf24", gradTo: "#d97706" },
  { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", dot: "bg-rose-500", fill: "#f43f5e", gradFrom: "#fb7185", gradTo: "#e11d48" },
  { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200", dot: "bg-violet-500", fill: "#8b5cf6", gradFrom: "#a78bfa", gradTo: "#7c3aed" },
  { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200", dot: "bg-teal-500", fill: "#14b8a6", gradFrom: "#2dd4bf", gradTo: "#0d9488" },
  { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200", dot: "bg-cyan-500", fill: "#06b6d4", gradFrom: "#22d3ee", gradTo: "#0891b2" },
  { bg: "bg-fuchsia-50", text: "text-fuchsia-600", border: "border-fuchsia-200", dot: "bg-fuchsia-500", fill: "#d946ef", gradFrom: "#e879f9", gradTo: "#c026d3" },
];

const CLINIC_TIME_BLOCKS = [
  "8:00 AM - 9:00 AM",
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
];

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ─── UTILITIES ───
function toNumber(value: unknown): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function normalizeStatus(status: string): string {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getHourFromAppointmentTime(time?: string | null): number | null {
  if (!time) return null;
  const cleaned = time.trim().toUpperCase();
  const amPmMatch = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (amPmMatch) {
    let hour = Number(amPmMatch[1]);
    const period = amPmMatch[3];
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return hour;
  }
  const twentyFourHourMatch = cleaned.match(/^(\d{1,2})(?::(\d{2}))?/);
  if (twentyFourHourMatch) {
    const hour = Number(twentyFourHourMatch[1]);
    if (hour >= 0 && hour <= 23) return hour;
  }
  return null;
}

function getTimeBlock(time?: string | null): string {
  const hour = getHourFromAppointmentTime(time);
  if (hour === null) return "Unspecified";
  if (hour >= 8 && hour < 9) return "8:00 AM - 9:00 AM";
  if (hour >= 9 && hour < 10) return "9:00 AM - 10:00 AM";
  if (hour >= 10 && hour < 11) return "10:00 AM - 11:00 AM";
  if (hour >= 11 && hour < 12) return "11:00 AM - 12:00 PM";
  if (hour >= 12 && hour < 13) return "12:00 PM - 1:00 PM";
  if (hour >= 13 && hour < 14) return "1:00 PM - 2:00 PM";
  if (hour >= 14 && hour < 15) return "2:00 PM - 3:00 PM";
  if (hour >= 15 && hour < 16) return "3:00 PM - 4:00 PM";
  if (hour >= 16 && hour < 17) return "4:00 PM - 5:00 PM";
  return "Outside Clinic Hours";
}

function groupCount<T>(
  items: T[],
  getKey: (item: T) => string
): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = getKey(item) || "N/A";
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

async function safeJsonFetch(url: string): Promise<{ ok: boolean; json: any }> {
  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return { ok: res.ok, json };
  } catch {
    console.error(`[INVALID_JSON_RESPONSE] ${url}`, text.slice(0, 300));
    return {
      ok: false,
      json: {
        error:
          "This API returned HTML instead of JSON. Please check that the route.ts file is inside app/api.",
      },
    };
  }
}

// ─── COMPONENTS ───

function ChartGradientDefs({ prefix, from, to }: { prefix: string; from: string; to: string }) {
  return (
    <defs>
      <linearGradient id={`${prefix}-bar`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={from} stopOpacity={1} />
        <stop offset="100%" stopColor={to} stopOpacity={0.85} />
      </linearGradient>
      <linearGradient id={`${prefix}-bar-h`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={to} stopOpacity={0.95} />
        <stop offset="100%" stopColor={from} stopOpacity={1} />
      </linearGradient>
      <linearGradient id={`${prefix}-line`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={to} />
        <stop offset="100%" stopColor={from} />
      </linearGradient>
      <linearGradient id={`${prefix}-area`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={from} stopOpacity={0.35} />
        <stop offset="100%" stopColor={from} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function SimpleChartCard({
  title,
  subtitle,
  children,
  height = 300,
  colorIndex = 0,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: number;
  colorIndex?: number;
}) {
  const scheme = COLOR_SCHEMES[colorIndex % COLOR_SCHEMES.length];
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]`}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${scheme.gradTo}, ${scheme.gradFrom})`,
        }}
      />

      <div className="mb-4 flex items-start justify-between">
        <div>
          {title && <h3 className="text-sm font-semibold text-gray-800">{title}</h3>}
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full ${scheme.bg}`}
        >
          <div className={`h-2 w-2 rounded-full ${scheme.dot}`} />
        </div>
      </div>
      <div style={{ width: "100%", height }}>{children}</div>
    </div>
  );
}

function SimpleMetricCard({
  label,
  value,
  subLabel,
  icon,
  colorIndex = 0,
}: {
  label: string;
  value: string | number;
  subLabel?: string;
  icon?: React.ReactNode;
  colorIndex?: number;
}) {
  const scheme = COLOR_SCHEMES[colorIndex % COLOR_SCHEMES.length];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-[0.07] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.14]"
        style={{ background: `linear-gradient(135deg, ${scheme.gradFrom}, ${scheme.gradTo})` }}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-gray-900">{value}</p>
          {subLabel && <p className="text-xs text-gray-400">{subLabel}</p>}
        </div>
        {icon && (
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md`}
            style={{
              background: `linear-gradient(135deg, ${scheme.gradFrom}, ${scheme.gradTo})`,
            }}
          >
            <div className="h-5 w-5">{icon}</div>
          </div>
        )}
      </div>

      <div
        className="absolute bottom-0 left-0 h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${scheme.gradTo}, ${scheme.gradFrom})`,
        }}
      />
    </div>
  );
}

// ─── MAIN COMPONENT ───
export default function AnalyticsPage() {
  const { data: session } = useSession();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedMonths, setSelectedMonths] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  ]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [monthsDropdownOpen, setMonthsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [appointmentData, setAppointmentData] = useState<AppointmentBarItem[]>([]);
  const [consultationData, setConsultationData] = useState<ConsultationItem[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([]);
  const [highestService, setHighestService] = useState<ServiceStat | null>(null);
  const [lowestService, setLowestService] = useState<ServiceStat | null>(null);
  const [totalConsultations, setTotalConsultations] = useState<number>(0);
  const [businessInsights, setBusinessInsights] = useState<BusinessInsights | null>(null);
  const [findingsData, setFindingsData] = useState<ClinicalFindingItem[]>([]);
  const [apiError, setApiError] = useState<string>("");
  const [prescriptionStats, setPrescriptionStats] = useState<PrescriptionStats | null>(null);
  const [ageDistribution, setAgeDistribution] = useState<AgeDistribution | null>(null);
  const [genderDistribution, setGenderDistribution] = useState<GenderDistribution | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMonthsDropdownOpen(false);
      }
    };
    if (monthsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [monthsDropdownOpen]);

  const fetchAppointmentData = useCallback(async () => {
    const { ok, json } = await safeJsonFetch(
      `/api/admin/dashboard/appointments?year=${year}&months=${selectedMonths.join(",")}`
    );
    if (ok) {
      setAppointmentData(Array.isArray(json.data) ? json.data : []);
    } else {
      setApiError(json.error || "Failed to load appointment data.");
    }
  }, [selectedMonths, year]);

  const fetchTodayAppointments = useCallback(async () => {
    const { ok, json } = await safeJsonFetch("/api/admin/dashboard/today-appointments");
    if (ok) {
      setTodayAppointments(Array.isArray(json.appointments) ? json.appointments : []);
    } else {
      setApiError(json.error || "Failed to load today's appointments.");
    }
  }, []);

  // ─── Now accepts year + months filter ───
  const fetchConsultationData = useCallback(async () => {
    const { ok, json } = await safeJsonFetch(
      `/api/admin/dashboard/consultations?year=${year}&months=${selectedMonths.join(",")}`
    );
    if (ok) {
      setConsultationData(Array.isArray(json.data) ? json.data : []);
      setHighestService(json.highestService || null);
      setLowestService(json.lowestService || null);
      setTotalConsultations(toNumber(json.totalBookings));
    } else {
      setApiError(json.error || "Failed to load consultation data.");
    }
  }, [selectedMonths, year]);

  // ─── Now accepts year + months filter ───
  const fetchBusinessInsights = useCallback(async () => {
    const { ok, json } = await safeJsonFetch(
      `/api/admin/dashboard/business-insights?year=${year}&months=${selectedMonths.join(",")}`
    );
    if (ok) {
      setBusinessInsights(json);
    } else {
      setApiError(json.error || "Failed to load business insights.");
    }
  }, [selectedMonths, year]);

  // ─── Now accepts year + months filter (backend needs same update) ───
  const fetchFindingsData = useCallback(async () => {
    const { ok, json } = await safeJsonFetch(
      `/api/admin/dashboard/findings?year=${year}&months=${selectedMonths.join(",")}`
    );
    if (ok) {
      setFindingsData(Array.isArray(json.data) ? json.data : []);
    } else {
      console.warn("Failed to load findings data:", json.error);
    }
  }, [selectedMonths, year]);

  // ─── Now accepts year + months filter (backend needs same update) ───
  const fetchPrescriptionStats = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/admin/dashboard/prescription-stats?year=${year}&months=${selectedMonths.join(",")}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (res.ok) {
        setPrescriptionStats(data);
      } else {
        console.warn("Failed to fetch prescription stats:", data.error);
      }
    } catch (error) {
      console.error("Error fetching prescription stats:", error);
    }
  }, [selectedMonths, year]);

  // ─── Now accepts year + months filter (backend needs same update) ───
  const fetchAgeDistribution = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/admin/dashboard/age-distribution?year=${year}&months=${selectedMonths.join(",")}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (res.ok) {
        setAgeDistribution(data);
      } else {
        console.warn("Failed to fetch age distribution:", data.error);
      }
    } catch (error) {
      console.error("Error fetching age distribution:", error);
    }
  }, [selectedMonths, year]);

  // ─── Now accepts year + months filter (backend needs same update) ───
  const fetchGenderDistribution = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/admin/dashboard/gender-distribution?year=${year}&months=${selectedMonths.join(",")}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (res.ok) {
        setGenderDistribution(data);
      } else {
        console.warn("Failed to fetch gender distribution:", data.error);
      }
    } catch (error) {
      console.error("Error fetching gender distribution:", error);
    }
  }, [selectedMonths, year]);

  const refreshAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setApiError("");
      await Promise.all([
        fetchAppointmentData(),
        fetchTodayAppointments(),
        fetchConsultationData(),
        fetchBusinessInsights(),
        fetchFindingsData(),
        fetchPrescriptionStats(),
        fetchAgeDistribution(),
        fetchGenderDistribution(),
      ]);
    } finally {
      setLoading(false);
    }
  }, [
    fetchAppointmentData,
    fetchTodayAppointments,
    fetchConsultationData,
    fetchBusinessInsights,
    fetchFindingsData,
    fetchPrescriptionStats,
    fetchAgeDistribution,
    fetchGenderDistribution,
  ]);

  useEffect(() => {
    if (mounted) {
      void refreshAnalytics();
    }
  }, [mounted, refreshAnalytics]);

  // ─── PRINT FUNCTION ───
  const handlePrint = useCallback(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString();

    const consultMap = new Map<string, number>();
    consultationData.forEach((item) => {
      const name = item.name.trim();
      consultMap.set(name, (consultMap.get(name) || 0) + item.value);
    });
    const uniqueConsultation = Array.from(consultMap.entries()).map(([name, value]) => ({ name, value }));

    const statusMap = new Map<string, { count: number; status: string }>();
    if (businessInsights?.statusBreakdown) {
      businessInsights.statusBreakdown.forEach((item) => {
        let key = item.status.toLowerCase().trim();
        if (['cancelled', 'rejected', 'cancelled/rejected', 'rejected/cancelled'].includes(key)) {
          key = 'cancelled/rejected';
        } else if (['confirmed', 'completed', 'done', 'finished'].includes(key)) {
          key = 'confirmed/completed';
        } else if (['pending', 'scheduled', 'waiting', 'booked'].includes(key)) {
          key = 'pending/scheduled';
        }
        const display = key.split('/').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ');
        if (statusMap.has(key)) {
          statusMap.get(key)!.count += item.count;
        } else {
          statusMap.set(key, { count: item.count, status: display });
        }
      });
    }
    const groupedStatus = Array.from(statusMap.values());

    const todayStatusMap = new Map<string, number>();
    todayAppointments.forEach((item) => {
      const s = normalizeStatus(item.status);
      todayStatusMap.set(s, (todayStatusMap.get(s) || 0) + 1);
    });
    const todayStatus = Array.from(todayStatusMap.entries()).map(([name, count]) => ({ name, count }));

    const todayServiceMap = new Map<string, number>();
    todayAppointments.forEach((item) => {
      const s = item.serviceType || "N/A";
      todayServiceMap.set(s, (todayServiceMap.get(s) || 0) + 1);
    });
    const todayService = Array.from(todayServiceMap.entries()).map(([name, count]) => ({ name, count }));

    const todayTimeMap = new Map<string, number>();
    todayAppointments.forEach((item) => {
      const b = getTimeBlock(item.appointmentTime);
      todayTimeMap.set(b, (todayTimeMap.get(b) || 0) + 1);
    });
    const todayTime = Array.from(todayTimeMap.entries()).map(([name, count]) => ({ name, count }));

    const totalBookings = appointmentData.reduce((sum, item) => sum + toNumber(item.count), 0);
    const uniquePatients = new Set(todayAppointments.map((item) => item.fullName)).size;
    const cancellationRate = businessInsights?.cancellationRate || 0;

    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title> </title>
  <style>
    @page { margin: 15mm; }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Arial, Helvetica, sans-serif; background: #fff; color: #000; font-size: 12px; line-height: 1.4; padding: 0; }
    .container { width: 100%; max-width: 1000px; margin: 0 auto; }
    .report-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 25px; page-break-inside: avoid; }
    .header-left { display: flex; align-items: center; gap: 15px; }
    .logo-img { width: 60px; height: 60px; object-fit: contain; border-radius: 50%; border: 1px solid #000; }
    .clinic-info h1 { font-size: 20px; margin: 0 0 2px 0; text-transform: uppercase; letter-spacing: 1px; }
    .clinic-info p { font-size: 12px; color: #333; margin: 0; }
    .header-right { text-align: right; font-size: 11px; }
    .header-right p { margin: 2px 0; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 25px; page-break-inside: avoid; }
    .summary-box { border: 1px solid #000; padding: 10px; text-align: center; }
    .summary-box .label { font-size: 10px; text-transform: uppercase; font-weight: bold; }
    .summary-box .value { font-size: 18px; font-weight: bold; margin-top: 5px; }
    .summary-box .sub { font-size: 10px; color: #555; }
    .section { margin-bottom: 25px; page-break-inside: auto; }
    .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 10px; page-break-after: avoid; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; page-break-inside: auto; }
    th, td { border: 1px solid #000; padding: 6px 8px; text-align: left; font-size: 11px; }
    th { background-color: #f0f0f0; font-weight: bold; text-transform: uppercase; page-break-after: avoid; }
    tr { page-break-inside: avoid; page-break-after: auto; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .report-footer { margin-top: 50px; border-top: 1px solid #000; padding-top: 15px; font-size: 10px; width: 100%; page-break-inside: avoid; }
    .footer-table { width: 100%; border: none; margin: 0; padding: 0; }
    .footer-table td { border: none; padding: 0; vertical-align: bottom; }
    .signature-box { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px; font-weight: bold; margin-left: auto; }
  </style>
</head>
<body>
<div class="container">
  <div class="report-header">
    <div class="header-left">
      <img src="/centraLogo.jpg" alt="Centra Clinic Logo" class="logo-img" />
      <div class="clinic-info">
        <h1>CENTRA CLINIC</h1>
        <p>Analytics and Operations Report</p>
      </div>
    </div>
    <div class="header-right">
      <p><strong>Generated on:</strong> ${dateStr} at ${timeStr}</p>
      <p><strong>Report Period:</strong> ${businessInsights?.currentMonthLabel || 'Current'}</p>
    </div>
  </div>

  <div class="summary-grid">
    <div class="summary-box">
      <div class="label">Total Bookings</div>
      <div class="value">${totalBookings}</div>
      <div class="sub">${businessInsights?.bookingGrowthPercentage || 0}% vs last month</div>
    </div>
    <div class="summary-box">
      <div class="label">Patients Today</div>
      <div class="value">${uniquePatients}</div>
    </div>
    <div class="summary-box">
      <div class="label">Consultations</div>
      <div class="value">${totalConsultations}</div>
    </div>
    <div class="summary-box">
      <div class="label">Cancellation Rate</div>
      <div class="value">${cancellationRate}%</div>
    </div>
  </div>`;

    if (ageDistribution && genderDistribution) {
      const pediatricCount = ageDistribution.ageGroups.find(g => g.group === "0-12")?.count || 0;
      const adultCount = (ageDistribution.ageGroups.find(g => g.group === "13-19")?.count || 0) + 
                         (ageDistribution.ageGroups.find(g => g.group === "20-59")?.count || 0);
      const geriatricCount = ageDistribution.ageGroups.find(g => g.group === "60+")?.count || 0;
      const totalAge = pediatricCount + adultCount + geriatricCount;
      const totalGender = genderDistribution.genderData.reduce((s, g) => s + g.count, 0);

      const groupedAges = [
        { group: "Pediatric (0-12)", count: pediatricCount, desc: "Infants, children & young teens" },
        { group: "Adult (13-59)", count: adultCount, desc: "Teenagers, adults & middle-aged" },
        { group: "Geriatric (60+)", count: geriatricCount, desc: "Senior citizens" },
      ];

      html += `
  <div class="section">
    <div class="section-title">Patient Demographics</div>
    <div style="display: flex; gap: 20px; margin-bottom: 15px;">
      <div style="flex: 1;">
        <p style="font-weight:bold; margin-bottom:5px; font-size:11px;">Age Distribution (Avg Age: ${ageDistribution.avgAge})</p>
        <table>
          <thead><tr><th>Age Group</th><th>Description</th><th class="text-right">Count</th><th class="text-right">Percentage</th></tr></thead>
          <tbody>`;
      groupedAges.forEach((group) => {
        const pct = totalAge > 0 ? ((group.count / totalAge) * 100).toFixed(1) : 0;
        html += `<tr><td>${group.group}</td><td>${group.desc}</td><td class="text-right">${group.count}</td><td class="text-right">${pct}%</td></tr>`;
      });
      html += `</tbody></table></div>
      <div style="flex: 1;">
        <p style="font-weight:bold; margin-bottom:5px; font-size:11px;">Gender Distribution</p>
        <table>
          <thead><tr><th>Gender</th><th>Description</th><th class="text-right">Count</th><th class="text-right">Percentage</th></tr></thead>
          <tbody>`;
      genderDistribution.genderData.forEach((gender) => {
        const pct = totalGender > 0 ? ((gender.count / totalGender) * 100).toFixed(1) : 0;
        const genderDesc = gender.name === 'Male' ? 'Male patients' : gender.name === 'Female' ? 'Female patients' : 'Other/Unspecified';
        html += `<tr><td>${gender.name}</td><td>${genderDesc}</td><td class="text-right">${gender.count}</td><td class="text-right">${pct}%</td></tr>`;
      });
      html += `</tbody></table></div>
    </div>
  </div>`;
    }

    if (uniqueConsultation.length > 0) {
      const total = uniqueConsultation.reduce((s, i) => s + i.value, 0);
      html += `
  <div class="section">
    <div class="section-title">Consultation Service Distribution</div>
    <table>
      <thead><tr><th>Service Name</th><th class="text-right">Count</th><th class="text-right">Percentage</th></tr></thead>
      <tbody>`;
      uniqueConsultation.forEach((item) => {
        const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
        html += `<tr><td>${item.name}</td><td class="text-right">${item.value}</td><td class="text-right">${pct}%</td></tr>`;
      });
      html += `</tbody></table></div>`;
    }

    if (groupedStatus.length > 0) {
      const total = groupedStatus.reduce((s, i) => s + i.count, 0);
      html += `
  <div class="section">
    <div class="section-title">Appointment Status Breakdown</div>
    <table>
      <thead><tr><th>Status</th><th class="text-right">Count</th><th class="text-right">Percentage</th></tr></thead>
      <tbody>`;
      groupedStatus.forEach((item) => {
        const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
        html += `<tr><td>${item.status}</td><td class="text-right">${item.count}</td><td class="text-right">${pct}%</td></tr>`;
      });
      html += `</tbody></table></div>`;
    }

    if (businessInsights?.serviceStats && businessInsights.serviceStats.length > 0) {
      const total = businessInsights.serviceStats.reduce((s, i) => s + i.count, 0);
      html += `
  <div class="section">
    <div class="section-title">Service Demand Ranking</div>
    <table>
      <thead><tr><th>Service Name</th><th class="text-right">Bookings</th><th class="text-right">Percentage</th></tr></thead>
      <tbody>`;
      businessInsights.serviceStats.forEach((item) => {
        const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
        html += `<tr><td>${item.name}</td><td class="text-right">${item.count}</td><td class="text-right">${pct}%</td></tr>`;
      });
      html += `</tbody></table></div>`;
    }

    if (businessInsights?.dayStats && businessInsights.dayStats.length > 0) {
      const total = businessInsights.dayStats.reduce((s, i) => s + i.count, 0);
      html += `
  <div class="section">
    <div class="section-title">Busiest Booking Days</div>
    <table>
      <thead><tr><th>Day of Week</th><th class="text-right">Bookings</th><th class="text-right">Percentage</th></tr></thead>
      <tbody>`;
      businessInsights.dayStats.forEach((item) => {
        const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
        html += `<tr><td>${item.day}</td><td class="text-right">${item.count}</td><td class="text-right">${pct}%</td></tr>`;
      });
      html += `</tbody></table></div>`;
    }

    if (businessInsights?.timeBlockStats && businessInsights.timeBlockStats.length > 0) {
      const total = businessInsights.timeBlockStats.reduce((s, i) => s + i.count, 0);
      html += `
  <div class="section">
    <div class="section-title">Peak Booking Sessions</div>
    <table>
      <thead><tr><th>Time Block</th><th class="text-right">Bookings</th><th class="text-right">Percentage</th></tr></thead>
      <tbody>`;
      businessInsights.timeBlockStats.forEach((item) => {
        const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
        html += `<tr><td>${item.timeBlock}</td><td class="text-right">${item.count}</td><td class="text-right">${pct}%</td></tr>`;
      });
      html += `</tbody></table></div>`;
    }

    if (businessInsights?.doctorWorkload && businessInsights.doctorWorkload.length > 0) {
      const total = businessInsights.doctorWorkload.reduce((s, i) => s + i.count, 0);
      html += `
  <div class="section">
    <div class="section-title">Doctor Workload</div>
    <table>
      <thead><tr><th>Doctor Name</th><th class="text-right">Appointments</th><th class="text-right">Percentage</th></tr></thead>
      <tbody>`;
      businessInsights.doctorWorkload.forEach((item) => {
        const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
        html += `<tr><td>${item.doctorName}</td><td class="text-right">${item.count}</td><td class="text-right">${pct}%</td></tr>`;
      });
      html += `</tbody></table></div>`;
    }

    if (findingsData.length > 0) {
      const totalFindings = findingsData.reduce((s, d) => s + d.count, 0);
      html += `
  <div class="section">
    <div class="section-title">Clinical Findings per Body Part</div>
    <table>
      <thead><tr><th>Body Part</th><th>Diagnosis</th><th class="text-right">Count</th><th class="text-right">Percentage</th></tr></thead>
      <tbody>`;
      findingsData.forEach((item) => {
        const pct = totalFindings > 0 ? ((item.count / totalFindings) * 100).toFixed(1) : 0;
        html += `<tr><td style="text-transform:capitalize;">${item.anatomy}</td><td>${item.diagnosis}</td><td class="text-right">${item.count}</td><td class="text-right">${pct}%</td></tr>`;
      });
      html += `</tbody></table></div>`;
    }

    if (prescriptionStats) {
      html += `
  <div class="section">
    <div class="section-title">Prescription Analytics</div>
    <p style="margin-bottom:5px; font-weight:bold;">Total Prescriptions: ${prescriptionStats.totalPrescriptions}</p>
    
    <p style="font-weight:bold; margin-top:10px; font-size:11px;">Top Prescribed Medications</p>
    <table>
      <thead><tr><th>Medication Name</th><th class="text-right">Count</th></tr></thead>
      <tbody>`;
      prescriptionStats.topMeds.forEach((item) => {
        html += `<tr><td>${item.name}</td><td class="text-right">${item.count}</td></tr>`;
      });
      html += `</tbody></table>
      
    <p style="font-weight:bold; margin-top:15px; font-size:11px;">Prescription Trend (Last 6 Months)</p>
    <table>
      <thead><tr><th>Month</th><th class="text-right">Count</th></tr></thead>
      <tbody>`;
      prescriptionStats.monthlyTrend.forEach((item) => {
        html += `<tr><td>${item.month}</td><td class="text-right">${item.count}</td></tr>`;
      });
      html += `</tbody></table></div>`;
    }

    if (todayAppointments.length > 0) {
      html += `
  <div class="section">
    <div class="section-title">Today's Appointments Summary</div>
    <table>
      <thead><tr><th>Category</th><th>Value</th><th class="text-right">Count</th><th class="text-right">Percentage</th></tr></thead>
      <tbody>`;
      
      todayStatus.forEach((item) => {
        const pct = todayAppointments.length > 0 ? ((item.count / todayAppointments.length) * 100).toFixed(0) : 0;
        html += `<tr><td>Status</td><td>${item.name}</td><td class="text-right">${item.count}</td><td class="text-right">${pct}%</td></tr>`;
      });
      
      todayService.forEach((item) => {
        const pct = todayAppointments.length > 0 ? ((item.count / todayAppointments.length) * 100).toFixed(0) : 0;
        html += `<tr><td>Service</td><td>${item.name}</td><td class="text-right">${item.count}</td><td class="text-right">${pct}%</td></tr>`;
      });

      todayTime.forEach((item) => {
        const pct = todayAppointments.length > 0 ? ((item.count / todayAppointments.length) * 100).toFixed(0) : 0;
        html += `<tr><td>Time Session</td><td>${item.name}</td><td class="text-right">${item.count}</td><td class="text-right">${pct}%</td></tr>`;
      });

      html += `</tbody></table></div>`;
    }

    html += `
  <div class="report-footer">
    <table class="footer-table">
      <tr>
        <td>
          <p style="margin: 0; font-size: 10px;">Generated from Centra Clinic Analytics Dashboard</p>
          <p style="margin: 0; font-size: 10px;">${dateStr} at ${timeStr}</p>
        </td>
        <td style="text-align: right;">
          <div class="signature-box">Prepared by: Admin</div>
        </td>
      </tr>
    </table>
  </div>
</div>
</body>
</html>`;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '1024px';
    iframe.style.height = '768px';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '-9999';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    }
  }, [
    appointmentData,
    consultationData,
    todayAppointments,
    totalConsultations,
    businessInsights,
    findingsData,
    prescriptionStats,
    ageDistribution,
    genderDistribution,
  ]);

  // ─── MEMOIZED ───
  const totalBookedAppointments = useMemo(() => {
    return appointmentData.reduce((sum, item) => sum + toNumber(item.count), 0);
  }, [appointmentData]);

  const uniquePatientsToday = useMemo(() => {
    return new Set(todayAppointments.map((item) => item.fullName)).size;
  }, [todayAppointments]);

  const todayStatusData = useMemo(() => {
    return groupCount(todayAppointments, (item) => normalizeStatus(item.status));
  }, [todayAppointments]);

  const todayServiceData = useMemo(() => {
    return groupCount(todayAppointments, (item) => item.serviceType || "N/A");
  }, [todayAppointments]);

  const todayTimeData = useMemo(() => {
    const map = new Map<string, number>();
    for (const block of CLINIC_TIME_BLOCKS) {
      map.set(block, 0);
    }
    for (const appointment of todayAppointments) {
      const block = getTimeBlock(appointment.appointmentTime);
      if (map.has(block)) {
        map.set(block, (map.get(block) || 0) + 1);
      }
    }
    return CLINIC_TIME_BLOCKS.map((name) => ({
      name,
      count: map.get(name) || 0,
    }));
  }, [todayAppointments]);

  const serviceDemandData = useMemo(() => {
    return businessInsights?.serviceStats || [];
  }, [businessInsights]);

  const dayDemandData = useMemo(() => {
    return businessInsights?.dayStats || [];
  }, [businessInsights]);

  const timeDemandData = useMemo(() => {
    return businessInsights?.timeBlockStats || [];
  }, [businessInsights]);

  const statusData = useMemo(() => {
    return businessInsights?.statusBreakdown || [];
  }, [businessInsights]);

  const doctorWorkloadData = useMemo(() => {
    return businessInsights?.doctorWorkload || [];
  }, [businessInsights]);

  const earData = useMemo(() => {
    return findingsData
      .filter((f) => f.anatomy.toLowerCase() === "ear")
      .map((f) => ({ name: f.diagnosis, value: f.count }));
  }, [findingsData]);

  const noseData = useMemo(() => {
    return findingsData
      .filter((f) => f.anatomy.toLowerCase() === "nose")
      .map((f) => ({ name: f.diagnosis, value: f.count }));
  }, [findingsData]);

  const throatData = useMemo(() => {
    return findingsData
      .filter((f) => f.anatomy.toLowerCase() === "throat")
      .map((f) => ({ name: f.diagnosis, value: f.count }));
  }, [findingsData]);

  const headData = useMemo(() => {
    return findingsData
      .filter((f) => f.anatomy.toLowerCase() === "head")
      .map((f) => ({ name: f.diagnosis, value: f.count }));
  }, [findingsData]);

  const ageSummary = useMemo(() => {
    if (!ageDistribution) return null;
    const total = ageDistribution.ageGroups.reduce((s, g) => s + g.count, 0);
    const pediatric = ageDistribution.ageGroups.find(g => g.group === "0-12")?.count || 0;
    const adult = (ageDistribution.ageGroups.find(g => g.group === "13-19")?.count || 0) +
      (ageDistribution.ageGroups.find(g => g.group === "20-59")?.count || 0);
    const geriatric = ageDistribution.ageGroups.find(g => g.group === "60+")?.count || 0;
    return { total, pediatric, adult, geriatric };
  }, [ageDistribution]);

  const formatPercent = (percent: number | undefined): string => {
    if (percent === undefined || percent === null) return "0%";
    return `${(percent * 100).toFixed(0)}%`;
  };

  // ─── RENDER ───
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      {/* HEADER */}
      <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md">
              <BarChart3 className="h-5 w-5" />
            </span>
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Comprehensive business analysis for bookings, services, schedules, and clinical insights
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600">
            <CalendarDays className="h-4 w-4 text-gray-400" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <button
            onClick={handlePrint}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </button>
          <button
            onClick={refreshAnalytics}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </header>

      <main className="space-y-6">
        {apiError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {apiError}
          </div>
        )}

        {/* METRIC CARDS */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SimpleMetricCard
            label="Total Bookings"
            value={totalBookedAppointments}
            subLabel={businessInsights ? `${businessInsights.bookingGrowthPercentage}% vs last month` : undefined}
            icon={<TrendingUp className="h-5 w-5" />}
            colorIndex={0}
          />
          <SimpleMetricCard
            label="Patients Today"
            value={uniquePatientsToday}
            icon={<Users className="h-5 w-5" />}
            colorIndex={1}
          />
          <SimpleMetricCard
            label="Consultations"
            value={totalConsultations}
            icon={<Stethoscope className="h-5 w-5" />}
            colorIndex={2}
          />
          <SimpleMetricCard
            label="Cancellation Rate"
            value={businessInsights ? `${businessInsights.cancellationRate}%` : "0%"}
            icon={<XCircle className="h-5 w-5" />}
            colorIndex={3}
          />
        </section>

        {/* PATIENT DEMOGRAPHICS */}
        {ageDistribution && genderDistribution && (
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Users className="h-4 w-4 text-amber-500" />
                  Patient Demographics
                  <span className="ml-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                    Avg age: {ageDistribution.avgAge}
                  </span>
                </h3>
                <p className="text-xs text-gray-500">Age groups and gender distribution of patients.</p>
              </div>
            </div>

            {ageSummary && (
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-100 opacity-60 blur-2xl" />
                  <p className="relative text-xs font-medium uppercase tracking-wider text-amber-700">Total Patients</p>
                  <p className="relative mt-1 text-2xl font-bold text-gray-900">{ageSummary.total}</p>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100 opacity-60 blur-2xl" />
                  <p className="relative text-xs font-medium uppercase tracking-wider text-emerald-700">Pediatric (0‑12)</p>
                  <p className="relative mt-1 text-2xl font-bold text-gray-900">{ageSummary.pediatric}</p>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-100 opacity-60 blur-2xl" />
                  <p className="relative text-xs font-medium uppercase tracking-wider text-blue-700">Adult (13‑59)</p>
                  <p className="relative mt-1 text-2xl font-bold text-gray-900">{ageSummary.adult}</p>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-100 opacity-60 blur-2xl" />
                  <p className="relative text-xs font-medium uppercase tracking-wider text-rose-700">Geriatric (60+)</p>
                  <p className="relative mt-1 text-2xl font-bold text-gray-900">{ageSummary.geriatric}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <SimpleChartCard title="Age Distribution" subtitle="Patients per age group" height={260} colorIndex={2}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageDistribution.ageGroups} layout="vertical">
                    <ChartGradientDefs prefix="age" from={COLOR_SCHEMES[2].gradFrom} to={COLOR_SCHEMES[2].gradTo} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                    <YAxis type="category" dataKey="group" stroke="#9ca3af" fontSize={12} width={60} />
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Bar dataKey="count" name="Patients" fill="url(#age-bar-h)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </SimpleChartCard>

              <SimpleChartCard title="Gender Distribution" subtitle="Patient breakdown" height={260} colorIndex={3}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderDistribution.genderData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      label={({ name, percent }) => `${name} (${formatPercent(percent)})`}
                      labelLine={false}
                    >
                      {genderDistribution.genderData.map((_, index) => (
                        <Cell key={index} fill={COLOR_SCHEMES[(index + 3) % COLOR_SCHEMES.length].fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </SimpleChartCard>
            </div>
          </section>
        )}

        {/* ================= MONTHLY FILTER (DROPDOWN) ================= */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Filter className="h-4 w-4 text-indigo-500" />
                Filter Period
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Choose which months and year to display in the charts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Year input */}
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
                  className="w-16 bg-transparent text-sm font-medium text-gray-700 outline-none"
                />
              </div>

              {/* Dropdown trigger */}
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMonthsDropdownOpen((v) => !v)}
                  className="flex w-full min-w-[220px] items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-left text-sm shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50/40 sm:w-auto"
                  aria-expanded={monthsDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-100 text-[10px] font-bold text-indigo-600">
                      {selectedMonths.length}
                    </span>
                    <span className="font-medium text-gray-700">
                      {selectedMonths.length === 0
                        ? "Select months"
                        : selectedMonths.length === 12
                        ? "All months"
                        : `${selectedMonths.length} month${selectedMonths.length > 1 ? "s" : ""} selected`}
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      monthsDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown panel */}
                {monthsDropdownOpen && (
                  <div className="absolute right-0 z-30 mt-2 w-[340px] origin-top-right overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
                    {/* Presets */}
                    <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50/60 p-2">
                      <button
                        type="button"
                        onClick={() => setSelectedMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])}
                        className="flex-1 rounded-md px-2 py-1.5 text-[11px] font-semibold text-gray-600 transition hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const currentMonth = new Date().getMonth() + 1;
                          setSelectedMonths([currentMonth]);
                        }}
                        className="flex-1 rounded-md px-2 py-1.5 text-[11px] font-semibold text-gray-600 transition hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                      >
                        This Month
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const currentMonth = new Date().getMonth() + 1;
                          const last6: number[] = [];
                          for (let i = 5; i >= 0; i--) {
                            const m = currentMonth - i;
                            if (m > 0) last6.push(m);
                          }
                          setSelectedMonths(last6);
                        }}
                        className="flex-1 rounded-md px-2 py-1.5 text-[11px] font-semibold text-gray-600 transition hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                      >
                        Last 6
                      </button>
                    </div>

                    {/* Month checkboxes grid */}
                    <div className="grid grid-cols-3 gap-1 p-2.5">
                      {MONTH_LABELS.map((month, index) => {
                        const monthNum = index + 1;
                        const isSelected = selectedMonths.includes(monthNum);
                        return (
                          <button
                            key={month}
                            type="button"
                            onClick={() => {
                              setSelectedMonths((prev) =>
                                prev.includes(monthNum)
                                  ? prev.filter((m) => m !== monthNum)
                                  : [...prev, monthNum].sort((a, b) => a - b)
                              );
                            }}
                            className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition ${
                              isSelected
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <span
                              className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition ${
                                isSelected
                                  ? "border-indigo-500 bg-indigo-500"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              {isSelected && (
                                <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
                                  <path
                                    d="M2 6L5 9L10 3"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </span>
                            {month}
                          </button>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-3 py-2">
                      <span className="text-[11px] font-medium text-gray-500">
                        {selectedMonths.length} of 12 selected
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedMonths([])}
                          disabled={selectedMonths.length === 0}
                          className="rounded-md px-2.5 py-1 text-[11px] font-semibold text-gray-500 transition hover:bg-white hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => setMonthsDropdownOpen(false)}
                          className="rounded-md bg-indigo-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selected month chips (inline preview) */}
          {selectedMonths.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">
              {selectedMonths.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700"
                >
                  {MONTH_LABELS[m - 1]}
                  <button
                    type="button"
                    onClick={() => setSelectedMonths((prev) => prev.filter((x) => x !== m))}
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-indigo-500 transition hover:bg-indigo-200 hover:text-indigo-800"
                    aria-label={`Remove ${MONTH_LABELS[m - 1]}`}
                  >
                    <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none">
                      <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {selectedMonths.length === 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>No months selected. Charts will be empty until you pick at least one.</span>
            </div>
          )}
        </section>

        {/* ================= MONTHLY BOOKINGS (CONTROLLED BY FILTER) ================= */}
        <section className="grid grid-cols-1 gap-6">
          <SimpleChartCard
            title="Monthly Bookings"
            subtitle={
              selectedMonths.length === 0
                ? "No months selected"
                : selectedMonths.length === 12
                ? `All months of ${year}`
                : `${selectedMonths.length} selected month${selectedMonths.length > 1 ? "s" : ""} in ${year}`
            }
            height={320}
            colorIndex={0}
          >
            {appointmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={appointmentData}>
                  <ChartGradientDefs
                    prefix="appt"
                    from={COLOR_SCHEMES[0].gradFrom}
                    to={COLOR_SCHEMES[0].gradTo}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Bookings"
                    stroke="url(#appt-line)"
                    strokeWidth={2.5}
                    fill="url(#appt-area)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-gray-400">
                <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No bookings for the selected period</p>
                <p className="text-[11px] text-gray-400">
                  Try selecting different months or changing the year
                </p>
              </div>
            )}
          </SimpleChartCard>
        </section>

        {mounted && (
          <>
            {/* CONSULTATION SERVICE DISTRIBUTION */}
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-1">
              <SimpleChartCard title="Consultation Service Distribution" subtitle="Service mix" colorIndex={3}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={consultationData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={({ name, percent }) => `${name} (${formatPercent(percent)})`}
                      labelLine={false}
                    >
                      {consultationData.map((_, index) => (
                        <Cell key={index} fill={COLOR_SCHEMES[(index + 3) % COLOR_SCHEMES.length].fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </SimpleChartCard>
            </section>

            {/* SERVICE DEMAND & STATUS */}
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <SimpleChartCard title="Service Demand Ranking" subtitle="Most booked services" colorIndex={4}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceDemandData} layout="vertical">
                    <ChartGradientDefs prefix="svc" from={COLOR_SCHEMES[4].gradFrom} to={COLOR_SCHEMES[4].gradTo} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={11} width={100} />
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Bar dataKey="count" name="Bookings" fill="url(#svc-bar-h)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </SimpleChartCard>

              <SimpleChartCard title="Appointment Status Breakdown" subtitle="Current status distribution" colorIndex={5}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={90}
                      label={({ name, percent }) => `${name} (${formatPercent(percent)})`}
                      labelLine={false}
                    >
                      {statusData.map((_, index) => (
                        <Cell key={index} fill={COLOR_SCHEMES[(index + 5) % COLOR_SCHEMES.length].fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </SimpleChartCard>
            </section>

            {/* DAYS & TIME */}
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <SimpleChartCard title="Busiest Booking Days" subtitle="Day-of-week popularity" colorIndex={6}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dayDemandData}>
                    <ChartGradientDefs prefix="day" from={COLOR_SCHEMES[6].gradFrom} to={COLOR_SCHEMES[6].gradTo} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Bar dataKey="count" name="Bookings" fill="url(#day-bar)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </SimpleChartCard>

              <SimpleChartCard title="Peak Booking Sessions" subtitle="Time-of-day distribution" colorIndex={7}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeDemandData}>
                    <ChartGradientDefs prefix="tm" from={COLOR_SCHEMES[7].gradFrom} to={COLOR_SCHEMES[7].gradTo} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="timeBlock" stroke="#9ca3af" fontSize={10} interval={0} angle={-25} textAnchor="end" height={80} />
                    <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Bar dataKey="count" name="Bookings" fill="url(#tm-bar)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </SimpleChartCard>
            </section>

            {/* DOCTOR WORKLOAD & CANCELLATION */}
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <SimpleChartCard title="Doctor Workload" subtitle="Appointments per doctor" colorIndex={0}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={doctorWorkloadData} layout="vertical">
                    <ChartGradientDefs prefix="doc" from={COLOR_SCHEMES[0].gradFrom} to={COLOR_SCHEMES[0].gradTo} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                    <YAxis type="category" dataKey="doctorName" stroke="#9ca3af" fontSize={11} width={120} />
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Bar dataKey="count" name="Appointments" fill="url(#doc-bar-h)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </SimpleChartCard>

              <SimpleChartCard title="Cancellation / Rejection Rate" subtitle="Lost bookings" colorIndex={1}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Cancelled / Rejected", value: businessInsights?.cancelledOrRejectedCount || 0 },
                        { name: "Other Bookings", value: Math.max((businessInsights?.currentMonthBookings || 0) - (businessInsights?.cancelledOrRejectedCount || 0), 0) },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={90}
                      label={({ name, percent }) => `${name} (${formatPercent(percent)})`}
                      labelLine={false}
                    >
                      <Cell fill={COLOR_SCHEMES[1].fill} />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </SimpleChartCard>
            </section>

            {/* CLINICAL FINDINGS */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Stethoscope className="h-4 w-4 text-gray-400" />
                    Clinical Findings per Body Part
                  </h3>
                  <p className="text-xs text-gray-500">Distribution of diagnoses for Ear, Nose, Throat, and Head.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { title: "Ear", data: earData, emoji: "👂", colorIndex: 2 },
                  { title: "Nose", data: noseData, emoji: "👃", colorIndex: 3 },
                  { title: "Throat", data: throatData, emoji: "🗣", colorIndex: 4 },
                  { title: "Head", data: headData, emoji: "🧠", colorIndex: 5 },
                ].map((item) => {
                  const scheme = COLOR_SCHEMES[item.colorIndex % COLOR_SCHEMES.length];
                  return (
                    <div
                      key={item.title}
                      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div
                        className="absolute inset-x-0 top-0 h-1"
                        style={{ background: `linear-gradient(90deg, ${scheme.gradTo}, ${scheme.gradFrom})` }}
                      />
                      <h4 className="mb-3 mt-1 text-center text-sm font-semibold text-gray-700">
                        {item.emoji} {item.title}
                        <span className="ml-1 text-xs font-normal text-gray-400">
                          ({item.data.reduce((sum, d) => sum + d.value, 0)})
                        </span>
                      </h4>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          {item.data.length > 0 ? (
                            <>
                              <Pie
                                data={item.data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={60}
                                label={({ name, percent }) => `${name} (${formatPercent(percent)})`}
                                labelLine={false}
                                fontSize={9}
                              >
                                {item.data.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLOR_SCHEMES[(index + item.colorIndex) % COLOR_SCHEMES.length].fill} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "6px 10px", fontSize: "11px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                              <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "9px", paddingTop: "4px" }} />
                            </>
                          ) : (
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="text-xs text-gray-400" fill="#9ca3af" fontSize="12">
                              No findings
                            </text>
                          )}
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* PRESCRIPTION ANALYTICS */}
            {prescriptionStats && (
              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Stethoscope className="h-4 w-4 text-violet-500" />
                      Prescription Analytics
                      <span className="ml-2 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                        Selected period
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500">
                      Total prescriptions: <span className="font-bold text-gray-800">{prescriptionStats.totalPrescriptions}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-600">Top Prescribed Medications</h4>
                    <SimpleChartCard title="" height={240} colorIndex={6}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={prescriptionStats.topMeds} layout="vertical">
                          <ChartGradientDefs prefix="med" from={COLOR_SCHEMES[6].gradFrom} to={COLOR_SCHEMES[6].gradTo} />
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis type="number" stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                          <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={11} width={120} />
                          <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                          <Bar dataKey="count" name="Prescriptions" fill="url(#med-bar-h)" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </SimpleChartCard>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-600">Prescription Trend (Last 6 Months)</h4>
                    <SimpleChartCard title="" height={240} colorIndex={7}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={prescriptionStats.monthlyTrend}>
                          <ChartGradientDefs prefix="trend" from={COLOR_SCHEMES[7].gradFrom} to={COLOR_SCHEMES[7].gradTo} />
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                          <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                          <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                          <Area
                            type="monotone"
                            dataKey="count"
                            name="Prescriptions"
                            stroke={`url(#trend-line)`}
                            strokeWidth={2.5}
                            fill="url(#trend-area)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </SimpleChartCard>
                  </div>
                </div>
              </section>
            )}

            {/* TODAY'S APPOINTMENTS */}
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <SimpleChartCard title="Today's Status" subtitle="Current status breakdown" colorIndex={0}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={todayStatusData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      label={({ name, percent }) => `${name} (${formatPercent(percent)})`}
                      labelLine={false}
                    >
                      {todayStatusData.map((_, index) => (
                        <Cell key={index} fill={COLOR_SCHEMES[(index + 0) % COLOR_SCHEMES.length].fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "6px 10px", fontSize: "11px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "10px", paddingTop: "4px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </SimpleChartCard>

              <SimpleChartCard title="Today's Services" subtitle="Service distribution" colorIndex={1}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={todayServiceData}>
                    <ChartGradientDefs prefix="tsvc" from={COLOR_SCHEMES[1].gradFrom} to={COLOR_SCHEMES[1].gradTo} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={11} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "6px 10px", fontSize: "11px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Bar dataKey="count" name="Appointments" fill="url(#tsvc-bar)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </SimpleChartCard>

              <SimpleChartCard title="Today's Time Sessions" subtitle="Time-of-day view" colorIndex={2}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={todayTimeData}>
                    <ChartGradientDefs prefix="ttm" from={COLOR_SCHEMES[2].gradFrom} to={COLOR_SCHEMES[2].gradTo} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={8} interval={0} angle={-30} textAnchor="end" height={80} />
                    <YAxis stroke="#9ca3af" fontSize={11} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "6px 10px", fontSize: "11px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Bar dataKey="count" name="Appointments" fill="url(#ttm-bar)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </SimpleChartCard>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
