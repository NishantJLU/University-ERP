import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import TeacherAttendanceClient from "./TeacherAttendanceClient";

interface PageProps {
  searchParams: {
    subjectId?: string;
    sectionId?: string;
    periodId?: string;
  };
}

export default async function TeacherAttendancePage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER" || !user.facultyId) {
    redirect("/login");
  }

  const faculty = await prisma.faculty.findUnique({
    where: { id: user.facultyId },
    include: {
      assignments: {
        include: { subject: true, section: true },
      },
    },
  });

  if (!faculty || faculty.assignments.length === 0) {
    return <div className="p-6">No teaching assignments allocated.</div>;
  }

  const subjects = Array.from(
    new Map(faculty.assignments.map((a) => [a.subject.id, a.subject])).values()
  );
  const sections = Array.from(
    new Map(faculty.assignments.map((a) => [a.section.id, a.section])).values()
  );

  const selectedSubjectId = searchParams.subjectId || subjects[0].id;
  const selectedSectionId = searchParams.sectionId || sections[0].id;

  // Fetch all students enrolled in this section and subject
  const students = await prisma.student.findMany({
    where: { sectionId: selectedSectionId },
    include: { user: true },
    orderBy: { rollNumber: "asc" },
  });

  const studentList = students.map((s) => ({
    id: s.id,
    name: s.user.name,
    rollNumber: s.rollNumber,
    avatar: s.user.avatar,
  }));

  return (
    <TeacherAttendanceClient
      subjects={subjects}
      sections={sections}
      initialSubjectId={selectedSubjectId}
      initialSectionId={selectedSectionId}
      initialPeriodNumber={1}
      initialStudents={studentList}
      facultyId={faculty.id}
    />
  );
}
