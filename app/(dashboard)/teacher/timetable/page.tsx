import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import TimetableWeeklyGrid from "@/components/timetable/TimetableWeeklyGrid";
import PrintScheduleButton from "@/components/timetable/PrintScheduleButton";
import { CalendarDays } from "lucide-react";

export default async function TeacherTimetablePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER" || !user.facultyId) {
    redirect("/login");
  }

  const periods = await prisma.timetablePeriod.findMany({
    where: {
      facultyId: user.facultyId,
      timetable: { status: "PUBLISHED" },
    },
    include: {
      subject: true,
      faculty: { include: { user: true } },
      room: true,
      section: true,
    },
    orderBy: [{ dayOfWeek: "asc" }, { periodNumber: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Faculty Teaching Schedule
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Weekly Teaching Timetable
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-filtered view of your personal teaching assignments across classrooms and laboratories
          </p>
        </div>

        <PrintScheduleButton />
      </div>

      <TimetableWeeklyGrid
        periods={periods as any}
        status="PUBLISHED"
        title={`Faculty Schedule: ${user.name}`}
      />
    </div>
  );
}
