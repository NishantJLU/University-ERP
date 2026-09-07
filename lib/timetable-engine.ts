import prisma from "./prisma";
import { TimetableConflict } from "@/types";

export interface PeriodSlotInput {
  subjectId: string;
  facultyId: string;
  roomId: string;
  sectionId: string;
  dayOfWeek: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
}

/**
 * Validates a set of timetable periods against existing university schedules
 * to detect teacher, room, section, capacity, and laboratory requirement conflicts.
 */
export async function detectTimetableConflicts(
  periods: PeriodSlotInput[],
  ignoreTimetableId?: string
): Promise<TimetableConflict[]> {
  const conflicts: TimetableConflict[] = [];

  // Fetch reference metadata for room capacities & subject types
  const roomIds = Array.from(new Set(periods.map((p) => p.roomId)));
  const subjectIds = Array.from(new Set(periods.map((p) => p.subjectId)));
  const sectionIds = Array.from(new Set(periods.map((p) => p.sectionId)));
  const facultyIds = Array.from(new Set(periods.map((p) => p.facultyId)));

  const [rooms, subjects, sections, facultyMembers] = await Promise.all([
    prisma.room.findMany({ where: { id: { in: roomIds } } }),
    prisma.subject.findMany({ where: { id: { in: subjectIds } } }),
    prisma.section.findMany({ where: { id: { in: sectionIds } } }),
    prisma.faculty.findMany({
      where: { id: { in: facultyIds } },
      include: { user: true },
    }),
  ]);

  const roomMap = new Map(rooms.map((r) => [r.id, r]));
  const subjectMap = new Map(subjects.map((s) => [s.id, s]));
  const sectionMap = new Map(sections.map((sec) => [sec.id, sec]));
  const facultyMap = new Map(facultyMembers.map((f) => [f.id, f]));

  // 1. Internal conflict check within the proposed periods themselves
  for (let i = 0; i < periods.length; i++) {
    const p1 = periods[i];
    const room = roomMap.get(p1.roomId);
    const subject = subjectMap.get(p1.subjectId);
    const section = sectionMap.get(p1.sectionId);
    const faculty = facultyMap.get(p1.facultyId);

    // Rule: Capacity Check
    if (room && section && room.capacity < section.capacity) {
      conflicts.push({
        type: "CAPACITY_CONFLICT",
        severity: "WARNING",
        description: `Room ${room.roomNumber} (capacity ${room.capacity}) is too small for Section ${section.name} (capacity ${section.capacity}).`,
        dayOfWeek: p1.dayOfWeek,
        periodNumber: p1.periodNumber,
        timeSlot: `${p1.startTime} - ${p1.endTime}`,
        involvedEntity: `Room: ${room.roomNumber}`,
      });
    }

    // Rule: Lab requirement check
    if (subject && subject.type === "LAB" && room && room.roomType !== "LAB") {
      conflicts.push({
        type: "LAB_REQUIREMENT_CONFLICT",
        severity: "ERROR",
        description: `Practical/Lab subject "${subject.name}" (${subject.code}) cannot be conducted in theoretical room ${room.roomNumber}. Must be assigned to a Laboratory.`,
        dayOfWeek: p1.dayOfWeek,
        periodNumber: p1.periodNumber,
        timeSlot: `${p1.startTime} - ${p1.endTime}`,
        involvedEntity: `Subject: ${subject.name}`,
      });
    }

    // Compare with subsequent periods in the batch
    for (let j = i + 1; j < periods.length; j++) {
      const p2 = periods[j];

      // Same time slot?
      if (p1.dayOfWeek === p2.dayOfWeek && p1.periodNumber === p2.periodNumber) {
        // Teacher double booking in draft
        if (p1.facultyId === p2.facultyId) {
          const facName = faculty?.user.name || "Faculty";
          conflicts.push({
            type: "TEACHER_CONFLICT",
            severity: "ERROR",
            description: `Faculty ${facName} is scheduled concurrently for two classes on ${p1.dayOfWeek}, Period ${p1.periodNumber}.`,
            dayOfWeek: p1.dayOfWeek,
            periodNumber: p1.periodNumber,
            timeSlot: `${p1.startTime} - ${p1.endTime}`,
            involvedEntity: `Faculty: ${facName}`,
          });
        }

        // Room double booking in draft
        if (p1.roomId === p2.roomId) {
          conflicts.push({
            type: "ROOM_CONFLICT",
            severity: "ERROR",
            description: `Room ${room?.roomNumber || p1.roomId} is double booked on ${p1.dayOfWeek}, Period ${p1.periodNumber}.`,
            dayOfWeek: p1.dayOfWeek,
            periodNumber: p1.periodNumber,
            timeSlot: `${p1.startTime} - ${p1.endTime}`,
            involvedEntity: `Room: ${room?.roomNumber}`,
          });
        }

        // Section overlap in draft
        if (p1.sectionId === p2.sectionId) {
          conflicts.push({
            type: "SECTION_CONFLICT",
            severity: "ERROR",
            description: `Section ${section?.name || p1.sectionId} has two classes assigned at the same time on ${p1.dayOfWeek}, Period ${p1.periodNumber}.`,
            dayOfWeek: p1.dayOfWeek,
            periodNumber: p1.periodNumber,
            timeSlot: `${p1.startTime} - ${p1.endTime}`,
            involvedEntity: `Section: ${section?.name}`,
          });
        }
      }
    }
  }

  // 2. External conflict check against active published/approved timetables across the university
  const existingPeriods = await prisma.timetablePeriod.findMany({
    where: {
      timetable: {
        status: { in: ["APPROVED", "PUBLISHED"] },
        ...(ignoreTimetableId ? { id: { not: ignoreTimetableId } } : {}),
      },
    },
    include: {
      faculty: { include: { user: true } },
      room: true,
      section: true,
      subject: true,
    },
  });

  for (const proposed of periods) {
    for (const existing of existingPeriods) {
      if (
        proposed.dayOfWeek === existing.dayOfWeek &&
        proposed.periodNumber === existing.periodNumber
      ) {
        // Teacher conflict with published schedule
        if (proposed.facultyId === existing.facultyId) {
          conflicts.push({
            type: "TEACHER_CONFLICT",
            severity: "ERROR",
            description: `Teacher ${existing.faculty.user.name} is already assigned to Section ${existing.section.name} in Room ${existing.room.roomNumber} on ${existing.dayOfWeek}, Period ${existing.periodNumber}.`,
            dayOfWeek: proposed.dayOfWeek,
            periodNumber: proposed.periodNumber,
            timeSlot: `${proposed.startTime} - ${proposed.endTime}`,
            involvedEntity: `Faculty: ${existing.faculty.user.name}`,
          });
        }

        // Room conflict with published schedule
        if (proposed.roomId === existing.roomId) {
          conflicts.push({
            type: "ROOM_CONFLICT",
            severity: "ERROR",
            description: `Room ${existing.room.roomNumber} is already occupied by ${existing.subject.code} (${existing.section.name}) on ${existing.dayOfWeek}, Period ${existing.periodNumber}.`,
            dayOfWeek: proposed.dayOfWeek,
            periodNumber: proposed.periodNumber,
            timeSlot: `${proposed.startTime} - ${proposed.endTime}`,
            involvedEntity: `Room: ${existing.room.roomNumber}`,
          });
        }
      }
    }
  }

  return conflicts;
}
