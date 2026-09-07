import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { Role } from "@/types";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        facultyProfile: true,
        studentProfile: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials or inactive account." },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials or password." },
        { status: 401 }
      );
    }

    const role = user.role as Role;
    const sessionPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role,
      phone: user.phone,
      avatar: user.avatar,
      departmentId: user.facultyProfile?.departmentId,
      studentId: user.studentProfile?.id,
      facultyId: user.facultyProfile?.id,
    };

    const token = signToken(sessionPayload);

    // Audit login
    await createAuditLog({
      actor: sessionPayload,
      action: "USER_LOGIN",
      entity: "User",
      entityId: user.id,
      details: { role },
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      role,
      redirectUrl: `/${role.toLowerCase()}/dashboard`,
      user: sessionPayload,
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
