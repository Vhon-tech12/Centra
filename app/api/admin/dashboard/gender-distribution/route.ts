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

    // Filter patients created within the range, then strict-filter by month
    const rangePatients = await prisma.patient.findMany({
      where: {
        gender: { not: null },
        createdAt: {
          gte: rangeStart,
          lt: rangeEnd,
        },
      },
      select: {
        gender: true,
        createdAt: true,
      },
    });

    const filtered = rangePatients.filter((p) => {
      const month = p.createdAt.getMonth() + 1;
      const year = p.createdAt.getFullYear();
      return year === selectedYear && selectedMonths.includes(month);
    });

    const counts: Record<string, number> = {};
    for (const p of filtered) {
      const gender = p.gender?.toLowerCase() || "unknown";
      counts[gender] = (counts[gender] || 0) + 1;
    }

    const genderData = Object.entries(counts).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count,
    }));

    return NextResponse.json({ genderData });
  } catch (error) {
    console.error("[GENDER-DISTRIBUTION]", error);
    return NextResponse.json(
      { error: "Failed to fetch gender distribution" },
      { status: 500 }
    );
  }
}
