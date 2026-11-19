import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const semesterId = searchParams.get("semesterId");
    const subjectId = searchParams.get("subjectId");

    const where: any = {};

    if (category && category !== "ALL") {
      where.category = category;
    }

    if (semesterId && semesterId !== "ALL") {
      where.semesterId = semesterId;
    }

    if (subjectId && subjectId !== "ALL") {
      where.subjectId = subjectId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const resources = await prisma.learningMaterial.findMany({
      where,
      include: {
        subject: true,
        semester: true,
        uploadedBy: {
          select: {
            name: true,
            role: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, resources });
  } catch (error: any) {
    console.error("Resources GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch academic resources" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Role gate: only TEACHER, HOD, ADMIN can upload resources
    if (user.role !== "TEACHER" && user.role !== "HOD" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Only faculty or administrators can upload resources." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, category, fileType, fileSize, semesterId, subjectId, fileUrl } = body;

    if (!title || !category) {
      return NextResponse.json(
        { error: "Title and Category are required." },
        { status: 400 }
      );
    }

    const resource = await prisma.learningMaterial.create({
      data: {
        title,
        description: description || null,
        category,
        fileType: fileType || "PDF",
        fileSize: fileSize || "1.5 MB",
        fileUrl: fileUrl || `/materials/${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.${(fileType || "pdf").toLowerCase()}`,
        uploadedById: user.id,
        semesterId: semesterId && semesterId !== "NONE" ? semesterId : null,
        subjectId: subjectId && subjectId !== "NONE" ? subjectId : null,
      },
      include: {
        subject: true,
        semester: true,
        uploadedBy: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    });

    // Create audit log entry
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        action: "RESOURCE_UPLOAD",
        entity: "LearningMaterial",
        entityId: resource.id,
        details: JSON.stringify({
          title: resource.title,
          category: resource.category,
          fileType: resource.fileType,
        }),
      },
    });

    return NextResponse.json({ success: true, resource }, { status: 201 });
  } catch (error: any) {
    console.error("Resources POST error:", error);
    return NextResponse.json(
      { error: "Failed to create academic resource" },
      { status: 500 }
    );
  }
}
