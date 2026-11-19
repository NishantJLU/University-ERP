"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  Calendar,
  FileText,
  Download,
  Eye,
  Filter,
  Plus,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
  FileCode,
  FolderOpen,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Drawer from "@/components/ui/Drawer";
import { useToast } from "@/components/ui/Toast";

export interface ResourceItem {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  createdAt: string | Date;
  subject?: {
    id: string;
    code: string;
    name: string;
  } | null;
  semester?: {
    id: string;
    number: number;
  } | null;
  uploadedBy?: {
    name: string;
    role: string;
    email?: string;
  } | null;
}

interface StudentResourcesClientProps {
  initialResources: ResourceItem[];
  subjects: { id: string; code: string; name: string }[];
  semesters: { id: string; number: number }[];
  userRole: string;
  userName: string;
}

const CATEGORIES: { key: string; label: string; icon: any; color: string }[] = [
  { key: "ALL", label: "All Resources", icon: BookOpen, color: "bg-slate-100 text-slate-700" },
  { key: "ACADEMIC_CALENDAR", label: "Academic Calendar", icon: Calendar, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { key: "COURSE_SYLLABUS", label: "Course Syllabus", icon: FileText, color: "bg-purple-50 text-purple-700 border-purple-200" },
  { key: "LECTURE_NOTES", label: "Lecture Notes", icon: BookOpen, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { key: "STUDY_MATERIALS", label: "Study Materials", icon: FolderOpen, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { key: "PYQ", label: "Previous Year Papers", icon: FileCode, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { key: "POLICIES", label: "University Policies", icon: ShieldCheck, color: "bg-slate-100 text-slate-800 border-slate-300" },
  { key: "GUIDELINES", label: "Academic Guidelines", icon: CheckCircle2, color: "bg-teal-50 text-teal-700 border-teal-200" },
  { key: "EXAM_RESOURCES", label: "Exam Resources", icon: Sparkles, color: "bg-rose-50 text-rose-700 border-rose-200" },
];

export default function StudentResourcesClient({
  initialResources,
  subjects,
  semesters,
  userRole,
  userName,
}: StudentResourcesClientProps) {
  const { addToast } = useToast();
  const [resources, setResources] = useState<ResourceItem[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedSemester, setSelectedSemester] = useState("ALL");
  const [selectedSubject, setSelectedSubject] = useState("ALL");

  // Preview Modal state
  const [previewResource, setPreviewResource] = useState<ResourceItem | null>(null);

  // Upload Drawer state (for Faculty/Admin)
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    category: "LECTURE_NOTES",
    description: "",
    fileType: "PDF",
    fileSize: "2.4 MB",
    semesterId: "NONE",
    subjectId: "NONE",
  });

  const canUpload = ["TEACHER", "HOD", "ADMIN"].includes(userRole);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      // Category filter
      if (selectedCategory !== "ALL" && res.category !== selectedCategory) {
        return false;
      }

      // Semester filter
      if (selectedSemester !== "ALL" && res.semester?.id !== selectedSemester) {
        return false;
      }

      // Subject filter
      if (selectedSubject !== "ALL" && res.subject?.id !== selectedSubject) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = res.title.toLowerCase().includes(q);
        const matchesDesc = res.description?.toLowerCase().includes(q) || false;
        const matchesSubject =
          res.subject?.code.toLowerCase().includes(q) ||
          res.subject?.name.toLowerCase().includes(q) ||
          false;
        const matchesCategory = res.category.toLowerCase().replace(/_/g, " ").includes(q);
        if (!matchesTitle && !matchesDesc && !matchesSubject && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [resources, selectedCategory, selectedSemester, selectedSubject, searchQuery]);

  // Download simulation
  const handleDownload = (res: ResourceItem) => {
    addToast({
      title: "Downloading Academic Resource",
      message: `Transferring "${res.title}" (${res.fileSize})...`,
      type: "success",
    });

    // Create virtual anchor to trigger download
    const link = document.createElement("a");
    link.href = res.fileUrl;
    link.download = res.title.replace(/[^a-zA-Z0-9_-]/g, "_") + "." + res.fileType.toLowerCase();
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Upload submission
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) {
      addToast({
        title: "Validation Error",
        message: "Please enter a descriptive resource title.",
        type: "error",
      });
      return;
    }

    setUploadLoading(true);
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadForm),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload resource");
      }

      setResources((prev) => [data.resource, ...prev]);
      setUploadDrawerOpen(false);
      setUploadForm({
        title: "",
        category: "LECTURE_NOTES",
        description: "",
        fileType: "PDF",
        fileSize: "2.4 MB",
        semesterId: "NONE",
        subjectId: "NONE",
      });

      addToast({
        title: "Resource Published",
        message: `"${data.resource.title}" is now accessible to university students.`,
        type: "success",
      });
    } catch (err: any) {
      addToast({
        title: "Upload Failed",
        message: err.message || "An error occurred during publication.",
        type: "error",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="space-y-5 font-sans text-slate-800">
      {/* 1. Header Banner & Action */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] border-l-4 border-l-[#027EA1] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#EAF5F8] text-[#027EA1] border border-[#027EA1]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#027EA1]" />
              CENTRAL REPOSITORY
            </span>
            <span className="text-xs text-[#8D9BA8]">AY 2026–2027</span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="text-xs text-[#546574]">All Faculties & Departments</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#21313C]">
            Academic Documents & Learning Resources
          </h1>
          <p className="text-xs sm:text-sm text-[#546574] mt-1 max-w-3xl leading-relaxed">
            Centralized institutional repository for academic calendars, official course syllabi, lecture presentations, previous year examination papers, and university guidelines.
          </p>
        </div>

        {canUpload && (
          <div className="shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setUploadDrawerOpen(true)}
              className="px-4 py-2 bg-[#027EA1] hover:bg-[#026A88] text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Resource</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-[#8D9BA8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, subject code, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-[#F9FAFB] border border-[#E2E8F0] rounded-lg text-xs text-[#21313C] placeholder:text-[#8D9BA8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#027EA1]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8D9BA8] hover:text-[#21313C] p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Semester Filter */}
            <div className="flex items-center gap-1.5 text-xs text-[#546574]">
              <span className="font-semibold text-[11px] text-[#8D9BA8] hidden sm:inline">Semester:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-2.5 py-1.5 bg-[#F9FAFB] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#21313C] focus:outline-none focus:ring-1 focus:ring-[#027EA1]"
              >
                <option value="ALL">All Semesters</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    Semester {s.number}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div className="flex items-center gap-1.5 text-xs text-[#546574]">
              <span className="font-semibold text-[11px] text-[#8D9BA8] hidden sm:inline">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-2.5 py-1.5 bg-[#F9FAFB] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#21313C] focus:outline-none focus:ring-1 focus:ring-[#027EA1] max-w-[200px] truncate"
              >
                <option value="ALL">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code}: {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            const count =
              cat.key === "ALL"
                ? resources.length
                : resources.filter((r) => r.category === cat.key).length;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer border ${
                  isSelected
                    ? "bg-[#027EA1] text-white border-[#027EA1] shadow-2xs font-semibold"
                    : "bg-[#F9FAFB] hover:bg-[#F8F9FA] text-[#546574] border-[#E2E8F0]"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected ? "bg-white/20 text-white" : "bg-[#E2E8F0] text-[#546574]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Resources Grid View */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((res) => {
            const categoryMeta =
              CATEGORIES.find((c) => c.key === res.category) || CATEGORIES[1];
            const CategoryIcon = categoryMeta.icon;

            return (
              <div
                key={res.id}
                className="bg-white rounded-xl border border-[#E2E8F0] hover:border-[#027EA1]/40 p-5 shadow-xs transition hover:shadow-sm flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  {/* Category Pill & File Type */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${categoryMeta.color}`}
                    >
                      <CategoryIcon className="w-3 h-3" />
                      <span>{categoryMeta.label}</span>
                    </span>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F9FAFB] border border-[#E2E8F0] text-[#21313C]">
                      {res.fileType} • {res.fileSize}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-[#21313C] group-hover:text-[#027EA1] transition leading-snug line-clamp-2">
                      {res.title}
                    </h3>
                    {res.description && (
                      <p className="text-xs text-[#546574] mt-1.5 leading-relaxed line-clamp-2">
                        {res.description}
                      </p>
                    )}
                  </div>

                  {/* Subject & Semester Tag (if present) */}
                  {(res.subject || res.semester) && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                      {res.subject && (
                        <span className="px-2 py-0.5 rounded-md bg-[#F8F9FA] border border-[#E2E8F0] text-[#21313C] font-mono">
                          {res.subject.code}
                        </span>
                      )}
                      {res.semester && (
                        <span className="px-2 py-0.5 rounded-md bg-[#F8F9FA] border border-[#E2E8F0] text-[#546574]">
                          Sem {res.semester.number}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Metadata & Action Buttons */}
                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#8D9BA8]">
                  <div className="flex items-center gap-1.5 truncate mr-2" title={`Uploaded on ${formatDate(res.createdAt)}`}>
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{formatDate(res.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewResource(res)}
                      className="px-2.5 py-1.5 bg-[#F9FAFB] hover:bg-[#F8F9FA] text-[#21313C] border border-[#E2E8F0] rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                      title="Inspect Document Summary"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#8D9BA8]" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(res)}
                      className="px-2.5 py-1.5 bg-[#027EA1] hover:bg-[#026A88] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                      title="Download Resource"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 bg-white rounded-xl border border-[#E2E8F0] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#EAF5F8] text-[#027EA1] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#21313C]">No academic resources found</h3>
          <p className="text-xs text-[#546574] max-w-md mx-auto">
            No documents match your current filter parameters or search query. Try resetting filters to view all campus publications.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
              setSelectedSemester("ALL");
              setSelectedSubject("ALL");
            }}
            className="px-4 py-2 bg-[#F9FAFB] hover:bg-[#F8F9FA] text-[#21313C] border border-[#E2E8F0] rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* 4. Document Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#F9FAFB] border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span className="p-2 rounded-lg bg-[#EAF5F8] text-[#027EA1]">
                  <FileText className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#027EA1]">
                    {CATEGORIES.find((c) => c.key === previewResource.category)?.label || previewResource.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#21313C] truncate">
                    {previewResource.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                className="p-1.5 rounded-lg text-[#8D9BA8] hover:text-[#21313C] hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#546574]">
              <div className="p-3.5 bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#8D9BA8] block">Format</span>
                    <span className="font-mono font-semibold text-[#21313C]">
                      {previewResource.fileType} Document ({previewResource.fileSize})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#8D9BA8] block">Published Date</span>
                    <span className="font-semibold text-[#21313C]">
                      {formatDate(previewResource.createdAt)}
                    </span>
                  </div>
                </div>

                {previewResource.subject && (
                  <div className="pt-2 border-t border-[#E2E8F0]">
                    <span className="text-[10px] font-bold uppercase text-[#8D9BA8] block">Associated Course</span>
                    <span className="font-semibold text-[#21313C]">
                      {previewResource.subject.code}: {previewResource.subject.name}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#21313C] uppercase tracking-wider mb-1">
                  Document Overview & Abstract
                </h4>
                <p className="leading-relaxed bg-white p-3.5 rounded-lg border border-[#E2E8F0]">
                  {previewResource.description ||
                    "This official university academic document contains prescribed study material, institutional guidelines, or syllabus structures authenticated by the academic dean's office."}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#EDF3FA] border border-[#BFDBFE] text-[#3567A5] text-[11px] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Official Jagran Lakecity University authenticated academic material. Digital verification seal attached.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#F9FAFB] border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-[#21313C] border border-[#E2E8F0] rounded-lg text-xs font-semibold transition"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownload(previewResource);
                  setPreviewResource(null);
                }}
                className="px-4 py-2 bg-[#027EA1] hover:bg-[#026A88] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Upload Drawer (Restricted to Faculty / Admin) */}
      <Drawer
        isOpen={uploadDrawerOpen}
        onClose={() => setUploadDrawerOpen(false)}
        title="Upload Academic Resource"
        description="Publish syllabus, lecture materials, or university guidelines to the student repository."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#21313C] mb-1">
              Resource Title <span className="text-[#027EA1]">*</span>
            </label>
            <input
              type="text"
              required
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              placeholder="e.g. CS301 Database Systems - Unit 3 Relational Calculus"
              className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E2E8F0] rounded-lg text-xs text-[#21313C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#027EA1]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#21313C] mb-1">
              Resource Category <span className="text-[#027EA1]">*</span>
            </label>
            <select
              value={uploadForm.category}
              onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
              className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E2E8F0] rounded-lg text-xs text-[#21313C] focus:outline-none focus:ring-1 focus:ring-[#027EA1]"
            >
              <option value="ACADEMIC_CALENDAR">Academic Calendar</option>
              <option value="COURSE_SYLLABUS">Course Syllabus</option>
              <option value="LECTURE_NOTES">Lecture Notes</option>
              <option value="STUDY_MATERIALS">Study Materials</option>
              <option value="PYQ">Previous Year Question Papers</option>
              <option value="POLICIES">University Policies</option>
              <option value="GUIDELINES">Academic Guidelines</option>
              <option value="EXAM_RESOURCES">Examination Resources</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#21313C] mb-1">
                File Type
              </label>
              <select
                value={uploadForm.fileType}
                onChange={(e) => setUploadForm({ ...uploadForm, fileType: e.target.value })}
                className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E2E8F0] rounded-lg text-xs text-[#21313C] focus:outline-none focus:ring-1 focus:ring-[#027EA1]"
              >
                <option value="PDF">PDF Document</option>
                <option value="PPT">PowerPoint Presentation</option>
                <option value="DOC">Word Document</option>
                <option value="ZIP">ZIP Archive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#21313C] mb-1">
                Estimated File Size
              </label>
              <input
                type="text"
                value={uploadForm.fileSize}
                onChange={(e) => setUploadForm({ ...uploadForm, fileSize: e.target.value })}
                placeholder="e.g. 3.2 MB"
                className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E2E8F0] rounded-lg text-xs text-[#21313C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#027EA1]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#21313C] mb-1">
                Semester Association (Optional)
              </label>
              <select
                value={uploadForm.semesterId}
                onChange={(e) => setUploadForm({ ...uploadForm, semesterId: e.target.value })}
                className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E2E8F0] rounded-lg text-xs text-[#21313C] focus:outline-none focus:ring-1 focus:ring-[#027EA1]"
              >
                <option value="NONE">General / No Specific Semester</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    Semester {s.number}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#21313C] mb-1">
                Course Subject (Optional)
              </label>
              <select
                value={uploadForm.subjectId}
                onChange={(e) => setUploadForm({ ...uploadForm, subjectId: e.target.value })}
                className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E2E8F0] rounded-lg text-xs text-[#21313C] focus:outline-none focus:ring-1 focus:ring-[#027EA1] truncate"
              >
                <option value="NONE">No Specific Subject</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code}: {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#21313C] mb-1">
              Description & Learning Objectives
            </label>
            <textarea
              rows={3}
              value={uploadForm.description}
              onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              placeholder="Provide context on topics covered, prerequisite units, or examination relevance..."
              className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E2E8F0] rounded-lg text-xs text-[#21313C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#027EA1]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setUploadDrawerOpen(false)}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-[#21313C] border border-[#E2E8F0] rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadLoading}
              className="px-4 py-2 bg-[#027EA1] hover:bg-[#026A88] text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {uploadLoading ? (
                <span>Publishing...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Publish Document</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
