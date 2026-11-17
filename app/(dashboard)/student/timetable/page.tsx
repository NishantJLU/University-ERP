import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import TimetableWeeklyGrid from "@/components/timetable/TimetableWeeklyGrid";

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
    <div className="space-y-4 font-sans text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <span className="hover:text-slate-800">Dashboard</span>
            <span>/</span>
            <span className="text-slate-600">Academics</span>
            <span>/</span>
            <span className="text-slate-900 font-medium">Timetable Schedule</span>
          </nav>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic Timetable & Lecture Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cohort Section: <span className="font-semibold text-slate-800">{student.section?.name}</span> • Term:{" "}
            <span className="text-slate-800">Semester {student.currentSemester.number}</span> • Program:{" "}
            <span className="text-slate-800">{student.program.code}</span>
          </p>
        </div>
      </div>

      <TimetableWeeklyGrid
        periods={periods as any}
        status="PUBLISHED"
        title={`${student.program.name} — Semester ${student.currentSemester.number} (${student.section?.name})`}
      />
    </div>
  );
}
