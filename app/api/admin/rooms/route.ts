import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const { roomNumber, building, floor, capacity, roomType } = await req.json();

    if (!roomNumber || !building) {
      return NextResponse.json({ success: false, message: "Room number and building are required." }, { status: 400 });
    }

    const existing = await prisma.room.findUnique({
      where: { roomNumber: roomNumber.trim().toUpperCase() },
    });

    if (existing) {
      return NextResponse.json({ success: false, message: `Room '${roomNumber}' already exists.` }, { status: 400 });
    }

    const room = await prisma.room.create({
      data: {
        roomNumber: roomNumber.trim().toUpperCase(),
        building: building.trim(),
        floor: Number(floor) || 1,
        capacity: Number(capacity) || 60,
        roomType: roomType || "CLASSROOM",
      },
    });

    await createAuditLog({
      actor: user,
      action: "ROOM_CREATE",
      entity: "Room",
      entityId: room.id,
      details: { roomNumber: room.roomNumber, capacity: room.capacity, type: room.roomType },
    });

    return NextResponse.json({ success: true, data: room });
  } catch (error: any) {
    console.error("Failed to create room:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}
