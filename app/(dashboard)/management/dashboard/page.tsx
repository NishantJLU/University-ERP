import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ManagementDashboardClient from "./ManagementDashboardClient";

export default async function ManagementDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "MANAGEMENT") {
    redirect("/login");
  }

  const [
    totalStudents,
    totalFaculty,
    totalDepartments,
    totalPrograms,
    feeDues,
    departments,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.faculty.count(),
    prisma.department.count(),
    prisma.program.count(),
    prisma.studentFeeDue.findMany(),
    prisma.department.findMany({
      include: {
        programs: {
          include: { students: true },
        },
      },
    }),
  ]);

  const totalBilled = feeDues.reduce((acc, d) => acc + d.totalAmount, 0);
  const totalCollected = feeDues.reduce((acc, d) => acc + d.paidAmount, 0);
  const outstanding = totalBilled - totalCollected;

  const deptData = departments.map((d) => {
    const studentsInDept = d.programs.reduce(
      (acc, p) => acc + p.students.length,
      0
    );
    return {
      name: d.code,
      students: studentsInDept,
    };
  });

  const feeData = [
    { name: "Collected", value: totalCollected },
    { name: "Outstanding", value: outstanding },
  ];

  return (
    <ManagementDashboardClient
      stats={{
        totalStudents,
        totalFaculty,
        totalDepartments,
        totalPrograms,
        totalBilled,
        totalCollected,
        outstanding,
        attendanceAvg: 88,
      }}
      deptData={deptData}
      feeData={feeData}
    />
  );
}
