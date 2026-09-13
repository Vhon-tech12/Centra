import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALL_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function parseMonths(raw: string | null): number[] {
  if (!raw) return [...ALL_MONTHS];
  const parsed = raw
    .split(",")
    .map((m) => parseInt(m.trim(), 10))
    .filter((m) => Number.isFinite(m) && m >= 1 && m <= 12);
  const unique = Array.from(new Set(parsed)).sort((a, b) => a - b);
  return unique.length > 0 ? unique : [...ALL_MONTHS];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const monthsParam = searchParams.get("months");

    const now = new Date();
    const parsedYear = yearParam ? parseInt(yearParam, 10) : now.getFullYear();
    const selectedYear = Number.isFinite(parsedYear)
      ? parsedYear
      : now.getFullYear();
    const selectedMonths = parseMonths(monthsParam);

    const firstMonth = selectedMonths[0];
    const lastMonth = selectedMonths[selectedMonths.length - 1];

    const rangeStart = new Date(selectedYear, firstMonth - 1, 1);
    const rangeEnd = new Date(selectedYear, lastMonth, 1);

    // Fetch all prescriptions in outer range, then strict-filter by month
    const rangePrescriptions = await prisma.prescription.findMany({
      where: {
        createdAt: {
          gte: rangeStart,
          lt: rangeEnd,
        },
      },
      select: {
        generic: true,
        createdAt: true,
      },
    });

    const filtered = rangePrescriptions.filter((p) => {
      const month = p.createdAt.getMonth() + 1;
      const year = p.createdAt.getFullYear();
      return year === selectedYear && selectedMonths.includes(month);
    });

    const totalPrescriptions = filtered.length;

    // Top 5 medications
    const medCounts = new Map<string, number>();
    filtered.forEach((p) => {
      const key = p.generic || "Unspecified";
      medCounts.set(key, (medCounts.get(key) || 0) + 1);
    });

    const topMeds = Array.from(medCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Monthly trend — 6 months ending at the last selected month
    const trendEnd = new Date(selectedYear, lastMonth, 1);
    const trendStart = new Date(selectedYear, lastMonth - 6, 1);

    const trendRaw = await prisma.prescription.findMany({
      where: {
        createdAt: {
          gte: trendStart,
          lt: trendEnd,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const trendMap = new Map<string, number>();
    trendRaw.forEach((p) => {
      const d = p.createdAt;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      trendMap.set(key, (trendMap.get(key) || 0) + 1);
    });

    const monthlyTrend: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(trendEnd.getFullYear(), trendEnd.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyTrend.push({
        month: d.toLocaleString("en-US", { month: "short", year: "numeric" }),
        count: trendMap.get(key) || 0,
      });
    }

    return NextResponse.json({
      totalPrescriptions,
      topMeds,
      monthlyTrend,
    });
  } catch (error) {
    console.error("[PRESCRIPTION-STATS]", error);
    return NextResponse.json(
      { error: "Failed to fetch prescription stats" },
      { status: 500 }
    );
  }
}
