import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import DepartmentsClient from "@/components/admin/DepartmentsClient";

export default async function AdminDepartmentsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const departments = await prisma.department.findMany({
    include: {
      programs: true,
      faculty: { include: { user: true } },
    },
    orderBy: { code: "asc" },
  });

  const formatted = departments.map((d) => ({
    id: d.id,
    code: d.code,
    name: d.name,
    description: d.description,
    building: d.building,
    programsCount: d.programs.length,
    facultyCount: d.faculty.length,
  }));

  return <DepartmentsClient initialDepartments={formatted} />;
}
