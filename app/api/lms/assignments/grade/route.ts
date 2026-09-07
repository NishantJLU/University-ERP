import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !requireRole(["TEACHER", "HOD", "ADMIN"], user.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Faculty evaluation credentials required." },
        { status: 403 }
      );
    }

    const { submissionId, marksObtained, feedback } = await req.json();

    if (!submissionId || marksObtained === undefined) {
      return NextResponse.json(
        { success: false, message: "Submission ID and marks are required." },
        { status: 400 }
      );
    }

    const submission = await prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: true,
        student: { include: { user: true } },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, message: "Submission record not found." },
        { status: 404 }
      );
    }

    if (marksObtained > submission.assignment.maxMarks) {
      return NextResponse.json(
        { success: false, message: `Marks cannot exceed maximum of ${submission.assignment.maxMarks}.` },
        { status: 400 }
      );
    }

    const updated = await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        marksObtained: Number(marksObtained),
        feedback: feedback || null,
        status: "REVIEWED",
        gradedAt: new Date(),
      },
    });

    // Create Audit Log
    await createAuditLog({
      actor: user,
      action: "ASSIGNMENT_GRADED",
      entity: "AssignmentSubmission",
      entityId: submission.id,
      details: {
        student: submission.student.user.name,
        assignment: submission.assignment.title,
        marksObtained,
        maxMarks: submission.assignment.maxMarks,
      },
    });

    // Notify Student
    await prisma.notification.create({
      data: {
        userId: submission.student.userId,
        title: "Assignment Graded",
        message: `Your submission for "${submission.assignment.title}" has been reviewed. Score: ${marksObtained}/${submission.assignment.maxMarks}`,
        type: "ACADEMIC",
        linkUrl: "/student/assignments",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Submission evaluated successfully.",
      submission: updated,
    });
  } catch (error) {
    console.error("Grading error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to grade assignment submission." },
      { status: 500 }
    );
  }
}
