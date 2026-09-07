import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentsClient from "@/components/admin/StudentsClient";

export default async function AdminStudentsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const [students, programs, sections] = await Promise.all([
    prisma.student.findMany({
      include: {
        user: true,
        program: true,
        currentSemester: true,
        section: true,
      },
      orderBy: { rollNumber: "asc" },
    }),
    prisma.program.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { code: "asc" },
    }),
    prisma.section.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <StudentsClient
      initialStudents={students as any}
      programs={programs}
      sections={sections}
    />
  );
}
