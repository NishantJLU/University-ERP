import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HelpCircle, Clock, CheckCircle2, Award } from "lucide-react";
import Link from "next/link";

export default async function StudentQuizzesPage() {
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
              lmsCourse: true,
              quizzes: {
                include: {
                  attempts: {
                    where: { studentId: user.studentId },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!student) return <div className="p-6">Student record not found.</div>;

  const allQuizzes = student.enrollments.flatMap((e) =>
    e.subject.quizzes.map((q) => ({
      ...q,
      subjectCode: e.subject.code,
      subjectName: e.subject.name,
      lmsCourseId: e.subject.lmsCourse?.id,
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Objective Self-Assessment & Quizzes
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Academic Quizzes & Tests
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Take timed multiple-choice and true/false quizzes with instant server-side auto-scoring
        </p>
      </div>

      <div className="space-y-4">
        {allQuizzes.map((quiz) => {
          const attempt = quiz.attempts[0];
          return (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-purple-50 text-purple-700 border border-purple-200">
                    {quiz.subjectCode}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{quiz.title}</h3>
                </div>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  {quiz.instructions}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {quiz.durationMinutes} Minutes
                  </span>
                  <span>•</span>
                  <span>Total Marks: {quiz.totalMarks}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {attempt ? (
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Attempted
                    </span>
                    <span className="block text-xs font-extrabold text-emerald-800 mt-1">
                      Score: {attempt.score} / {quiz.totalMarks} ({Math.round((attempt.score / quiz.totalMarks) * 100)}%)
                    </span>
                  </div>
                ) : quiz.lmsCourseId ? (
                  <Link
                    href={`/student/lms/${quiz.lmsCourseId}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition"
                  >
                    Take Quiz in LMS
                  </Link>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
