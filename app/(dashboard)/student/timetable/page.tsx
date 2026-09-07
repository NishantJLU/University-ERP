import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import TimetableWeeklyGrid from "@/components/timetable/TimetableWeeklyGrid";
import { CalendarDays, Printer } from "lucide-react";

export default async function StudentTimetablePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT" || !user.studentId) {
    redirect("/login");
  }

  const student = await prisma.student.findUnique({
    where: { id: user.studentId },
    include: { program: true, currentSemester: true, section: true },
  });

  if (!student || !student.sectionId) {
    return <div className="p-6">No section assigned for student schedule.</div>;
  }

  // Fetch published timetable periods for the student's assigned section
  const periods = await prisma.timetablePeriod.findMany({
    where: {
      sectionId: student.sectionId,
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
            Academic Schedule • Section {student.section?.name}
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Weekly Class Timetable
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized directly with university room bookings and faculty allocations
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition"
        >
          <Printer className="w-4 h-4" />
          Print Schedule
        </button>
      </div>

      <TimetableWeeklyGrid
        periods={periods as any}
        status="PUBLISHED"
        title={`${student.program.name} — Semester ${student.currentSemester.number} (${student.section?.name})`}
      />
    </div>
  );
}
