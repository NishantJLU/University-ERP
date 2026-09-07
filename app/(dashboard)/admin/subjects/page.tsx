import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import SubjectsClient from "@/components/admin/SubjectsClient";

export default async function AdminSubjectsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const [subjects, departments, semesters] = await Promise.all([
    prisma.subject.findMany({
      include: {
        department: true,
        semester: { include: { program: true } },
      },
      orderBy: { code: "asc" },
    }),
    prisma.department.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
    prisma.semester.findMany({
      include: { program: true },
      orderBy: [{ program: { code: "asc" } }, { number: "asc" }],
    }),
  ]);

  const formattedSubjects = subjects.map((s) => ({
    id: s.id,
    code: s.code,
    name: s.name,
    credits: s.credits,
    type: s.type,
    programName: s.semester.program.name,
    semesterNumber: s.semester.number,
    departmentName: s.department.name,
  }));

  const formattedSemesters = semesters.map((sem) => ({
    id: sem.id,
    number: sem.number,
    programName: sem.program.name,
  }));

  return (
    <SubjectsClient
      initialSubjects={formattedSubjects}
      departments={departments}
      semesters={formattedSemesters}
    />
  );
}
