import { NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { detectTimetableConflicts } from "@/lib/timetable-engine";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !requireRole(["ADMIN", "HOD"], user.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: HOD or Admin permission required." },
        { status: 403 }
      );
    }

    const { periods, ignoreTimetableId } = await req.json();

    if (!Array.isArray(periods)) {
      return NextResponse.json(
        { success: false, message: "Periods array is required." },
        { status: 400 }
      );
    }

    const conflicts = await detectTimetableConflicts(periods, ignoreTimetableId);

    return NextResponse.json({
      success: true,
      hasConflicts: conflicts.length > 0,
      conflictCount: conflicts.length,
      conflicts,
    });
  } catch (error: any) {
    console.error("Timetable conflict inspection error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to detect conflicts." },
      { status: 500 }
    );
  }
}
