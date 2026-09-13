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

    // Fetch findings in the outer range, then strict-filter by month
    const rangeFindings = await prisma.clinicalFinding.findMany({
      where: {
        createdAt: {
          gte: rangeStart,
          lt: rangeEnd,
        },
      },
      select: {
        anatomy: true,
        diagnosis: true,
        createdAt: true,
      },
    });

    const filtered = rangeFindings.filter((f) => {
      const month = f.createdAt.getMonth() + 1;
      const year = f.createdAt.getFullYear();
      return year === selectedYear && selectedMonths.includes(month);
    });

    // Manual groupBy (anatomy + diagnosis)
    const groupMap = new Map<
      string,
      { anatomy: string; diagnosis: string; count: number }
    >();

    filtered.forEach((f) => {
      const key = `${f.anatomy}||${f.diagnosis}`;
      const existing = groupMap.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        groupMap.set(key, {
          anatomy: f.anatomy,
          diagnosis: f.diagnosis,
          count: 1,
        });
      }
    });

    const data = Array.from(groupMap.values()).sort(
      (a, b) => b.count - a.count
    );

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[FINDINGS]", error);
    return NextResponse.json(
      { error: "Failed to fetch findings" },
      { status: 500 }
    );
  }
}
