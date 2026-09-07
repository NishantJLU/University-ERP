import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentFeesClient from "./StudentFeesClient";

export default async function StudentFeesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT" || !user.studentId) {
    redirect("/login");
  }

  const student = await prisma.student.findUnique({
    where: { id: user.studentId },
    include: {
      user: true,
      program: true,
      currentSemester: true,
      feeDues: {
        include: { feeStructure: true },
      },
      paymentTransactions: {
        include: { receipt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!student) return <div className="p-6">Student record not found.</div>;

  return (
    <StudentFeesClient
      student={student}
      feeDues={student.feeDues}
      transactions={student.paymentTransactions}
    />
  );
}
