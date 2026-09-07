"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, Bell, Filter, Calendar, User, Tag, Sparkles } from "lucide-react";
import PublishNoticeDrawer from "@/components/admin/drawers/PublishNoticeDrawer";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

interface NoticeRecord {
  id: string;
  title: string;
  content: string;
  priority: string;
  targetScope: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
  };
}

interface NoticesClientProps {
  initialNotices: NoticeRecord[];
}

export default function NoticesClient({ initialNotices }: NoticesClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [scopeFilter, setScopeFilter] = useState("ALL");
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  const filteredNotices = useMemo(() => {
    return initialNotices.filter((n) => {
      const matchSearch =
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.author.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPriority =
        priorityFilter === "ALL" || n.priority === priorityFilter;

      const matchScope =
        scopeFilter === "ALL" || n.targetScope === scopeFilter;

      return matchSearch && matchPriority && matchScope;
    });
  }, [initialNotices, searchTerm, priorityFilter, scopeFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Broadcast Communications
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            University Notices & Bulletins ({initialNotices.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue targeted communications to the entire university, departments, programs, or individual roles
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPublishOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Publish New Notice
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circulars by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="NORMAL">Normal</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Audience:</span>
            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none"
            >
              <option value="ALL">All Audiences</option>
              <option value="ALL">Entire Campus</option>
              <option value="STUDENTS">Students Only</option>
              <option value="FACULTY">Faculty & Staff</option>
            </select>
          </div>

          {(searchTerm || priorityFilter !== "ALL" || scopeFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setPriorityFilter("ALL");
                setScopeFilter("ALL");
              }}
              className="text-xs text-rose-600 font-semibold hover:underline ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Notices List */}
      {filteredNotices.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notices Found"
          description={
            searchTerm || priorityFilter !== "ALL" || scopeFilter !== "ALL"
              ? "No notices match your active filter criteria."
              : "No campus circulars have been published yet."
          }
          actionLabel="Publish Notice"
          onAction={() => setIsPublishOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((notice) => {
            const isUrgent = notice.priority === "URGENT" || notice.priority === "HIGH";
            return (
              <div
                key={notice.id}
                className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-3.5 hover:border-slate-300 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isUrgent
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {notice.priority}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      Scope: {notice.targetScope}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(notice.publishedAt)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{notice.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {notice.content}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Author: <strong className="text-slate-700">{notice.author.name}</strong> ({notice.author.role})
                  </span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Broadcast
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Creation Drawer */}
      <PublishNoticeDrawer
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
      />
    </div>
  );
}
