import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import HODApprovalsClient from "./HODApprovalsClient";

export default async function HODApprovalsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "HOD" && user.role !== "ADMIN") {
    redirect(`/${user.role.toLowerCase()}/dashboard`);
  }

  const deptId = user.departmentId;

  const timetables = await prisma.timetable.findMany({
    where: deptId ? { semester: { program: { departmentId: deptId } } } : {},
    include: {
      section: true,
      semester: { include: { program: true } },
      periods: {
        include: {
          subject: true,
          faculty: { include: { user: true } },
          room: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formatted = timetables.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
    hasConflicts: t.hasConflicts,
    conflictNotes: t.conflictNotes,
    sectionName: t.section.name,
    programName: t.semester.program.name,
    periods: t.periods,
  }));

  return <HODApprovalsClient timetables={formatted} />;
}
