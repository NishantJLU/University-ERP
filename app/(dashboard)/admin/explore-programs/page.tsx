import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ExploreProgramsClient from "@/components/admin/ExploreProgramsClient";

export default async function ExploreProgramsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const [programs, departments] = await Promise.all([
    prisma.program.findMany({
      include: {
        department: true,
        semesters: true,
        students: { select: { id: true } },
      },
      orderBy: { code: "asc" },
    }),
    prisma.department.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <ExploreProgramsClient
      initialPrograms={programs as any}
      departments={departments}
    />
  );
}
