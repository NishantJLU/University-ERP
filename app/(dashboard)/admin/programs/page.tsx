import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProgramsClient from "@/components/admin/ProgramsClient";

export default async function AdminProgramsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const [programs, departments] = await Promise.all([
    prisma.program.findMany({
      include: {
        department: true,
        semesters: true,
        students: true,
      },
      orderBy: { code: "asc" },
    }),
    prisma.department.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const formatted = programs.map((p) => ({
    id: p.id,
    code: p.code,
    name: p.name,
    degreeType: p.degreeType,
    durationYears: p.durationYears,
    departmentName: p.department.name,
    semestersCount: p.semesters.length,
    studentsCount: p.students.length,
  }));

  return <ProgramsClient initialPrograms={formatted} departments={departments} />;
}
