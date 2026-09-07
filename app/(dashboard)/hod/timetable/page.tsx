import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import TimetableWeeklyGrid from "@/components/timetable/TimetableWeeklyGrid";
import { CalendarDays } from "lucide-react";

export default async function HODTimetablePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "HOD" && user.role !== "ADMIN") {
    redirect(`/${user.role.toLowerCase()}/dashboard`);
  }

  const deptId = user.departmentId || (await prisma.department.findFirst())?.id;

  // Fetch all published timetable periods for programs within this department
  const periods = await prisma.timetablePeriod.findMany({
    where: {
      timetable: {
        semester: deptId ? { program: { departmentId: deptId } } : undefined,
        status: "PUBLISHED",
      },
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
      <div>
        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
          Department Master Schedule
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Master Academic Timetable
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Consolidated department-wide schedule showing concurrent section slots and laboratory utilization
        </p>
      </div>

      <TimetableWeeklyGrid
        periods={periods as any}
        status="PUBLISHED"
        title="Department Consolidated Weekly Schedule"
      />
    </div>
  );
}
