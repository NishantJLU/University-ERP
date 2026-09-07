import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FileText, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function StudentAssignmentsPage() {
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
              assignments: {
                include: {
                  submissions: {
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

  const allAssignments = student.enrollments.flatMap((e) =>
    e.subject.assignments.map((a) => ({
      ...a,
      subjectCode: e.subject.code,
      subjectName: e.subject.name,
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Continuous Assessment
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Course Assignments
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Submit assignments, track deadlines, and view instructor rubric feedback
        </p>
      </div>

      <div className="space-y-4">
        {allAssignments.map((assignment) => {
          const submission = assignment.submissions[0];
          return (
            <div
              key={assignment.id}
              className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                    {assignment.subjectCode}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    {assignment.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  {assignment.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-amber-700 font-medium">
                    <Clock className="w-3.5 h-3.5" /> Due {formatDate(assignment.dueDate)}
                  </span>
                  <span>•</span>
                  <span>Max Marks: {assignment.maxMarks}</span>
                </div>

                {submission?.feedback && (
                  <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                    <span className="font-bold">Faculty Feedback:</span> {submission.feedback}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-end md:items-center gap-3 shrink-0">
                {submission ? (
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {submission.status}
                    </span>
                    {submission.marksObtained !== null && (
                      <span className="block text-xs font-bold text-emerald-800 mt-1">
                        Score: {submission.marksObtained} / {assignment.maxMarks}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertCircle className="w-3.5 h-3.5" /> Due Soon
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
