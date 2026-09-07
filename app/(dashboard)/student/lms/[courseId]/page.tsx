import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import LMSCourseHub from "@/components/lms/LMSCourseHub";

interface PageProps {
  params: {
    courseId: string;
  };
}

export default async function StudentCourseDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT" || !user.studentId) {
    redirect("/login");
  }

  const course = await prisma.lMSCourse.findUnique({
    where: { id: params.courseId },
    include: {
      subject: {
        include: {
          department: true,
          assignments: {
            include: {
              submissions: {
                where: { studentId: user.studentId },
              },
            },
          },
          quizzes: {
            include: {
              questions: true,
              attempts: {
                where: { studentId: user.studentId },
              },
            },
          },
        },
      },
      faculty: {
        include: { user: true },
      },
      modules: {
        include: { lessons: true },
        orderBy: { orderIndex: "asc" },
      },
      materials: true,
    },
  });

  if (!course) {
    notFound();
  }

  // Fetch student's ERP attendance in this specific subject
  const attendanceRecords = await prisma.attendanceRecord.findMany({
    where: {
      studentId: user.studentId,
      session: { subjectId: course.subjectId },
    },
  });
  const totalSubClasses = attendanceRecords.length || 1;
  const attendedSubClasses = attendanceRecords.filter((r) => r.status === "PRESENT").length;
  const subPct = Math.round((attendedSubClasses / totalSubClasses) * 100);

  return (
    <LMSCourseHub
      course={course}
      userRole="STUDENT"
      attendanceStats={{
        percentage: subPct,
        attended: attendedSubClasses,
        total: totalSubClasses,
      }}
      nextClassSlot={{
        day: "Monday",
        time: "09:00 AM - 10:00 AM",
        room: "LH-101 (Turing Block)",
        faculty: course.faculty.user.name,
      }}
    />
  );
}
