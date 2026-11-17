import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentResultsClient from "@/components/student/StudentResultsClient";

export default async function StudentResultsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT" || !user.studentId) {
    redirect("/login");
  }

  const student = await prisma.student.findUnique({
    where: { id: user.studentId },
    include: {
      program: true,
      currentSemester: true,
      examResults: {
        include: { subject: true },
      },
    },
  });

  if (!student) return <div className="p-6">Student record not found.</div>;

  return <StudentResultsClient student={student} />;
}
