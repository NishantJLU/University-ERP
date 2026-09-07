"use client";

import React, { useState } from "react";
import Drawer from "@/components/ui/Drawer";
import { toast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

interface CreateSubjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  departments: { id: string; name: string; code: string }[];
  semesters: { id: string; number: number; programName: string }[];
  onSuccess?: () => void;
}

export default function CreateSubjectDrawer({
  isOpen,
  onClose,
  departments,
  semesters,
  onSuccess,
}: CreateSubjectDrawerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    credits: 4,
    type: "THEORY",
    departmentId: departments[0]?.id || "",
    semesterId: semesters[0]?.id || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name || !formData.departmentId || !formData.semesterId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Subject "${formData.code}: ${formData.name}" registered and LMS hub initialized.`);
        setFormData({
          code: "",
          name: "",
          credits: 4,
          type: "THEORY",
          departmentId: departments[0]?.id || "",
          semesterId: semesters[0]?.id || "",
        });
        onClose();
        if (onSuccess) onSuccess();
        router.refresh();
      } else {
        toast.error(data.message || "Failed to create subject.");
      }
    } catch (err) {
      toast.error("Network error while creating subject.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Add Curriculum Subject"
      description="Add theory or practical courses with academic credits. Automatically provisions an LMS course hub."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? "Creating..." : "Create Subject"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Subject Code <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. CS401, IT302, MGMT101"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono uppercase focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Subject Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Cloud Computing & Distributed Systems"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Credits</label>
            <input
              type="number"
              min={1}
              max={10}
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
            >
              <option value="THEORY">Theory Course</option>
              <option value="LAB">Practical / Lab</option>
              <option value="HYBRID">Hybrid (Theory + Lab)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Department <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
          >
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.code} - {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Semester & Program <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.semesterId}
            onChange={(e) => setFormData({ ...formData, semesterId: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
          >
            {semesters.map((sem) => (
              <option key={sem.id} value={sem.id}>
                Semester {sem.number} ({sem.programName})
              </option>
            ))}
          </select>
        </div>
      </form>
    </Drawer>
  );
}
