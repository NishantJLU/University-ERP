import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookOpen, User, CheckCircle2, ArrowRight, GraduationCap } from "lucide-react";

export default async function StudentLMSPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT" || !user.studentId) {
    redirect("/login");
  }

  const student = await prisma.student.findUnique({
    where: { id: user.studentId },
    include: {
      enrollments: {
        include: {
          subject: {
            include: {
              lmsCourse: {
                include: {
                  faculty: { include: { user: true } },
                  modules: true,
                  materials: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!student) return <div className="p-6">Student record not found.</div>;

  const courses = student.enrollments
    .map((e) => e.subject.lmsCourse)
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Integrated Learning Management System
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            My Enrolled LMS Courses
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-synchronized with your official academic curriculum and faculty assignments
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Canvas Simplicity • D2L Analytics • ERP One Source of Truth
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: any) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition duration-150 flex flex-col justify-between"
          >
            {/* Top Color Banner */}
            <div className="h-32 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 text-white flex flex-col justify-between relative">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  {course.subject?.code || "CS301"}
                </span>
                <span className="text-[10px] text-blue-200">
                  {course.modules?.length || 2} Modules
                </span>
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                {course.title}
              </h3>
            </div>

            {/* Course Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {course.description}
              </p>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{course.faculty?.user?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{course.materials?.length || 1} Study Materials available</span>
                </div>
              </div>

              <Link
                href={`/student/lms/${course.id}`}
                className="mt-4 w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>Enter Course Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
