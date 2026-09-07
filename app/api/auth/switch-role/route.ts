import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signToken, AUTH_COOKIE_NAME, getCurrentUser } from "@/lib/auth";
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
    const isExplicitlyDisabled = process.env.DISABLE_ROLE_SWITCH === "true";
    if (isExplicitlyDisabled) {
      return NextResponse.json(
        {
          success: false,
          message: "Role switching is disabled by system administrator.",
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const role = body.role;

    if (!role) {
      return NextResponse.json(
        { success: false, message: "Invalid role specified for switch." },
        { status: 400 }
      );
    }

    const email = ROLE_PRESET_EMAILS[role as Role];
    let user = email
      ? await prisma.user.findUnique({
          where: { email },
          include: {
            facultyProfile: true,
            studentProfile: true,
          },
        })
      : null;

    // Fallback: If preset email not found, find any existing user with that role
    if (!user) {
      user = await prisma.user.findFirst({
        where: { role: role as Role },
        include: {
          facultyProfile: true,
          studentProfile: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: `User for role ${role} not found in database.` },
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
