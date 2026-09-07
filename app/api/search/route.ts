import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Academics" | "Students" | "Faculty" | "Courses" | "Facilities";
  href: string;
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const results: SearchResultItem[] = [];
    const lowerQ = q.toLowerCase();

    // 1. Programs (All roles)
    const programs = await prisma.program.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { code: { contains: q } },
        ],
      },
      include: { department: true },
      take: 4,
    });
    for (const p of programs) {
      results.push({
        id: `prog-${p.id}`,
        title: `${p.name} (${p.code})`,
        subtitle: `${p.department.name} • ${p.durationYears} Years Degree`,
        category: "Academics",
        href:
          user.role === "ADMIN"
            ? "/admin/programs"
            : `/${user.role.toLowerCase()}/dashboard`,
      });
    }

    // 2. Subjects (All roles)
    const subjects = await prisma.subject.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { code: { contains: q } },
        ],
      },
      include: { department: true },
      take: 4,
    });
    for (const s of subjects) {
      results.push({
        id: `subj-${s.id}`,
        title: `${s.name} (${s.code})`,
        subtitle: `${s.type} • ${s.credits} Credits • ${s.department.code}`,
        category: "Academics",
        href:
          user.role === "ADMIN"
            ? "/admin/subjects"
            : user.role === "TEACHER"
            ? "/teacher/lms"
            : "/student/lms",
      });
    }

    // 3. LMS Courses (All roles)
    const courses = await prisma.lMSCourse.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { subject: { code: { contains: q } } },
        ],
      },
      include: {
        subject: true,
        faculty: { include: { user: true } },
      },
      take: 4,
    });
    for (const c of courses) {
      results.push({
        id: `course-${c.id}`,
        title: c.title,
        subtitle: `Course ${c.subject.code} • Prof. ${c.faculty.user.name}`,
        category: "Courses",
        href:
          user.role === "STUDENT"
            ? `/student/lms/${c.id}`
            : user.role === "TEACHER"
            ? "/teacher/lms"
            : "/admin/dashboard",
      });
    }

    // 4. Faculty (All roles can search professors)
    const facultyMembers = await prisma.faculty.findMany({
      where: {
        OR: [
          { designation: { contains: q } },
          { user: { name: { contains: q } } },
          { user: { email: { contains: q } } },
        ],
      },
      include: { user: true, department: true },
      take: 4,
    });
    for (const f of facultyMembers) {
      results.push({
        id: `fac-${f.id}`,
        title: f.user.name,
        subtitle: `${f.designation} • ${f.department.name}`,
        category: "Faculty",
        href:
          user.role === "ADMIN"
            ? "/admin/faculty"
            : user.role === "HOD"
            ? "/hod/faculty"
            : `/${user.role.toLowerCase()}/dashboard`,
      });
    }

    // 5. Students (Strict RBAC: only ADMIN, HOD, TEACHER, ACCOUNTS)
    if (["ADMIN", "HOD", "TEACHER", "ACCOUNTS"].includes(user.role)) {
      const students = await prisma.student.findMany({
        where: {
          OR: [
            { rollNumber: { contains: q } },
            { user: { name: { contains: q } } },
            { user: { email: { contains: q } } },
          ],
        },
        include: { user: true, program: true, section: true },
        take: 4,
      });
      for (const st of students) {
        results.push({
          id: `stud-${st.id}`,
          title: `${st.user.name} (${st.rollNumber})`,
          subtitle: `${st.program.code} • Section ${st.section?.name || "Unassigned"}`,
          category: "Students",
          href:
            user.role === "ADMIN"
              ? "/admin/students"
              : user.role === "ACCOUNTS"
              ? "/accounts/dues"
              : user.role === "TEACHER"
              ? "/teacher/students"
              : "/hod/students",
        });
      }
    }

    // 6. Rooms / Labs (ADMIN, HOD, TEACHER)
    if (["ADMIN", "HOD", "TEACHER"].includes(user.role)) {
      const rooms = await prisma.room.findMany({
        where: {
          OR: [
            { roomNumber: { contains: q } },
            { building: { contains: q } },
          ],
        },
        take: 3,
      });
      for (const r of rooms) {
        results.push({
          id: `room-${r.id}`,
          title: `Room ${r.roomNumber}`,
          subtitle: `${r.roomType} • Capacity ${r.capacity} • ${r.building || "Campus"}`,
          category: "Facilities",
          href: user.role === "ADMIN" ? "/admin/rooms" : "/admin/timetable",
        });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
