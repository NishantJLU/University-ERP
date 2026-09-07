import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import FacultyClient from "@/components/admin/FacultyClient";

export default async function AdminFacultyPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const [faculty, departments] = await Promise.all([
    prisma.faculty.findMany({
      include: {
        user: true,
        department: true,
        assignments: true,
      },
      orderBy: { employeeCode: "asc" },
    }),
    prisma.department.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const formatted = faculty.map((f) => ({
    id: f.id,
    employeeCode: f.employeeCode,
    name: f.user.name,
    email: f.user.email,
    departmentName: f.department.name,
    designation: f.designation,
    specialization: f.specialization,
    coursesCount: f.assignments.length,
  }));

  return <FacultyClient initialFaculty={formatted} departments={departments} />;
}
