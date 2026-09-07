import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch university-wide data in parallel
  const [
    studentCount,
    facultyCount,
    deptCount,
    progCount,
    roomCount,
    timetableCount,
    unassignedStudentsCount,
    urgentNoticesCount,
    recentAudits,
    feeDues,
    departments,
    programs,
    sections,
    semesters,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.faculty.count(),
    prisma.department.count(),
    prisma.program.count(),
    prisma.room.count(),
    prisma.timetable.count(),
    prisma.student.count({ where: { sectionId: null } }),
    prisma.notice.count({ where: { priority: { in: ["URGENT", "HIGH"] } } }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.studentFeeDue.findMany({
      select: { totalAmount: true, paidAmount: true, status: true },
    }),
    prisma.department.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
    prisma.program.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
    prisma.section.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.semester.findMany({
      select: { id: true, number: true, program: { select: { name: true } } },
      orderBy: { number: "asc" },
      take: 30,
    }),
  ]);

  const totalBilled = feeDues.reduce((acc, d) => acc + d.totalAmount, 0);
  const totalCollected = feeDues.reduce((acc, d) => acc + d.paidAmount, 0);
  const unpaidFeeDuesCount = feeDues.filter((d) => d.status !== "PAID").length;

  return (
    <AdminDashboardClient
      user={{
        name: user.name,
        role: user.role,
        email: user.email,
      }}
      metrics={{
        studentCount,
        facultyCount,
        deptCount,
        progCount,
        roomCount,
        timetableCount,
        totalCollected,
        totalBilled,
        unassignedStudentsCount,
        unpaidFeeDuesCount,
        urgentNoticesCount,
      }}
      recentAudits={recentAudits.map((a) => ({
        id: a.id,
        action: a.action,
        entity: a.entity,
        actorName: a.actorName,
        actorRole: a.actorRole,
        createdAt: a.createdAt.toISOString(),
      }))}
      masterData={{
        departments,
        programs,
        sections,
        semesters: semesters.map((s) => ({
          id: s.id,
          number: s.number,
          programName: s.program.name,
        })),
      }}
    />
  );
}
