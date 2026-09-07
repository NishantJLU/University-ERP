export type Role =
  | "STUDENT"
  | "TEACHER"
  | "HOD"
  | "ACCOUNTS"
  | "ADMIN"
  | "MANAGEMENT";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string | null;
  avatar?: string | null;
  departmentId?: string | null;
  studentId?: string | null;
  facultyId?: string | null;
}

export type TimetableStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "PUBLISHED";

export interface TimetableConflict {
  type: "TEACHER_CONFLICT" | "ROOM_CONFLICT" | "SECTION_CONFLICT" | "CAPACITY_CONFLICT" | "LAB_REQUIREMENT_CONFLICT";
  severity: "ERROR" | "WARNING";
  description: string;
  dayOfWeek: string;
  periodNumber: number;
  timeSlot: string;
  involvedEntity: string;
}

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESSFUL"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}
