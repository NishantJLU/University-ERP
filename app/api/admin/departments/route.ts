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

    const { code, name, description, building } = await req.json();

    if (!code || !name) {
      return NextResponse.json({ success: false, message: "Department code and name are required." }, { status: 400 });
    }

    const existing = await prisma.department.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (existing) {
      return NextResponse.json({ success: false, message: `Department code '${code}' already exists.` }, { status: 400 });
    }

    const department = await prisma.department.create({
      data: {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description?.trim() || null,
        building: building?.trim() || null,
      },
    });

    await createAuditLog({
      actor: user,
      action: "DEPARTMENT_CREATE",
      entity: "Department",
      entityId: department.id,
      details: { code: department.code, name: department.name },
    });

    return NextResponse.json({ success: true, data: department });
  } catch (error: any) {
    console.error("Failed to create department:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}
