import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import RoomsClient from "@/components/admin/RoomsClient";

export default async function AdminRoomsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const rooms = await prisma.room.findMany({
    orderBy: { roomNumber: "asc" },
  });

  const formatted = rooms.map((r) => ({
    id: r.id,
    roomNumber: r.roomNumber,
    building: r.building,
    floor: r.floor,
    capacity: r.capacity,
    roomType: r.roomType,
  }));

  return <RoomsClient initialRooms={formatted} />;
}
