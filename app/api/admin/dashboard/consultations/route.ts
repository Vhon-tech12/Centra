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
    // ── Parse filter params ──
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
    const rangeEnd = new Date(selectedYear, lastMonth, 1); // exclusive

    // Fetch accepted and confirmed appointments within the range
    const rangeAppointments = await prisma.appointment.findMany({
      where: {
        status: {
          in: ["ACCEPTED", "CONFIRMED"],
        },
        appointmentDate: {
          gte: rangeStart,
          lt: rangeEnd,
        },
      },
      select: {
        serviceType: true,
        appointmentDate: true,
      },
    });

    // Strict filter — keep only months actually selected (handles gaps like Jan, Mar, Jun)
    const appointments = rangeAppointments.filter((a) => {
      const month = a.appointmentDate.getMonth() + 1;
      const year = a.appointmentDate.getFullYear();
      return year === selectedYear && selectedMonths.includes(month);
    });

    // If no appointments, return default data
    if (appointments.length === 0) {
      return NextResponse.json(
        {
          data: [
            { name: "Ear", value: 0 },
            { name: "Nose", value: 0 },
            { name: "Throat", value: 0 },
            { name: "Aesthetics", value: 0 },
          ],
          highestService: null,
          lowestService: null,
          totalBookings: 0,
        },
        { status: 200 }
      );
    }

    // Group by service type and count
    const serviceCounts: Record<string, number> = {};
    appointments.forEach((appointment: any) => {
      const service = appointment.serviceType;
      serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    });

    const totalBookings = appointments.length;

    // Calculate percentages and prepare data
    const consultationData = Object.entries(serviceCounts).map(
      ([name, count]) => ({
        name,
        count,
        value: parseFloat(((count / totalBookings) * 100).toFixed(1)),
      })
    );

    // Sort by percentage to find highest and lowest
    const sortedByPercentage = [...consultationData].sort(
      (a, b) => b.value - a.value
    );

    const highestService = sortedByPercentage[0] || null;
    const lowestService =
      sortedByPercentage[sortedByPercentage.length - 1] || null;

    // Ensure all service types are represented (even with 0)
    const allServices = ["Ear", "Nose", "Throat", "Aesthetics"];
    const completeData = allServices.map((service) => {
      const existing = consultationData.find(
        (d) => d.name.toLowerCase() === service.toLowerCase()
      );
      return existing || { name: service, count: 0, value: 0 };
    });

    // Sort to match the original order
    const orderedData = allServices.map(
      (service) =>
        completeData.find(
          (d) => d.name.toLowerCase() === service.toLowerCase()
        )!
    );

    return NextResponse.json(
      {
        data: orderedData.map((d) => ({ name: d.name, value: d.value })),
        highestService: highestService
          ? { name: highestService.name, percentage: highestService.value }
          : null,
        lowestService: lowestService
          ? { name: lowestService.name, percentage: lowestService.value }
          : null,
        totalBookings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching consultation data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
