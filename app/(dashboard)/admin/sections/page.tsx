import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import SectionsClient from "@/components/admin/SectionsClient";

export default async function AdminSectionsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const [sections, semesters] = await Promise.all([
    prisma.section.findMany({
      include: {
        semester: { include: { program: true } },
        students: true,
        facultyAssignments: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.semester.findMany({
      include: { program: true },
      orderBy: [{ program: { code: "asc" } }, { number: "asc" }],
    }),
  ]);

  const formattedSections = sections.map((sec) => ({
    id: sec.id,
    name: sec.name,
    capacity: sec.capacity,
    programName: sec.semester.program.name,
    semesterNumber: sec.semester.number,
    studentsCount: sec.students.length,
    facultyCount: sec.facultyAssignments.length,
  }));

  const formattedSemesters = semesters.map((sem) => ({
    id: sem.id,
    number: sem.number,
    programName: sem.program.name,
  }));

  return <SectionsClient initialSections={formattedSections} semesters={formattedSemesters} />;
}
