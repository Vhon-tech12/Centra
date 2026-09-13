import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

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

const BOOKING_OUTCOME_LIST = ["Confirmed", "Cancelled", "Rejected"];
const ALL_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function safePercentage(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Format a period label from a start date + span (in months).
 * - 1 month  → "March 2025"
 * - N months → "Jan – Dec 2025" (or "Oct – Mar 2025" for cross-year)
 */
function rangeLabel(start: Date, monthCount: number) {
  if (monthCount === 1) {
    return start.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  const end = new Date(
    start.getFullYear(),
    start.getMonth() + monthCount - 1,
    1
  );

  const startLabel = start.toLocaleDateString("en-US", { month: "short" });
  const endLabel = end.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return `${startLabel} – ${endLabel}`;
}

function getHourFromAppointmentTime(time?: string | null) {
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

function getTimeBlock(time?: string | null) {
  const hour = getHourFromAppointmentTime(time);

  if (hour === null) return "Unspecified Time";

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

function getBookingOutcome(status: string) {
  if (status === "CONFIRMED" || status === "ACCEPTED") {
    return "Confirmed";
  }

  if (status === "CANCELLED") {
    return "Cancelled";
  }

  if (status === "REJECTED") {
    return "Rejected";
  }

  return "Confirmed";
}

function getDayName(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function sortEntriesDescending<T extends { count: number }>(items: T[]) {
  return [...items].sort((a, b) => b.count - a.count);
}

/**
 * Parse ?months=1,3,5,7 → [1,3,5,7]
 * Falls back to all 12 months when missing/invalid/empty.
 */
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
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden: Admin role required" },
      { status: 403 }
    );
  }

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

  // ── Compute selected period range ──
  const firstMonth = selectedMonths[0]; // e.g. 1 (Jan)
  const lastMonth = selectedMonths[selectedMonths.length - 1]; // e.g. 12 (Dec)

  const rangeStart = new Date(selectedYear, firstMonth - 1, 1);
  const rangeEnd = new Date(selectedYear, lastMonth, 1); // exclusive (1st day of next month)

  // ── Previous period: same span, immediately before rangeStart ──
  const monthSpan = selectedMonths.length;
  const prevRangeStart = new Date(
    selectedYear,
    firstMonth - 1 - monthSpan,
    1
  );
  const prevRangeEnd = rangeStart;

  try {
    // Fetch appointments in the outer range (may include gap months if user picked e.g. Jan, Mar, Jun)
    const rangeAppointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: rangeStart,
          lt: rangeEnd,
        },
      },
      select: {
        id: true,
        fullName: true,
        serviceType: true,
        appointmentDate: true,
        appointmentTime: true,
        status: true,
        assignedToUserId: true,
      },
      orderBy: {
        appointmentDate: "asc",
      },
    });

    // Strict filter — keep only appointments whose month is actually selected
    const currentMonthAppointments = rangeAppointments.filter((a) => {
      const month = a.appointmentDate.getMonth() + 1;
      const year = a.appointmentDate.getFullYear();
      return year === selectedYear && selectedMonths.includes(month);
    });

    const previousMonthBookings = await prisma.appointment.count({
      where: {
        appointmentDate: {
          gte: prevRangeStart,
          lt: prevRangeEnd,
        },
      },
    });

    const currentMonthBookings = currentMonthAppointments.length;

    const bookingGrowthPercentage =
      previousMonthBookings === 0
        ? currentMonthBookings > 0
          ? 100
          : 0
        : Math.round(
            ((currentMonthBookings - previousMonthBookings) /
              previousMonthBookings) *
              100
          );

    const growthDirection =
      bookingGrowthPercentage > 0
        ? "up"
        : bookingGrowthPercentage < 0
          ? "down"
          : "flat";

    const outcomeCountMap = new Map<string, number>();
    const serviceCountMap = new Map<string, number>();
    const dayCountMap = new Map<string, number>();
    const timeBlockCountMap = new Map<string, number>();
    const doctorCountMap = new Map<string, number>();

    for (const outcome of BOOKING_OUTCOME_LIST) {
      outcomeCountMap.set(outcome, 0);
    }

    for (const block of CLINIC_TIME_BLOCKS) {
      timeBlockCountMap.set(block, 0);
    }

    for (const appointment of currentMonthAppointments) {
      const status = String(appointment.status);
      const outcome = getBookingOutcome(status);

      outcomeCountMap.set(outcome, (outcomeCountMap.get(outcome) || 0) + 1);

      const service = appointment.serviceType || "Unspecified Service";
      serviceCountMap.set(service, (serviceCountMap.get(service) || 0) + 1);

      const dayName = getDayName(appointment.appointmentDate);
      dayCountMap.set(dayName, (dayCountMap.get(dayName) || 0) + 1);

      const timeBlock = getTimeBlock(appointment.appointmentTime);

      if (timeBlockCountMap.has(timeBlock)) {
        timeBlockCountMap.set(
          timeBlock,
          (timeBlockCountMap.get(timeBlock) || 0) + 1
        );
      }

      if (appointment.assignedToUserId) {
        doctorCountMap.set(
          appointment.assignedToUserId,
          (doctorCountMap.get(appointment.assignedToUserId) || 0) + 1
        );
      }
    }

    const serviceStats = sortEntriesDescending(
      Array.from(serviceCountMap.entries()).map(([name, count]) => ({
        name,
        count,
        percentage: safePercentage(count, currentMonthBookings),
      }))
    );

    const topService = serviceStats[0] || null;

    const lowestService =
      serviceStats.length > 1 ? serviceStats[serviceStats.length - 1] : null;

    const dayStats = sortEntriesDescending(
      Array.from(dayCountMap.entries()).map(([day, count]) => ({
        day,
        count,
        percentage: safePercentage(count, currentMonthBookings),
      }))
    );

    const busiestDay = dayStats[0] || null;

    const timeBlockStats = CLINIC_TIME_BLOCKS.map((timeBlock) => {
      const count = timeBlockCountMap.get(timeBlock) || 0;

      return {
        timeBlock,
        count,
        percentage: safePercentage(count, currentMonthBookings),
      };
    });

    const peakTime =
      [...timeBlockStats].sort((a, b) => b.count - a.count)[0] || null;

    const confirmedCount = outcomeCountMap.get("Confirmed") || 0;
    const cancelledCount = outcomeCountMap.get("Cancelled") || 0;
    const rejectedCount = outcomeCountMap.get("Rejected") || 0;

    const closedCount = cancelledCount + rejectedCount;
    const closedRate = safePercentage(closedCount, currentMonthBookings);

    const bookingOutcomeBreakdown = BOOKING_OUTCOME_LIST.map((outcome) => {
      const count = outcomeCountMap.get(outcome) || 0;

      return {
        outcome,
        count,
        percentage: safePercentage(count, currentMonthBookings),
      };
    });

    const doctorIds = Array.from(doctorCountMap.keys());

    const doctors = doctorIds.length
      ? await prisma.user.findMany({
          where: {
            id: {
              in: doctorIds,
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        })
      : [];

    const doctorNameMap = new Map(
      doctors.map((doctor: any) => [
        doctor.id,
        doctor.name || doctor.email || "Assigned Doctor",
      ])
    );

    const doctorWorkload = sortEntriesDescending(
      Array.from(doctorCountMap.entries()).map(([doctorId, count]) => ({
        doctorId,
        doctorName: doctorNameMap.get(doctorId) || "Assigned Doctor",
        count,
        percentage: safePercentage(count, currentMonthBookings),
      }))
    );

    // ── Recommendations ──
    const recommendations: string[] = [];
    const isSingleMonth = selectedMonths.length === 1;

    if (bookingGrowthPercentage >= 15) {
      recommendations.push(
        `Bookings increased by ${bookingGrowthPercentage}% compared with the previous period. Consider adding more clinic slots or staff coverage during high-demand sessions.`
      );
    } else if (bookingGrowthPercentage <= -15) {
      recommendations.push(
        `Bookings decreased by ${Math.abs(
          bookingGrowthPercentage
        )}% compared with the previous period. Consider targeted promotions, patient follow-ups, or service visibility improvements.`
      );
    } else {
      recommendations.push(
        "Bookings are relatively stable compared with the previous period. Continue monitoring demand by day and one-hour clinic session."
      );
    }

    if (topService) {
      recommendations.push(
        `${topService.name} is the most requested service in the selected period. Ensure enough doctors, equipment, and clinic support are available for this service.`
      );
    }

    if (lowestService) {
      recommendations.push(
        `${lowestService.name} has the lowest demand in the selected period. Review whether this service needs better promotion, pricing review, or clearer patient information.`
      );
    }

    if (busiestDay) {
      recommendations.push(
        `${busiestDay.day} is currently the busiest booking day. Consider adding more staff coverage or avoiding doctor leave schedules on this day.`
      );
    }

    if (peakTime) {
      recommendations.push(
        `The peak clinic session is ${peakTime.timeBlock}. Consider increasing doctor or assistant availability during this one-hour slot.`
      );
    }

    if (closedRate >= 20) {
      recommendations.push(
        `Cancelled or rejected bookings are at ${closedRate}%. Review cancellation reasons, blocked slots, and schedule accuracy.`
      );
    }

    if (doctorWorkload.length > 1 && doctorWorkload[0].percentage >= 50) {
      recommendations.push(
        `${doctorWorkload[0].doctorName} is handling ${doctorWorkload[0].percentage}% of assigned appointments in this period. Consider balancing doctor workload.`
      );
    }

    // ── Labels ──
    const currentMonthLabel = rangeLabel(rangeStart, monthSpan);
    const previousMonthLabel = rangeLabel(prevRangeStart, monthSpan);

    return NextResponse.json({
      generatedAt: new Date().toISOString(),

      currentMonthLabel,
      previousMonthLabel,

      // extra fields for reference
      selectedYear,
      selectedMonths,

      currentMonthBookings,
      previousMonthBookings,
      bookingGrowthPercentage,
      growthDirection,

      topService,
      lowestService,
      busiestDay,
      peakTime,

      confirmedCount,
      cancelledCount,
      rejectedCount,
      closedCount,
      closedRate,

      confirmedOrAcceptedCount: confirmedCount,
      adminClosedCount: closedCount,
      adminClosedRate: closedRate,

      cancellationRate: closedRate,
      cancelledOrRejectedCount: closedCount,

      bookingOutcomeBreakdown,

      statusBreakdown: bookingOutcomeBreakdown.map((item: any) => ({
        status: item.outcome,
        count: item.count,
        percentage: item.percentage,
      })),

      serviceStats,
      dayStats,
      timeBlockStats,
      doctorWorkload,
      recommendations,
    });
  } catch (error) {
    console.error("[BUSINESS_INSIGHTS_ERROR]", error);

    return NextResponse.json(
      { error: "Failed to load business insights" },
      { status: 500 }
    );
  }
}
