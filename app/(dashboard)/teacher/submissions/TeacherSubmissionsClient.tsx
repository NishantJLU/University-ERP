"use client";

import { useState } from "react";
import { Award, CheckCircle2, Clock, MessageSquare, Loader2, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

interface SubmissionItem {
  id: string;
  assignmentTitle: string;
  studentName: string;
  rollNumber: string;
  content: string | null;
  submittedAt: string | Date;
  status: string;
  maxMarks: number;
  marksObtained: number | null;
  feedback: string | null;
}

interface TeacherSubmissionsClientProps {
  submissions: SubmissionItem[];
}

export default function TeacherSubmissionsClient({
  submissions,
}: TeacherSubmissionsClientProps) {
  const [selectedSub, setSelectedSub] = useState<SubmissionItem | null>(null);
  const [marks, setMarks] = useState<number | "">("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  const handleOpenGrade = (sub: SubmissionItem) => {
    setSelectedSub(sub);
    setMarks(sub.marksObtained !== null ? sub.marksObtained : "");
    setFeedback(sub.feedback || "");
  };

  const handleSaveGrade = async () => {
    if (!selectedSub || marks === "") return;
    setSaving(true);
    try {
      const res = await fetch("/api/lms/assignments/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: selectedSub.id,
          marksObtained: Number(marks),
          feedback,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Grade recorded and student notified!");
        setSelectedSub(null);
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to grade submission.");
      }
    } catch (err) {
      toast.error("Error grading submission.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Evaluation Desk
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Review Student Submissions
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Evaluate submitted assignments, assign marks, and provide qualitative rubric feedback
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="p-3">Student</th>
                <th className="p-3">Assignment</th>
                <th className="p-3">Submitted On</th>
                <th className="p-3">Status</th>
                <th className="p-3">Score</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{sub.studentName}</p>
                    <span className="text-[10px] font-mono text-slate-400">{sub.rollNumber}</span>
                  </td>
                  <td className="p-3 font-medium text-slate-800">{sub.assignmentTitle}</td>
                  <td className="p-3 text-slate-500">{formatDate(sub.submittedAt)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.status === "REVIEWED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-900">
                    {sub.marksObtained !== null ? (
                      <span className="text-emerald-700">{sub.marksObtained} / {sub.maxMarks}</span>
                    ) : (
                      <span className="text-slate-400">— / {sub.maxMarks}</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleOpenGrade(sub)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                    >
                      {sub.status === "REVIEWED" ? "Edit Marks" : "Grade Submission"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Grade Submission: {selectedSub.studentName} ({selectedSub.rollNumber})
            </h3>
            <p className="text-xs text-slate-500">
              Assignment: <span className="font-semibold text-slate-800">{selectedSub.assignmentTitle}</span> (Max: {selectedSub.maxMarks} Marks)
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700 block mb-1">Student&apos;s Submitted Work:</span>
              <p className="text-slate-600 italic leading-relaxed">
                &ldquo;{selectedSub.content || "Uploaded assignment solution file attached."}&rdquo;
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Marks Awarded (Max {selectedSub.maxMarks})
                </label>
                <input
                  type="number"
                  min="0"
                  max={selectedSub.maxMarks}
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                  placeholder={`e.g. ${selectedSub.maxMarks - 5}`}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Evaluator Feedback & Rubric Remarks
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide qualitative feedback, strengths, and areas for improvement..."
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveGrade}
                disabled={saving || marks === ""}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 transition"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Save Marks & Notify Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
