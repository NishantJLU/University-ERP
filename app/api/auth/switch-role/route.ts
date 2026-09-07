import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { Role } from "@/types";

const ROLE_PRESET_EMAILS: Record<Role, string> = {
  ADMIN: "admin@demo.edu",
  HOD: "hod@demo.edu",
  TEACHER: "teacher@demo.edu",
  STUDENT: "student@demo.edu",
  ACCOUNTS: "accounts@demo.edu",
  MANAGEMENT: "management@demo.edu",
};

export async function POST(req: Request) {
  try {
    const { role } = await req.json();

    if (!role || !ROLE_PRESET_EMAILS[role as Role]) {
      return NextResponse.json(
        { success: false, message: "Invalid role specified for demo switch." },
        { status: 400 }
      );
    }

    const email = ROLE_PRESET_EMAILS[role as Role];
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        facultyProfile: true,
        studentProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: `Demo user for role ${role} not found in database.` },
        { status: 404 }
      );
    }

    const sessionPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
      phone: user.phone,
      avatar: user.avatar,
      departmentId: user.facultyProfile?.departmentId,
      studentId: user.studentProfile?.id,
      facultyId: user.facultyProfile?.id,
    };

    const token = signToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      message: `Switched session to ${role}: ${user.name}`,
      role: user.role,
      redirectUrl: `/${user.role.toLowerCase()}/dashboard`,
      user: sessionPayload,
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Demo role switch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to switch role." },
      { status: 500 }
    );
  }
}
