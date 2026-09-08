import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import DepartmentsClient from "@/components/admin/DepartmentsClient";
import { Suspense } from "react";

export default async function AdminDepartmentsPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
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

  return (
    <Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading department registry...</div>}>
      <DepartmentsClient
        initialDepartments={formatted}
        initialStatus={searchParams?.status}
      />
    </Suspense>
  );
}
