"use client";

import React, { useState } from "react";
import Drawer from "@/components/ui/Drawer";
import { toast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

interface CreateRoomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateRoomDrawer({
  isOpen,
  onClose,
  onSuccess,
}: CreateRoomDrawerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: "",
    building: "Block A",
    floor: 1,
    capacity: 60,
    roomType: "CLASSROOM",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomNumber || !formData.building) {
      toast.error("Please provide room number and building.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Room "${formData.roomNumber}" registered successfully.`);
        setFormData({
          roomNumber: "",
          building: "Block A",
          floor: 1,
          capacity: 60,
          roomType: "CLASSROOM",
        });
        onClose();
        if (onSuccess) onSuccess();
        router.refresh();
      } else {
        toast.error(data.message || "Failed to create room.");
      }
    } catch (err) {
      toast.error("Network error while creating room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Add Campus Room / Lab"
      description="Register physical facility inventory with seating capacity and type constraints."
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
            {loading ? "Creating..." : "Add Room"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Room Number / Label <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. LH-201, LAB-3, AUD-1"
            value={formData.roomNumber}
            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono uppercase focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Building / Block <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tech Block, Block B"
              value={formData.building}
              onChange={(e) => setFormData({ ...formData, building: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Floor Level</label>
            <input
              type="number"
              min={0}
              max={15}
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Room Type</label>
            <select
              value={formData.roomType}
              onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
            >
              <option value="CLASSROOM">Classroom</option>
              <option value="LAB">Computer / Practical Lab</option>
              <option value="SEMINAR_HALL">Seminar Hall / Auditorium</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Seating Capacity</label>
            <input
              type="number"
              min={5}
              max={500}
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
            />
          </div>
        </div>
      </form>
    </Drawer>
  );
}
