import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !requireRole(["TEACHER", "HOD", "ADMIN"], user.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Faculty or Admin permissions required." },
        { status: 403 }
      );
    }

    const {
      timetablePeriodId,
      subjectId,
      sectionId,
      date,
      periodNumber = 1,
      records, // Array of { studentId: string, status: "PRESENT"|"ABSENT"|"LATE"|"EXCUSED", remarks?: string }
    } = await req.json();

    if (!subjectId || !sectionId || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { success: false, message: "Subject, Section, and student records are required." },
        { status: 400 }
      );
    }

    const targetDate = date ? new Date(date) : new Date();

    // Verify faculty assignment if role is TEACHER
    if (user.role === "TEACHER" && user.facultyId) {
      const assignment = await prisma.facultyAssignment.findFirst({
        where: {
          facultyId: user.facultyId,
          subjectId,
          sectionId,
        },
      });
      if (!assignment) {
        return NextResponse.json(
          { success: false, message: "You are not designated as instructor for this subject and section." },
          { status: 403 }
        );
      }
    }

    const facultyId = user.facultyId || (await prisma.faculty.findFirst())?.id!;

    // Find or create AttendanceSession
    const session = await prisma.attendanceSession.upsert({
      where: {
        subjectId_sectionId_date_periodNumber: {
          subjectId,
          sectionId,
          date: targetDate,
          periodNumber,
        },
      },
      update: {
        status: "FINALIZED",
        facultyId,
      },
      create: {
        timetablePeriodId: timetablePeriodId || null,
        subjectId,
        sectionId,
        facultyId,
        date: targetDate,
        periodNumber,
        status: "FINALIZED",
      },
    });

    // Save individual student records
    for (const rec of records) {
      await prisma.attendanceRecord.upsert({
        where: {
          attendanceSessionId_studentId: {
            attendanceSessionId: session.id,
            studentId: rec.studentId,
          },
        },
        update: {
          status: rec.status,
          remarks: rec.remarks || null,
        },
        create: {
          attendanceSessionId: session.id,
          studentId: rec.studentId,
          status: rec.status,
          remarks: rec.remarks || null,
        },
      });
    }

    // Create Audit Log
    await createAuditLog({
      actor: user,
      action: "ATTENDANCE_RECORDED",
      entity: "AttendanceSession",
      entityId: session.id,
      details: {
        subjectId,
        sectionId,
        date: targetDate.toISOString().split("T")[0],
        totalStudents: records.length,
        presentCount: records.filter((r) => r.status === "PRESENT").length,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Attendance marked successfully for ${records.length} students.`,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Attendance recording error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to record attendance." },
      { status: 500 }
    );
  }
}
