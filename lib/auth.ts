import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "./prisma";
import { Role, SessionUser } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-enterprise-key-change-in-production-min-32-chars-long";
const COOKIE_NAME = "univ_session";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: SessionUser): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return null;

    // Verify user is still active in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        facultyProfile: true,
        studentProfile: true,
      },
    });

    if (!user || !user.isActive) return null;

    return {
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
  } catch (error) {
    return null;
  }
}

export function requireRole(allowedRoles: Role[], userRole?: Role): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
