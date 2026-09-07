import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sectionId = searchParams.get("sectionId");

    if (!sectionId) {
      return NextResponse.json({ success: false, message: "sectionId query parameter is required." }, { status: 400 });
    }

    const students = await prisma.student.findMany({
      where: { sectionId },
      include: {
        user: true,
        program: true,
      },
      orderBy: { rollNumber: "asc" },
    });

    const studentList = students.map((s) => ({
      id: s.id,
      name: s.user.name,
      rollNumber: s.rollNumber,
      avatar: s.user.avatar,
      email: s.user.email,
      programName: s.program.name,
    }));

    return NextResponse.json({ success: true, students: studentList });
  } catch (error: any) {
    console.error("Failed to fetch section roster:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
