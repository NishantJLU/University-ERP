"use client";

import React, { useState } from "react";
import Drawer from "@/components/ui/Drawer";
import { toast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

interface CreateSectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  semesters: { id: string; number: number; programName: string }[];
  onSuccess?: () => void;
}

export default function CreateSectionDrawer({
  isOpen,
  onClose,
  semesters,
  onSuccess,
}: CreateSectionDrawerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "Section A",
    capacity: 60,
    semesterId: semesters[0]?.id || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.semesterId) {
      toast.error("Please fill in section name and select a semester.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Section "${formData.name}" created successfully.`);
        setFormData({ name: "Section A", capacity: 60, semesterId: semesters[0]?.id || "" });
        onClose();
        if (onSuccess) onSuccess();
        router.refresh();
      } else {
        toast.error(data.message || "Failed to create section.");
      }
    } catch (err) {
      toast.error("Network error while creating section.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Create Class Section"
      description="Create a section cohort with student seating limits for class scheduling."
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
            {loading ? "Creating..." : "Create Section"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Section Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Section A, Section B, Batch C"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
          />
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

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Student Capacity Limit
          </label>
          <input
            type="number"
            min={10}
            max={200}
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
          />
          <p className="text-[10px] text-slate-400 mt-1">Used by timetable conflict engine to avoid room overcrowding</p>
        </div>
      </form>
    </Drawer>
  );
}
