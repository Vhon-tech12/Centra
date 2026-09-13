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

    const rangeAppointments = await prisma.appointment.findMany({
      where: {
        age: { not: null },
        appointmentDate: {
          gte: rangeStart,
          lt: rangeEnd,
        },
      },
      select: {
        age: true,
        appointmentDate: true,
      },
    });

    const filtered = rangeAppointments.filter((a) => {
      const month = a.appointmentDate.getMonth() + 1;
      const year = a.appointmentDate.getFullYear();
      return year === selectedYear && selectedMonths.includes(month);
    });

    const counts = {
      "0-12": 0,
      "13-19": 0,
      "20-59": 0,
      "60+": 0,
    };

    for (const appt of filtered) {
      const age = appt.age;
      if (age === null || age === undefined) continue;
      if (age <= 12) counts["0-12"]++;
      else if (age <= 19) counts["13-19"]++;
      else if (age <= 59) counts["20-59"]++;
      else counts["60+"]++;
    }

    const ageGroups = Object.entries(counts).map(([group, count]) => ({
      group,
      count,
    }));

    const totalAge = filtered.reduce(
      (sum: number, a: any) => sum + (a.age || 0),
      0
    );
    const avgAge =
      filtered.length > 0 ? Math.round(totalAge / filtered.length) : 0;

    return NextResponse.json({ ageGroups, avgAge });
  } catch (error) {
    console.error("[AGE-DISTRIBUTION]", error);
    return NextResponse.json(
      { error: "Failed to fetch age distribution" },
      { status: 500 }
    );
  }
}
