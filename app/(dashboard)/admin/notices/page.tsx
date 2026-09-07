import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import NoticesClient from "@/components/admin/NoticesClient";

export default async function AdminNoticesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const notices = await prisma.notice.findMany({
    include: { author: true },
    orderBy: { publishedAt: "desc" },
  });

  return <NoticesClient initialNotices={notices as any} />;
}
