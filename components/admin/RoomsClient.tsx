"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, DoorClosed } from "lucide-react";
import CreateRoomDrawer from "@/components/admin/drawers/CreateRoomDrawer";
import EmptyState from "@/components/ui/EmptyState";

interface RoomItem {
  id: string;
  roomNumber: string;
  building: string;
  floor: number;
  capacity: number;
  roomType: string;
}

export default function RoomsClient({ initialRooms }: { initialRooms: RoomItem[] }) {
  const [rooms] = useState<RoomItem[]>(initialRooms);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return rooms.filter((r) => {
      const matchSearch =
        !q ||
        r.roomNumber.toLowerCase().includes(q) ||
        r.building.toLowerCase().includes(q);
      const matchType = typeFilter === "ALL" || r.roomType === typeFilter;
      return matchSearch && matchType;
    });
  }, [rooms, search, typeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Campus Infrastructure
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Classrooms, Labs & Auditoriums
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical room inventory, seating capacities, and room type constraints used by the Timetable Engine
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Room
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms by number or building..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Facility Types</option>
            <option value="CLASSROOM">Classrooms</option>
            <option value="LAB">Computer & Science Labs</option>
            <option value="SEMINAR_HALL">Seminar Halls</option>
          </select>
          <span className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">{filtered.length}</span> of {rooms.length}
          </span>
        </div>
      </div>

      {/* Rooms Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-3 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  {room.roomNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    room.roomType === "LAB"
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : room.roomType === "SEMINAR_HALL"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {room.roomType}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <p>Building: <span className="font-semibold text-slate-800">{room.building}</span></p>
                <p>Floor Level: Floor {room.floor}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Max Capacity:</span>
                <span className="font-mono font-bold text-emerald-700">{room.capacity} Desks</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<DoorClosed className="w-6 h-6" />}
          title="No rooms found"
          description={search ? `No campus rooms matched "${search}".` : "No classrooms or laboratories registered."}
          action={
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDrawerOpen(true);
              }}
              className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold"
            >
              Add Campus Room
            </button>
          }
        />
      )}

      {/* Creation Drawer */}
      <CreateRoomDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
