import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentResourcesClient from "@/components/student/StudentResourcesClient";

export default async function StudentResourcesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const [resources, subjects, semesters] = await Promise.all([
    prisma.learningMaterial.findMany({
      include: {
        subject: { select: { id: true, code: true, name: true } },
        semester: { select: { id: true, number: true } },
        uploadedBy: { select: { name: true, role: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.subject.findMany({
      select: { id: true, code: true, name: true },
      orderBy: { code: "asc" },
    }),
    prisma.semester.findMany({
      select: { id: true, number: true },
      orderBy: { number: "asc" },
    }),
  ]);

  return (
    <StudentResourcesClient
      initialResources={resources}
      subjects={subjects}
      semesters={semesters}
      userRole={user.role}
      userName={user.name}
    />
  );
}
