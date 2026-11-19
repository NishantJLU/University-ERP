"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  FileText,
  HelpCircle,
  Award,
  CheckCircle2,
  Clock,
  Download,
  PlayCircle,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Users,
  Send,
  Loader2,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

interface LMSCourseHubProps {
  course: any;
  userRole: string;
  attendanceStats?: {
    percentage: number;
    attended: number;
    total: number;
  };
  nextClassSlot?: {
    day: string;
    time: string;
    room: string;
    faculty: string;
  };
}

export default function LMSCourseHub({
  course,
  userRole,
  attendanceStats = { percentage: 92, attended: 12, total: 13 },
  nextClassSlot = {
    day: "Monday",
    time: "09:00 AM - 10:00 AM",
    room: "LH-101 (Turing Block)",
    faculty: "Dr. Vikram Rao",
  },
}: LMSCourseHubProps) {
  const [activeTab, setActiveTab] = useState<"MODULES" | "ASSIGNMENTS" | "QUIZZES" | "GRADES">("MODULES");
  const [openModuleIndex, setOpenModuleIndex] = useState<number>(0);
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<any | null>(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  // Assignment submission modal state
  const [submittingAssignment, setSubmittingAssignment] = useState<any | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Publish readable course title to header breadcrumb
  useEffect(() => {
    if (course?.id && course?.subject?.code) {
      window.dispatchEvent(
        new CustomEvent("erp-breadcrumb-title", {
          detail: {
            id: course.id,
            title: `${course.subject.code} (${course.subject.name || "Course"})`,
          },
        })
      );
    }
  }, [course?.id, course?.subject?.code, course?.subject?.name]);

  const handleQuizSubmit = async () => {
    if (!activeQuiz) return;
    setQuizSubmitting(true);
    try {
      const res = await fetch("/api/lms/quizzes/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: activeQuiz.id,
          answers: quizAnswers,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setQuizResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQuizSubmitting(false);
    }
  };

  const handleAssignmentSubmit = async () => {
    if (!submittingAssignment) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/lms/assignments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: submittingAssignment.id,
          content: submissionText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Assignment submitted successfully!");
        setSubmittingAssignment(null);
        setSubmissionText("");
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to submit assignment.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error submitting assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Integrated Header Banner (Light Institutional Card) */}
      <div className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#EEF0F3] border-l-4 border-l-[#861F41] relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#F9EEF2] text-[#861F41] border border-[#F4D3DE]">
              {course.subject?.code || "CS301"}
            </span>
            <span className="text-xs text-[#697386] font-medium">
              {course.subject?.department?.name || "Computer Science & Engineering"}
            </span>
            <span className="text-[#9299A8]">•</span>
            <span className="text-xs text-[#861F41] font-semibold bg-[#F9EEF2] px-2 py-0.5 rounded border border-[#F4D3DE]">
              {course.subject?.credits || 4} Academic Credits
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#202435]">
            {course.title}
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-[#697386] max-w-3xl leading-relaxed">
            {course.description}
          </p>

          {/* Integrated ERP Live Indicators */}
          <div className="mt-6 pt-5 border-t border-[#EEF0F3] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-3 bg-[#F7F7F9] p-3 rounded-lg border border-[#EEF0F3]">
              <div className="p-2 rounded-lg bg-[#F9EEF2] text-[#861F41]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-[#9299A8] uppercase font-semibold">Course Instructor</p>
                <p className="font-bold text-[#202435] truncate">{course.faculty?.user?.name || "Dr. Vikram Rao"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#EAF7F0] p-3 rounded-lg border border-[#B7EAD0]">
              <div className="p-2 rounded-lg bg-[#EAF7F0] text-[#16845B]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-[#16845B] uppercase font-semibold">ERP Subject Attendance</p>
                <p className="font-bold text-[#16845B]">
                  {attendanceStats.percentage}% ({attendanceStats.attended}/{attendanceStats.total} Classes)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#F7F7F9] p-3 rounded-lg border border-[#EEF0F3]">
              <div className="p-2 rounded-lg bg-[#FFF7E6] text-[#B7791F]">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-[#9299A8] uppercase font-semibold">Next Timetable Lecture</p>
                <p className="font-bold text-[#202435] truncate">{nextClassSlot.day}, {nextClassSlot.time.split(" - ")[0]} ({nextClassSlot.room})</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Brightspace Analytics Depth Strip */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#EEF0F3] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#9299A8] tracking-wider">Learning Mastery</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-extrabold text-[#861F41]">89%</span>
            <span className="text-[10px] font-semibold text-[#16845B] bg-[#EAF7F0] px-1.5 py-0.5 rounded border border-[#B7EAD0]">High Proficiency</span>
          </div>
          <p className="text-[10px] text-[#697386] mt-0.5">Competency Benchmark: Exceeded</p>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-[#9299A8] tracking-wider">Modules Completed</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-extrabold text-[#202435]">2 / 3</span>
            <span className="text-[10px] text-[#697386] font-mono">67% Complete</span>
          </div>
          <div className="w-full bg-[#F1F2F5] h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-[#861F41] h-full rounded-full" style={{ width: "67%" }} />
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-[#9299A8] tracking-wider">Assignments Graded</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-extrabold text-[#202435]">94 / 100</span>
            <span className="text-[10px] text-[#861F41] font-semibold bg-[#F9EEF2] px-1.5 py-0.5 rounded border border-[#F4D3DE]">Grade A+</span>
          </div>
          <p className="text-[10px] text-[#697386] mt-0.5">Assignment 1 Reviewed</p>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-[#9299A8] tracking-wider">Quizzes Attempted</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-extrabold text-[#16845B]">20 / 20</span>
            <span className="text-[10px] text-[#16845B] font-semibold bg-[#EAF7F0] px-1.5 py-0.5 rounded border border-[#B7EAD0]">100% Score</span>
          </div>
          <p className="text-[10px] text-[#697386] mt-0.5">Objective Auto-Evaluated</p>
        </div>
      </div>

      {/* 3. Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EEF0F3]">
        <button
          onClick={() => setActiveTab("MODULES")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === "MODULES"
              ? "border-[#861F41] text-[#861F41]"
              : "border-transparent text-[#697386] hover:text-[#202435]"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Course Modules & Materials
        </button>

        <button
          onClick={() => setActiveTab("ASSIGNMENTS")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === "ASSIGNMENTS"
              ? "border-[#861F41] text-[#861F41]"
              : "border-transparent text-[#697386] hover:text-[#202435]"
          }`}
        >
          <FileText className="w-4 h-4" />
          Assignments ({course.subject?.assignments?.length || 1})
        </button>

        <button
          onClick={() => setActiveTab("QUIZZES")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === "QUIZZES"
              ? "border-[#861F41] text-[#861F41]"
              : "border-transparent text-[#697386] hover:text-[#202435]"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Quizzes ({course.subject?.quizzes?.length || 1})
        </button>

        <button
          onClick={() => setActiveTab("GRADES")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === "GRADES"
              ? "border-[#861F41] text-[#861F41]"
              : "border-transparent text-[#697386] hover:text-[#202435]"
          }`}
        >
          <Award className="w-4 h-4" />
          Gradebook & Feedback
        </button>
      </div>

      {/* 4. Tab Contents with Side To-Do Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Primary Learning Content */}
        <div className="lg:col-span-8 space-y-4">
          {/* TAB 1: MODULES */}
          {activeTab === "MODULES" && (
            <div className="space-y-4">
              {course.modules?.map((mod: any, idx: number) => {
                const isOpen = openModuleIndex === idx;
                return (
                  <div
                    key={mod.id}
                    className="bg-white rounded-xl shadow-xs border border-[#EEF0F3] overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenModuleIndex(isOpen ? -1 : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between bg-[#F8F8FA] hover:bg-[#F1F2F5] transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#F9EEF2] text-[#861F41] text-xs font-bold flex items-center justify-center">
                          {mod.orderIndex}
                        </span>
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-[#202435]">
                            {mod.title}
                          </h3>
                          <p className="text-[11px] text-[#697386] mt-0.5">
                            {mod.description}
                          </p>
                        </div>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#9299A8]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#9299A8]" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="divide-y divide-[#EEF0F3] p-2">
                        {mod.lessons?.map((lesson: any) => (
                          <div
                            key={lesson.id}
                            className="p-3.5 rounded-lg hover:bg-[#F7F7F9] flex items-start justify-between gap-3 transition"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-[#F9EEF2] text-[#861F41] mt-0.5">
                                <PlayCircle className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-[#202435]">
                                  {lesson.title}
                                </h4>
                                <p className="text-[11px] text-[#697386] mt-1 leading-relaxed">
                                  {lesson.content}
                                </p>
                                <div className="flex items-center gap-3 mt-2 text-[10px] text-[#9299A8]">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {lesson.durationMin} mins
                                  </span>
                                  {lesson.videoUrl && (
                                    <a
                                      href={lesson.videoUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[#861F41] hover:underline flex items-center gap-1 font-semibold"
                                    >
                                      Watch Video Lecture <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF7F0] text-[#16845B] border border-[#B7EAD0] shrink-0">
                              Completed
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Learning Materials Section */}
              <div className="bg-white rounded-xl shadow-xs border border-[#EEF0F3] p-5">
                <h3 className="text-xs font-bold text-[#202435] uppercase tracking-wider mb-3">
                  Downloadable Study Materials & Lecture Notes
                </h3>
                <div className="space-y-2">
                  {course.materials?.map((mat: any) => (
                    <div
                      key={mat.id}
                      className="p-3 rounded-lg border border-[#EEF0F3] flex items-center justify-between hover:bg-[#F7F7F9] transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#F9EEF2] text-[#861F41]">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#202435]">{mat.title}</p>
                          <p className="text-[10px] text-[#9299A8]">
                            {mat.fileType} • {mat.fileSize} • Uploaded by Faculty
                          </p>
                        </div>
                      </div>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          toast.info(`Downloading learning material: ${mat.title}`);
                        }}
                        className="p-2 rounded-lg bg-[#F1F2F5] hover:bg-[#E5E7EB] text-[#202435] text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ASSIGNMENTS */}
          {activeTab === "ASSIGNMENTS" && (
            <div className="space-y-4">
              {course.subject?.assignments?.map((assignment: any) => {
                const submission = assignment.submissions?.[0];
                return (
                  <div
                    key={assignment.id}
                    className="bg-white rounded-xl shadow-xs border border-[#EEF0F3] p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#3567A5] bg-[#EDF3FA] px-2 py-0.5 rounded border border-[#BCD7F3]">
                          Due {formatDate(assignment.dueDate)}
                        </span>
                        <h3 className="text-sm font-bold text-[#202435] mt-1">
                          {assignment.title}
                        </h3>
                        <p className="text-xs text-[#697386] mt-1 leading-relaxed">
                          {assignment.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#202435] block">
                          Max {assignment.maxMarks} Marks
                        </span>
                        {submission ? (
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF7F0] text-[#16845B] border border-[#B7EAD0]">
                            {submission.status}
                          </span>
                        ) : (
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF7E6] text-[#B7791F] border border-[#FDE5A9]">
                            Pending Submission
                          </span>
                        )}
                      </div>
                    </div>

                    {submission && (
                      <div className="p-3 bg-[#F7F7F9] rounded-lg border border-[#EEF0F3] text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-[#202435]">Your Submission:</span>
                          <span className="text-[10px] text-[#9299A8]">
                            Submitted on {formatDate(submission.submittedAt)}
                          </span>
                        </div>
                        <p className="text-[#697386] italic">&ldquo;{submission.content}&rdquo;</p>

                        {submission.marksObtained !== null && (
                          <div className="mt-2 pt-2 border-t border-[#EEF0F3] flex items-center justify-between text-[#16845B]">
                            <span className="font-bold">Score: {submission.marksObtained} / {assignment.maxMarks}</span>
                            <span className="text-[11px] text-[#697386] font-normal">Feedback: {submission.feedback}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {userRole === "STUDENT" && !submission && (
                      <button
                        onClick={() => setSubmittingAssignment(assignment)}
                        className="px-4 py-2 bg-[#861F41] hover:bg-[#64152F] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Submit Assignment Response
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: QUIZZES */}
          {activeTab === "QUIZZES" && (
            <div className="space-y-4">
              {course.subject?.quizzes?.map((quiz: any) => {
                const attempt = quiz.attempts?.[0];
                return (
                  <div
                    key={quiz.id}
                    className="bg-white rounded-xl shadow-xs border border-[#EEF0F3] p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#202435]">{quiz.title}</h3>
                          <span className="text-[10px] uppercase font-bold text-[#861F41] bg-[#F9EEF2] px-2 py-0.5 rounded border border-[#F4D3DE]">
                            Auto-Graded
                          </span>
                        </div>
                        <p className="text-xs text-[#697386] mt-1">{quiz.instructions}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-[#9299A8]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Duration: {quiz.durationMinutes} mins
                          </span>
                          <span>•</span>
                          <span>Total Marks: {quiz.totalMarks}</span>
                        </div>
                      </div>

                      {attempt ? (
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#16845B] bg-[#EAF7F0] px-2.5 py-1 rounded-full border border-[#B7EAD0]">
                            Score: {attempt.score} / {attempt.maxScore}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveQuiz(quiz);
                            setQuizResult(null);
                            setQuizAnswers({});
                          }}
                          className="px-4 py-2 bg-[#861F41] hover:bg-[#64152F] text-white rounded-lg text-xs font-bold transition"
                        >
                          Start Quiz Attempt
                        </button>
                      )}
                    </div>

                    {/* Active Interactive Quiz Player */}
                    {activeQuiz?.id === quiz.id && !quizResult && (
                      <div className="mt-4 p-4 bg-[#F7F7F9] rounded-xl border border-[#EEF0F3] space-y-4">
                        <h4 className="text-xs font-bold text-[#861F41] uppercase">
                          Answer the following objective questions:
                        </h4>

                        {quiz.questions?.map((q: any, qIdx: number) => {
                          const options: string[] = JSON.parse(q.optionsJson || "[]");
                          return (
                            <div key={q.id} className="p-3 bg-white rounded-lg border border-[#EEF0F3] space-y-2 text-xs">
                              <p className="font-bold text-[#202435]">
                                {qIdx + 1}. {q.questionText} ({q.marks} Mark)
                              </p>
                              <div className="space-y-1.5 pl-2">
                                {options.map((opt, optIdx) => (
                                  <label
                                    key={optIdx}
                                    className="flex items-center gap-2 cursor-pointer text-[#202435] hover:text-[#861F41]"
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      checked={quizAnswers[q.id] === optIdx}
                                      onChange={() =>
                                        setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                                      }
                                      className="accent-[#861F41]"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          );
                        })}

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setActiveQuiz(null)}
                            className="px-3 py-1.5 text-xs text-[#697386] hover:text-[#202435] font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleQuizSubmit}
                            disabled={quizSubmitting}
                            className="px-4 py-1.5 bg-[#16845B] hover:bg-[#126b4a] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                          >
                            {quizSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                            Submit & Auto-Evaluate
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Quiz Result Breakdown */}
                    {quizResult && activeQuiz?.id === quiz.id && (
                      <div className="mt-4 p-4 bg-[#EAF7F0] rounded-xl border border-[#B7EAD0] text-xs space-y-2">
                        <div className="flex items-center justify-between font-bold text-[#16845B]">
                          <span>{quizResult.message}</span>
                          <span>Score: {quizResult.percentage}%</span>
                        </div>
                        <p className="text-[#697386] text-[11px]">
                          Your answers have been stored in the university gradebook.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: GRADES */}
          {activeTab === "GRADES" && (
            <div className="bg-white rounded-xl shadow-xs border border-[#EEF0F3] p-5 space-y-4">
              <h3 className="text-xs font-bold text-[#202435] uppercase tracking-wider">
                Continuous Evaluation & Gradebook Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EEF0F3] bg-[#F8F8FA] text-[10px] font-bold uppercase text-[#9299A8]">
                      <th className="p-3">Evaluation Item</th>
                      <th className="p-3">Weight</th>
                      <th className="p-3">Max Marks</th>
                      <th className="p-3">Score Achieved</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEF0F3]">
                    <tr>
                      <td className="p-3 font-semibold text-[#202435]">Assignment 1 (BCNF Normalization)</td>
                      <td className="p-3 text-[#697386]">20%</td>
                      <td className="p-3 text-[#202435]">100</td>
                      <td className="p-3 font-bold text-[#16845B]">94</td>
                      <td className="p-3"><span className="status-badge status-badge-success">Graded</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#202435]">Quiz 1 (SQL & Relational Algebra)</td>
                      <td className="p-3 text-[#697386]">10%</td>
                      <td className="p-3 text-[#202435]">20</td>
                      <td className="p-3 font-bold text-[#16845B]">20</td>
                      <td className="p-3"><span className="status-badge status-badge-success">Graded</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#202435]">Mid-Semester Practical Examination</td>
                      <td className="p-3 text-[#697386]">30%</td>
                      <td className="p-3 text-[#202435]">50</td>
                      <td className="p-3 text-[#9299A8]">—</td>
                      <td className="p-3"><span className="status-badge status-badge-warning">Upcoming</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#202435]">End-Semester University Theory Exam</td>
                      <td className="p-3 text-[#697386]">40%</td>
                      <td className="p-3 text-[#202435]">100</td>
                      <td className="p-3 text-[#9299A8]">—</td>
                      <td className="p-3"><span className="status-badge status-badge-info">Scheduled</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Canvas-Style To-Do & Quick Alerts */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-[#EEF0F3] p-4">
            <h3 className="text-xs font-bold text-[#202435] uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Course To-Do List</span>
              <span className="text-[10px] bg-[#F9EEF2] text-[#861F41] px-1.5 py-0.5 rounded font-bold border border-[#F4D3DE]">Canvas Sync</span>
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F7F7F9] border border-[#EEF0F3] flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#861F41] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-[#202435] leading-tight">Read Module 2.1 Indexing</p>
                  <p className="text-[10px] text-[#697386] mt-0.5">B+ Trees & Clustered Indexes</p>
                  <span className="text-[10px] text-[#861F41] font-bold mt-1 block">Due this Wednesday</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F7F7F9] border border-[#EEF0F3] flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-[#861F41] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-[#202435] leading-tight">Database Lab Exam Prep</p>
                  <p className="text-[10px] text-[#697386] mt-0.5">Practice PL/SQL triggers in Lab 101</p>
                  <span className="text-[10px] text-[#861F41] font-bold mt-1 block">Oct 18 Exam</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-[#EEF0F3] p-4">
            <h3 className="text-xs font-bold text-[#202435] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#697386]" />
              Faculty Office Hours
            </h3>
            <div className="text-xs space-y-2 text-[#697386]">
              <p className="font-semibold text-[#202435]">{course.faculty?.user?.name || "Dr. Vikram Rao"}</p>
              <p className="text-[11px] text-[#697386]">Turing Block, Room 204</p>
              <p className="text-[11px] text-[#697386]">Mon & Wed: 03:00 PM - 04:30 PM</p>
              <a
                href="mailto:teacher@demo.edu"
                className="inline-block mt-1 text-[11px] text-[#861F41] font-semibold hover:underline"
              >
                teacher@demo.edu
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Submission Modal */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-[#EEF0F3]">
            <h3 className="text-sm font-bold text-[#202435]">
              Submit Assignment: {submittingAssignment.title}
            </h3>
            <p className="text-xs text-[#697386]">
              Enter your solution text, GitHub repository link, or SQL script below:
            </p>
            <textarea
              rows={5}
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Paste your SQL schema or submission comments here..."
              className="w-full p-3 text-xs border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#861F41] focus:border-[#861F41] focus:outline-none text-[#202435]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSubmittingAssignment(null)}
                className="px-3 py-1.5 text-xs text-[#697386] hover:text-[#202435]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignmentSubmit}
                disabled={submitting || !submissionText.trim()}
                className="px-4 py-1.5 bg-[#861F41] hover:bg-[#64152F] text-white rounded-lg text-xs font-bold disabled:opacity-50 transition"
              >
                {submitting ? "Uploading..." : "Confirm Submission"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
