import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentReceiptsClient from "@/components/student/StudentReceiptsClient";

export default async function StudentReceiptsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT" || !user.studentId) {
    redirect("/login");
  }

  const receipts = await prisma.receipt.findMany({
    where: { studentId: user.studentId },
    include: {
      paymentTransaction: {
        include: {
          studentFeeDue: {
            include: { feeStructure: true },
          },
        },
      },
      student: {
        include: { user: true, program: true },
      },
    },
    orderBy: { issueDate: "desc" },
  });

  return <StudentReceiptsClient receipts={receipts as any} />;
}
