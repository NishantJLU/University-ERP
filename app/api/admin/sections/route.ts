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

    const { name, capacity, semesterId } = await req.json();

    if (!name || !semesterId) {
      return NextResponse.json({ success: false, message: "Section name and semester are required." }, { status: 400 });
    }

    const section = await prisma.section.create({
      data: {
        name: name.trim(),
        capacity: Number(capacity) || 60,
        semesterId,
      },
    });

    await createAuditLog({
      actor: user,
      action: "SECTION_CREATE",
      entity: "Section",
      entityId: section.id,
      details: { name: section.name, capacity: section.capacity },
    });

    return NextResponse.json({ success: true, data: section });
  } catch (error: any) {
    console.error("Failed to create section:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}
