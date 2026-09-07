import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookOpen, Users, Plus, FileText, ArrowRight } from "lucide-react";

export default async function TeacherLMSPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER" || !user.facultyId) {
    redirect("/login");
  }

  const courses = await prisma.lMSCourse.findMany({
    where: { facultyId: user.facultyId },
    include: {
      subject: {
        include: {
          department: true,
          assignments: true,
          quizzes: true,
        },
      },
      modules: true,
      materials: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Faculty LMS Studio
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Course Management Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage instructional modules, study materials, assignments, and quizzes for your assigned academic subjects
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create New Module
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4 hover:border-blue-300 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                  {course.subject.code}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">
                  {course.title}
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Active
              </span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {course.description}
            </p>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-extrabold text-slate-900 block">{course.modules.length}</span>
                <span className="text-[10px] text-slate-400">Modules</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-extrabold text-slate-900 block">{course.subject.assignments.length}</span>
                <span className="text-[10px] text-slate-400">Assignments</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-extrabold text-slate-900 block">{course.subject.quizzes.length}</span>
                <span className="text-[10px] text-slate-400">Quizzes</span>
              </div>
            </div>

            <Link
              href={`/student/lms/${course.id}`}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Manage Course Syllabus & Content</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
