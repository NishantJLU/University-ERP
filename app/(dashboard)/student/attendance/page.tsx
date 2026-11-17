import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentAttendanceClient from "@/components/student/StudentAttendanceClient";

export default async function StudentAttendancePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT" || !user.studentId) {
    redirect("/login");
  }

  const student = await prisma.student.findUnique({
    where: { id: user.studentId },
    include: {
      program: true,
      currentSemester: true,
      enrollments: {
        include: { subject: true },
      },
      attendanceRecords: {
        include: {
          session: {
            include: {
              subject: true,
              faculty: { include: { user: true } },
            },
          },
        },
        orderBy: { session: { date: "desc" } },
      },
    },
  });

  if (!student) return <div className="p-6">Student record not found.</div>;

  const totalClasses = student.attendanceRecords.length || 0;
  const presentClasses = student.attendanceRecords.filter((r) => r.status === "PRESENT").length;
  // If no classes held, percentage is null
  const overallPercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : null;

  // Subject-wise grouping
  const subjectStats = student.enrollments.map((enr) => {
    const records = student.attendanceRecords.filter(
      (r) => r.session.subjectId === enr.subjectId
    );
    const subTotal = records.length;
    const subPresent = records.filter((r) => r.status === "PRESENT").length;
    const subPct = subTotal > 0 ? Math.round((subPresent / subTotal) * 100) : null;

    return {
      subject: {
        id: enr.subject.id,
        code: enr.subject.code,
        name: enr.subject.name,
      },
      total: subTotal,
      present: subPresent,
      percentage: subPct,
      type: enr.subject.type,
      records: records as any[],
    };
  });

  return (
    <StudentAttendanceClient
      totalClasses={totalClasses}
      presentClasses={presentClasses}
      overallPercentage={overallPercentage}
      subjects={subjectStats}
    />
  );
}
