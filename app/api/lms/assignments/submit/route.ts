import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT" || !user.studentId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Only enrolled students can submit assignments." },
        { status: 403 }
      );
    }

    const { assignmentId, content, fileUrl } = await req.json();

    if (!assignmentId || (!content && !fileUrl)) {
      return NextResponse.json(
        { success: false, message: "Assignment ID and submission content or file are required." },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return NextResponse.json(
        { success: false, message: "Assignment not found." },
        { status: 404 }
      );
    }

    const isLate = new Date() > new Date(assignment.dueDate);
    const submissionStatus = isLate ? "LATE" : "SUBMITTED";

    const submission = await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: user.studentId,
        },
      },
      update: {
        content: content || null,
        fileUrl: fileUrl || null,
        submittedAt: new Date(),
        status: submissionStatus,
      },
      create: {
        assignmentId,
        studentId: user.studentId,
        content: content || null,
        fileUrl: fileUrl || null,
        status: submissionStatus,
      },
    });

    await createAuditLog({
      actor: user,
      action: "ASSIGNMENT_SUBMITTED",
      entity: "AssignmentSubmission",
      entityId: submission.id,
      details: {
        assignmentTitle: assignment.title,
        status: submissionStatus,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Assignment submitted successfully (${submissionStatus}).`,
      submission,
    });
  } catch (error) {
    console.error("Assignment submission error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit assignment." },
      { status: 500 }
    );
  }
}
