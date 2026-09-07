import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import TeacherSubmissionsClient from "./TeacherSubmissionsClient";

export default async function TeacherSubmissionsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER" || !user.facultyId) {
    redirect("/login");
  }

  const submissions = await prisma.assignmentSubmission.findMany({
    where: {
      assignment: { facultyId: user.facultyId },
    },
    include: {
      student: { include: { user: true } },
      assignment: true,
    },
    orderBy: { submittedAt: "desc" },
  });

  const formattedSubmissions = submissions.map((sub) => ({
    id: sub.id,
    assignmentTitle: sub.assignment.title,
    studentName: sub.student.user.name,
    rollNumber: sub.student.rollNumber,
    content: sub.content,
    submittedAt: sub.submittedAt,
    status: sub.status,
    maxMarks: sub.assignment.maxMarks,
    marksObtained: sub.marksObtained,
    feedback: sub.feedback,
  }));

  return <TeacherSubmissionsClient submissions={formattedSubmissions} />;
}
