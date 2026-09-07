import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "HOD")) {
      return NextResponse.json({ success: false, message: "Unauthorized. Admin or HOD role required." }, { status: 403 });
    }

    const { title, content, priority, targetScope, targetId } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ success: false, message: "Title and content are required." }, { status: 400 });
    }

    const notice = await prisma.notice.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        priority: priority || "NORMAL",
        targetScope: targetScope || "ALL",
        targetId: targetId || null,
        authorId: user.id,
      },
    });

    await createAuditLog({
      actor: user,
      action: "NOTICE_PUBLISH",
      entity: "Notice",
      entityId: notice.id,
      details: { title: notice.title, priority: notice.priority, targetScope: notice.targetScope },
    });

    return NextResponse.json({ success: true, data: notice });
  } catch (error: any) {
    console.error("Failed to publish notice:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}
