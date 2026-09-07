import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !requireRole(["ADMIN", "HOD"], user.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin or HOD credentials required." },
        { status: 403 }
      );
    }

    const { timetableId, action } = await req.json(); // action: "APPROVE" | "PUBLISH"

    if (!timetableId) {
      return NextResponse.json(
        { success: false, message: "Timetable ID is required." },
        { status: 400 }
      );
    }

    const timetable = await prisma.timetable.findUnique({
      where: { id: timetableId },
      include: { section: true, periods: true },
    });

    if (!timetable) {
      return NextResponse.json(
        { success: false, message: "Timetable schedule not found." },
        { status: 404 }
      );
    }

    const newStatus = action === "PUBLISH" ? "PUBLISHED" : "APPROVED";

    const updated = await prisma.timetable.update({
      where: { id: timetableId },
      data: {
        status: newStatus,
        approvedByUserId: user.id,
        approvedAt: new Date(),
        publishedAt: action === "PUBLISH" ? new Date() : timetable.publishedAt,
      },
    });

    // Create Audit Log
    await createAuditLog({
      actor: user,
      action: action === "PUBLISH" ? "TIMETABLE_PUBLISHED" : "TIMETABLE_APPROVED",
      entity: "Timetable",
      entityId: timetable.id,
      details: {
        title: timetable.title,
        section: timetable.section.name,
        newStatus,
        periodCount: timetable.periods.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Timetable successfully marked as ${newStatus}. All student and faculty views are synchronized.`,
      timetable: updated,
    });
  } catch (error) {
    console.error("Timetable approval error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update timetable status." },
      { status: 500 }
    );
  }
}
