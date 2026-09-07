"use client";

import React from "react";
import Drawer from "@/components/ui/Drawer";
import Link from "next/link";
import { GraduationCap, Mail, Phone, Calendar, CreditCard, BookOpen, User, ArrowRight } from "lucide-react";

interface StudentDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: string;
    name: string;
    rollNumber: string;
    email: string;
    phone?: string | null;
    programName: string;
    programCode: string;
    semesterNumber: number;
    sectionName?: string | null;
    admissionDate: string;
    gender?: string | null;
  } | null;
}

export default function StudentDetailDrawer({
  isOpen,
  onClose,
  student,
}: StudentDetailDrawerProps) {
  if (!student) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={student.name}
      description={`${student.rollNumber} • ${student.programName}`}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] text-slate-400 font-mono">ID: {student.id.slice(0, 8)}...</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Profile Card Summary */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-base shadow-xs">
            {student.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{student.name}</h3>
            <p className="text-xs text-slate-500 font-mono">{student.rollNumber}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Enrolled
            </span>
          </div>
        </div>

        {/* Academic Details */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
            Academic Status
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Degree Program</span>
              <span className="font-semibold text-slate-800">{student.programCode}</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Current Semester</span>
              <span className="font-semibold text-slate-800">Semester {student.semesterNumber}</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Section Batch</span>
              <span className="font-semibold text-blue-700">{student.sectionName || "Unassigned"}</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Admission Date</span>
              <span className="font-semibold text-slate-800">{student.admissionDate}</span>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
            Contact & Identification
          </h4>
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{student.email}</span>
            </div>
            {student.phone && (
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{student.phone}</span>
              </div>
            )}
            {student.gender && (
              <div className="flex items-center gap-2 text-slate-600">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Gender: {student.gender}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Cross-Links */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
            Contextual Records
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/admin/timetable"
              className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs flex items-center justify-between transition"
            >
              <span className="font-medium text-slate-700">Section Timetable</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              href="/admin/fees"
              className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs flex items-center justify-between transition"
            >
              <span className="font-medium text-slate-700">Fee Structure</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
