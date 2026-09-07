import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting University ERP + LMS Database Seeding...");

  // Clean existing data in reverse order of foreign keys
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.studentFeeDue.deleteMany();
  await prisma.feeStructure.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.learningMaterial.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.lMSCourse.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.attendanceSession.deleteMany();
  await prisma.timetablePeriod.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.facultyAssignment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.student.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.room.deleteMany();
  await prisma.section.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.program.deleteMany();
  await prisma.department.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash("password123", 10);

  // 1. Academic Year
  const ay = await prisma.academicYear.create({
    data: {
      name: "2026-2027",
      startDate: new Date("2026-07-01"),
      endDate: new Date("2027-06-30"),
      isCurrent: true,
    },
  });

  // 2. Faculties & Schools (Departments in ERP Schema)
  const deptCS = await prisma.department.create({
    data: {
      code: "CS",
      name: "Jagran School of Engineering",
      building: "Block A (Engineering Wing)",
      description: "Faculty of Science & Technology • Computing, AI, Systems & Robotics",
    },
  });

  const deptIT = await prisma.department.create({
    data: {
      code: "IT",
      name: "Jagran School of Computer Application",
      building: "Block B (Computing Center)",
      description: "Faculty of Science & Technology • Computer Applications, Cloud & Data Systems",
    },
  });

  const deptMGMT = await prisma.department.create({
    data: {
      code: "MGMT",
      name: "Jagran Lakecity Business School",
      building: "Management Block",
      description: "Faculty of Management • Business Administration, Finance, Marketing & Leadership",
    },
  });

  const deptCOMM = await prisma.department.create({
    data: {
      code: "COMM",
      name: "Jagran School of Journalism, Advertising & PR",
      building: "Media & Communication Wing",
      description: "Faculty of Media & Social Science • Media, Mass Comm, Advertising & PR",
    },
  });

  const deptENGG = await prisma.department.create({
    data: {
      code: "ENGG",
      name: "School of Law",
      building: "Law Block",
      description: "Faculty of Law • Constitutional, Corporate & International Jurisprudence",
    },
  });

  // 3. Degree Programs
  const progBTech = await prisma.program.create({
    data: {
      code: "BTECH_CSE",
      name: "B.Tech in Computer Science & Engineering",
      degreeType: "UNDERGRADUATE",
      durationYears: 4,
      departmentId: deptCS.id,
    },
  });

  const progBCA = await prisma.program.create({
    data: {
      code: "BCA",
      name: "Bachelor of Computer Applications",
      degreeType: "UNDERGRADUATE",
      durationYears: 3,
      departmentId: deptIT.id,
    },
  });

  const progMBA = await prisma.program.create({
    data: {
      code: "MBA",
      name: "Master of Business Administration",
      degreeType: "POSTGRADUATE",
      durationYears: 2,
      departmentId: deptMGMT.id,
    },
  });

  const progBBA = await prisma.program.create({
    data: {
      code: "BBA",
      name: "Bachelor of Business Administration",
      degreeType: "UNDERGRADUATE",
      durationYears: 3,
      departmentId: deptMGMT.id,
    },
  });

  // 4. Semesters & Sections
  // BTech CSE Sem 3
  const semBTech3 = await prisma.semester.create({
    data: {
      number: 3,
      academicYearId: ay.id,
      programId: progBTech.id,
      isActive: true,
    },
  });

  const secBTech3A = await prisma.section.create({
    data: { name: "BTech-3A", capacity: 40, semesterId: semBTech3.id },
  });
  const secBTech3B = await prisma.section.create({
    data: { name: "BTech-3B", capacity: 40, semesterId: semBTech3.id },
  });

  // BCA Sem 3
  const semBCA3 = await prisma.semester.create({
    data: {
      number: 3,
      academicYearId: ay.id,
      programId: progBCA.id,
      isActive: true,
    },
  });

  const secBCA3A = await prisma.section.create({
    data: { name: "BCA-3A", capacity: 35, semesterId: semBCA3.id },
  });

  // MBA Sem 1
  const semMBA1 = await prisma.semester.create({
    data: {
      number: 1,
      academicYearId: ay.id,
      programId: progMBA.id,
      isActive: true,
    },
  });
  const secMBA1A = await prisma.section.create({
    data: { name: "MBA-1A", capacity: 30, semesterId: semMBA1.id },
  });

  // 5. Rooms
  const room101 = await prisma.room.create({
    data: { roomNumber: "LH-101", building: "Turing Block", floor: 1, capacity: 60, roomType: "CLASSROOM" },
  });
  const room102 = await prisma.room.create({
    data: { roomNumber: "LH-102", building: "Turing Block", floor: 1, capacity: 50, roomType: "CLASSROOM" },
  });
  const lab1 = await prisma.room.create({
    data: { roomNumber: "LAB-101", building: "Turing Block", floor: 2, capacity: 45, roomType: "LAB" },
  });
  const lab2 = await prisma.room.create({
    data: { roomNumber: "LAB-202", building: "Lovelace Hall", floor: 2, capacity: 40, roomType: "LAB" },
  });
  const hallA = await prisma.room.create({
    data: { roomNumber: "AUD-1", building: "Main Admin", floor: 1, capacity: 200, roomType: "SEMINAR_HALL" },
  });

  // 6. Subjects
  const subDBMS = await prisma.subject.create({
    data: {
      code: "CS301",
      name: "Database Management Systems",
      credits: 4,
      type: "THEORY",
      semesterId: semBTech3.id,
      departmentId: deptCS.id,
    },
  });

  const subDBMSLab = await prisma.subject.create({
    data: {
      code: "CS301L",
      name: "Database Systems Laboratory",
      credits: 2,
      type: "LAB",
      semesterId: semBTech3.id,
      departmentId: deptCS.id,
    },
  });

  const subDS = await prisma.subject.create({
    data: {
      code: "CS302",
      name: "Data Structures & Algorithms",
      credits: 4,
      type: "THEORY",
      semesterId: semBTech3.id,
      departmentId: deptCS.id,
    },
  });

  const subOS = await prisma.subject.create({
    data: {
      code: "CS303",
      name: "Operating Systems Architecture",
      credits: 4,
      type: "THEORY",
      semesterId: semBTech3.id,
      departmentId: deptCS.id,
    },
  });

  const subWebTech = await prisma.subject.create({
    data: {
      code: "IT301",
      name: "Web Application Technologies",
      credits: 3,
      type: "LAB",
      semesterId: semBCA3.id,
      departmentId: deptIT.id,
    },
  });

  const subFinMgmt = await prisma.subject.create({
    data: {
      code: "MGMT101",
      name: "Financial Accounting & Analytics",
      credits: 4,
      type: "THEORY",
      semesterId: semMBA1.id,
      departmentId: deptMGMT.id,
    },
  });

  // 7. Core Users: Admin, Accounts, Management
  const userAdmin = await prisma.user.create({
    data: {
      email: "admin@demo.edu",
      passwordHash: defaultPassword,
      name: "Dr. Alistair Vance (Registrar)",
      role: "ADMIN",
      phone: "+91 98765 43210",
    },
  });

  const userAccounts = await prisma.user.create({
    data: {
      email: "accounts@demo.edu",
      passwordHash: defaultPassword,
      name: "Suresh Patel (Bursar / Accounts)",
      role: "ACCOUNTS",
      phone: "+91 98765 43211",
    },
  });

  const userManagement = await prisma.user.create({
    data: {
      email: "management@demo.edu",
      passwordHash: defaultPassword,
      name: "Dr. Arvind Mehta (Executive Chancellor)",
      role: "MANAGEMENT",
      phone: "+91 98765 43212",
    },
  });

  // 8. HODs & Faculty
  // CS HOD
  const userHOD_CS = await prisma.user.create({
    data: {
      email: "hod@demo.edu",
      passwordHash: defaultPassword,
      name: "Dr. Rajesh Sharma",
      role: "HOD",
      phone: "+91 98765 43213",
    },
  });
  const facHOD_CS = await prisma.faculty.create({
    data: {
      userId: userHOD_CS.id,
      departmentId: deptCS.id,
      employeeCode: "FAC-CS-001",
      designation: "Professor & HOD",
      qualification: "Ph.D in Distributed Systems, IIT Kanpur",
      specialization: "Cloud Computing, Parallel Databases",
    },
  });
  await prisma.department.update({
    where: { id: deptCS.id },
    data: { hodFacultyId: facHOD_CS.id },
  });

  // Management HOD
  const userHOD_MGMT = await prisma.user.create({
    data: {
      email: "hod.mgmt@demo.edu",
      passwordHash: defaultPassword,
      name: "Dr. Priya Nair",
      role: "HOD",
      phone: "+91 98765 43214",
    },
  });
  const facHOD_MGMT = await prisma.faculty.create({
    data: {
      userId: userHOD_MGMT.id,
      departmentId: deptMGMT.id,
      employeeCode: "FAC-MGMT-001",
      designation: "Professor & HOD",
      qualification: "Ph.D in Corporate Finance, IIM Ahmedabad",
      specialization: "Financial Markets, Strategic Valuations",
    },
  });
  await prisma.department.update({
    where: { id: deptMGMT.id },
    data: { hodFacultyId: facHOD_MGMT.id },
  });

  // 10 Faculty Members
  const facultyData = [
    { email: "teacher@demo.edu", name: "Dr. Vikram Rao", deptId: deptCS.id, desig: "Associate Professor", code: "FAC-CS-002", spec: "Database Systems, Big Data" },
    { email: "ananya.sen@demo.edu", name: "Prof. Ananya Sen", deptId: deptCS.id, desig: "Assistant Professor", code: "FAC-CS-003", spec: "Data Structures, Algorithms" },
    { email: "karthik.ram@demo.edu", name: "Dr. Karthik Raman", deptId: deptCS.id, desig: "Associate Professor", code: "FAC-CS-004", spec: "Operating Systems, Linux Kernel" },
    { email: "sneha.joshi@demo.edu", name: "Prof. Sneha Joshi", deptId: deptIT.id, desig: "Assistant Professor", code: "FAC-IT-001", spec: "Fullstack Web & Cloud Native" },
    { email: "rahul.verma@demo.edu", name: "Dr. Rahul Verma", deptId: deptIT.id, desig: "Associate Professor", code: "FAC-IT-002", spec: "Network Security & Cryptography" },
    { email: "meera.kapoor@demo.edu", name: "Prof. Meera Kapoor", deptId: deptMGMT.id, desig: "Assistant Professor", code: "FAC-MGMT-002", spec: "Financial Analytics & Risk" },
    { email: "amitabh.bose@demo.edu", name: "Dr. Amitabh Bose", deptId: deptMGMT.id, desig: "Professor", code: "FAC-MGMT-003", spec: "Strategic Marketing & Operations" },
    { email: "sunita.menon@demo.edu", name: "Prof. Sunita Menon", deptId: deptCOMM.id, desig: "Assistant Professor", code: "FAC-COMM-001", spec: "Corporate Taxation & Auditing" },
    { email: "deepak.gupta@demo.edu", name: "Dr. Deepak Gupta", deptId: deptENGG.id, desig: "Associate Professor", code: "FAC-ENGG-001", spec: "Robotics & Microcontrollers" },
    { email: "tanvi.deshmukh@demo.edu", name: "Prof. Tanvi Deshmukh", deptId: deptENGG.id, desig: "Assistant Professor", code: "FAC-ENGG-002", spec: "Signal Processing & IoT" },
  ];

  const createdFaculty: Record<string, string> = {};
  for (const f of facultyData) {
    const user = await prisma.user.create({
      data: {
        email: f.email,
        passwordHash: defaultPassword,
        name: f.name,
        role: "TEACHER",
        phone: "+91 98765 000" + Math.floor(10 + Math.random() * 89),
      },
    });
    const fac = await prisma.faculty.create({
      data: {
        userId: user.id,
        departmentId: f.deptId,
        employeeCode: f.code,
        designation: f.desig,
        qualification: "Ph.D / M.Tech",
        specialization: f.spec,
      },
    });
    createdFaculty[f.email] = fac.id;
  }

  // Lead Teacher for demo
  const mainTeacherFacultyId = createdFaculty["teacher@demo.edu"];
  const dsTeacherFacultyId = createdFaculty["ananya.sen@demo.edu"];
  const osTeacherFacultyId = createdFaculty["karthik.ram@demo.edu"];

  // 9. Faculty Allocations
  await prisma.facultyAssignment.create({
    data: {
      facultyId: mainTeacherFacultyId,
      subjectId: subDBMS.id,
      sectionId: secBTech3A.id,
      academicYearId: ay.id,
      isLead: true,
    },
  });

  await prisma.facultyAssignment.create({
    data: {
      facultyId: mainTeacherFacultyId,
      subjectId: subDBMSLab.id,
      sectionId: secBTech3A.id,
      academicYearId: ay.id,
      isLead: true,
    },
  });

  await prisma.facultyAssignment.create({
    data: {
      facultyId: dsTeacherFacultyId,
      subjectId: subDS.id,
      sectionId: secBTech3A.id,
      academicYearId: ay.id,
      isLead: true,
    },
  });

  await prisma.facultyAssignment.create({
    data: {
      facultyId: osTeacherFacultyId,
      subjectId: subOS.id,
      sectionId: secBTech3A.id,
      academicYearId: ay.id,
      isLead: true,
    },
  });

  // 10. Students: 50+ realistic students
  const studentNames = [
    { name: "Aarav Sharma", email: "student@demo.edu", roll: "26CS0101", reg: "REG2026-00101", sec: secBTech3A.id, prog: progBTech.id, sem: semBTech3.id },
    { name: "Ananya Iyer", email: "ananya.i@demo.edu", roll: "26CS0102", reg: "REG2026-00102", sec: secBTech3A.id, prog: progBTech.id, sem: semBTech3.id },
    { name: "Rohan Kulkarni", email: "rohan.k@demo.edu", roll: "26CS0103", reg: "REG2026-00103", sec: secBTech3A.id, prog: progBTech.id, sem: semBTech3.id },
    { name: "Ishita Roy", email: "ishita.r@demo.edu", roll: "26CS0104", reg: "REG2026-00104", sec: secBTech3A.id, prog: progBTech.id, sem: semBTech3.id },
    { name: "Aditya Verma", email: "aditya.v@demo.edu", roll: "26CS0105", reg: "REG2026-00105", sec: secBTech3A.id, prog: progBTech.id, sem: semBTech3.id },
    { name: "Diya Nambiar", email: "diya.n@demo.edu", roll: "26CS0106", reg: "REG2026-00106", sec: secBTech3A.id, prog: progBTech.id, sem: semBTech3.id },
    { name: "Siddharth Jain", email: "siddharth.j@demo.edu", roll: "26CS0107", reg: "REG2026-00107", sec: secBTech3A.id, prog: progBTech.id, sem: semBTech3.id },
    { name: "Pooja Hegde", email: "pooja.h@demo.edu", roll: "26CS0108", reg: "REG2026-00108", sec: secBTech3A.id, prog: progBTech.id, sem: semBTech3.id },
    { name: "Kavya Pillai", email: "kavya.p@demo.edu", roll: "26CS0109", reg: "REG2026-00109", sec: secBTech3A.id, prog: progBTech.id, sem: semBTech3.id },
    { name: "Manish Reddy", email: "manish.r@demo.edu", roll: "26CS0110", reg: "REG2026-00110", sec: secBTech3A.id, prog: progBTech.id, sem: semBTech3.id },
  ];

  // Generate 45 additional realistic student profiles to reach 55 total students
  const firstNames = ["Dhruv", "Mira", "Varun", "Simran", "Arjun", "Rhea", "Nikhil", "Sneha", "Gaurav", "Tanvi", "Akash", "Bhavna", "Chirag", "Kritika", "Farhan", "Zoya", "Hardik", "Divya", "Jayesh", "Shalini"];
  const lastNames = ["Kapoor", "Chopra", "Das", "Bhatia", "Singhania", "Trivedi", "Banerjee", "Mehra", "Saxena", "Gill", "Pawar", "Ghosh", "Malhotra", "Pandey", "Chatterjee", "Mishra", "Naidu", "Dutta", "Bhatt", "Menon"];

  let count = 11;
  for (let i = 0; i < 45; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const isBCA = i % 3 === 0;
    const isMBA = i % 5 === 0;

    const progId = isMBA ? progMBA.id : isBCA ? progBCA.id : progBTech.id;
    const semId = isMBA ? semMBA1.id : isBCA ? semBCA3.id : semBTech3.id;
    const secId = isMBA ? secMBA1A.id : isBCA ? secBCA3A.id : i % 2 === 0 ? secBTech3A.id : secBTech3B.id;
    const codePrefix = isMBA ? "26MB" : isBCA ? "26BC" : "26CS";

    studentNames.push({
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@demo.edu`,
      roll: `${codePrefix}01${count.toString().padStart(2, "0")}`,
      reg: `REG2026-${(1000 + count).toString()}`,
      sec: secId,
      prog: progId,
      sem: semId,
    });
    count++;
  }

  const createdStudents = [];
  for (const s of studentNames) {
    const user = await prisma.user.create({
      data: {
        email: s.email,
        passwordHash: defaultPassword,
        name: s.name,
        role: "STUDENT",
        phone: "+91 98" + Math.floor(10000000 + Math.random() * 89999999),
      },
    });

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        rollNumber: s.roll,
        registrationNo: s.reg,
        programId: s.prog,
        currentSemesterId: s.sem,
        sectionId: s.sec,
        admissionDate: new Date("2025-08-01"),
        gender: count % 2 === 0 ? "Male" : "Female",
        guardianName: `Mr. ${s.name.split(" ")[1]}`,
        guardianPhone: "+91 99112 33445",
      },
    });
    createdStudents.push(student);

    // Enroll students in semester subjects
    if (s.sem === semBTech3.id) {
      await prisma.enrollment.createMany({
        data: [
          { studentId: student.id, subjectId: subDBMS.id, semesterId: semBTech3.id, academicYearId: ay.id },
          { studentId: student.id, subjectId: subDBMSLab.id, semesterId: semBTech3.id, academicYearId: ay.id },
          { studentId: student.id, subjectId: subDS.id, semesterId: semBTech3.id, academicYearId: ay.id },
          { studentId: student.id, subjectId: subOS.id, semesterId: semBTech3.id, academicYearId: ay.id },
        ],
      });
    }
  }

  const primaryStudent = createdStudents[0]; // Aarav Sharma (student@demo.edu)

  // 11. Timetable Engine: Published Master Timetable for B.Tech-3A
  const ttBTech3A = await prisma.timetable.create({
    data: {
      academicYearId: ay.id,
      semesterId: semBTech3.id,
      sectionId: secBTech3A.id,
      title: "B.Tech CSE - 3rd Sem (Sec A) Master Schedule",
      status: "PUBLISHED",
      hasConflicts: false,
      approvedByUserId: userHOD_CS.id,
      approvedAt: new Date("2026-07-15T10:00:00Z"),
      publishedAt: new Date("2026-07-15T11:00:00Z"),
    },
  });

  // Weekly periods for BTech-3A:
  // Mon 09:00 DBMS (Dr. Vikram Rao, LH-101)
  // Mon 10:00 Data Structures (Prof. Ananya Sen, LH-101)
  // Mon 11:15 Operating Systems (Dr. Karthik Raman, LH-102)
  // Tue 09:00 Database Lab (Dr. Vikram Rao, LAB-101)
  // Wed 10:00 DBMS (Dr. Vikram Rao, LH-101)
  // Thu 09:00 Data Structures (Prof. Ananya Sen, LH-101)
  // Fri 11:15 Operating Systems (Dr. Karthik Raman, LH-102)
  const p1 = await prisma.timetablePeriod.create({
    data: {
      timetableId: ttBTech3A.id,
      subjectId: subDBMS.id,
      facultyId: mainTeacherFacultyId,
      roomId: room101.id,
      sectionId: secBTech3A.id,
      dayOfWeek: "MONDAY",
      periodNumber: 1,
      startTime: "09:00",
      endTime: "10:00",
    },
  });

  const p2 = await prisma.timetablePeriod.create({
    data: {
      timetableId: ttBTech3A.id,
      subjectId: subDS.id,
      facultyId: dsTeacherFacultyId,
      roomId: room101.id,
      sectionId: secBTech3A.id,
      dayOfWeek: "MONDAY",
      periodNumber: 2,
      startTime: "10:00",
      endTime: "11:00",
    },
  });

  const p3 = await prisma.timetablePeriod.create({
    data: {
      timetableId: ttBTech3A.id,
      subjectId: subOS.id,
      facultyId: osTeacherFacultyId,
      roomId: room102.id,
      sectionId: secBTech3A.id,
      dayOfWeek: "MONDAY",
      periodNumber: 3,
      startTime: "11:15",
      endTime: "12:15",
    },
  });

  await prisma.timetablePeriod.create({
    data: {
      timetableId: ttBTech3A.id,
      subjectId: subDBMSLab.id,
      facultyId: mainTeacherFacultyId,
      roomId: lab1.id,
      sectionId: secBTech3A.id,
      dayOfWeek: "TUESDAY",
      periodNumber: 1,
      startTime: "09:00",
      endTime: "11:00",
    },
  });

  await prisma.timetablePeriod.create({
    data: {
      timetableId: ttBTech3A.id,
      subjectId: subDBMS.id,
      facultyId: mainTeacherFacultyId,
      roomId: room101.id,
      sectionId: secBTech3A.id,
      dayOfWeek: "WEDNESDAY",
      periodNumber: 2,
      startTime: "10:00",
      endTime: "11:00",
    },
  });

  // Draft Timetable for BCA-3A to demonstrate Approval & Conflict resolution workflow
  await prisma.timetable.create({
    data: {
      academicYearId: ay.id,
      semesterId: semBCA3.id,
      sectionId: secBCA3A.id,
      title: "BCA 3rd Sem (Sec A) - Fall Timetable [Draft]",
      status: "SUBMITTED",
      hasConflicts: false,
      conflictNotes: "Ready for HOD Dr. Priya / Academic Committee signoff.",
    },
  });

  // 12. Attendance Records
  // Session for Monday DBMS class
  const attSession1 = await prisma.attendanceSession.create({
    data: {
      timetablePeriodId: p1.id,
      subjectId: subDBMS.id,
      sectionId: secBTech3A.id,
      facultyId: mainTeacherFacultyId,
      date: new Date("2026-09-01"),
      periodNumber: 1,
      status: "FINALIZED",
    },
  });

  // Mark all enrolled students in Sec A
  const secAStudents = createdStudents.filter((s) => s.sectionId === secBTech3A.id);
  for (let idx = 0; idx < secAStudents.length; idx++) {
    const st = secAStudents[idx];
    const status = idx === 3 ? "ABSENT" : idx === 7 ? "LATE" : "PRESENT";
    await prisma.attendanceRecord.create({
      data: {
        attendanceSessionId: attSession1.id,
        studentId: st.id,
        status,
        remarks: status === "ABSENT" ? "Medical leave requested" : null,
      },
    });
  }

  // Session for Data Structures
  const attSession2 = await prisma.attendanceSession.create({
    data: {
      timetablePeriodId: p2.id,
      subjectId: subDS.id,
      sectionId: secBTech3A.id,
      facultyId: dsTeacherFacultyId,
      date: new Date("2026-09-01"),
      periodNumber: 2,
      status: "FINALIZED",
    },
  });

  for (let idx = 0; idx < secAStudents.length; idx++) {
    const st = secAStudents[idx];
    await prisma.attendanceRecord.create({
      data: {
        attendanceSessionId: attSession2.id,
        studentId: st.id,
        status: idx === 5 ? "ABSENT" : "PRESENT",
      },
    });
  }

  // 13. Fees & Sandbox Payments
  const feeBTech = await prisma.feeStructure.create({
    data: {
      programId: progBTech.id,
      semesterId: semBTech3.id,
      academicYearId: ay.id,
      title: "B.Tech CSE Semester 3 Composite Fee",
      tuitionFee: 50000,
      labFee: 15000,
      libraryFee: 5000,
      examFee: 3000,
      otherFee: 2000,
      totalAmount: 75000,
      dueDate: new Date("2026-09-30"),
    },
  });

  // Assign fees to students
  for (const st of secAStudents) {
    const isPrimary = st.id === primaryStudent.id;
    // Aarav has paid 25,000; 50,000 pending
    const paidAmount = isPrimary ? 25000 : 75000;
    const status = isPrimary ? "PARTIALLY_PAID" : "PAID";

    const due = await prisma.studentFeeDue.create({
      data: {
        studentId: st.id,
        feeStructureId: feeBTech.id,
        totalAmount: 75000,
        paidAmount,
        status,
        dueDate: new Date("2026-09-30"),
      },
    });

    if (isPrimary) {
      // Create transaction and receipt for Aarav's past installment
      const txn = await prisma.paymentTransaction.create({
        data: {
          transactionId: "TXN-UNIV-20260810-0912",
          referenceNo: "SBX_REF_88192301",
          studentId: st.id,
          studentFeeDueId: due.id,
          amount: 25000,
          paymentMethod: "SANDBOX_GATEWAY",
          status: "SUCCESSFUL",
          gatewayToken: "tok_sandbox_verified_sig_88192301",
          metadata: JSON.stringify({ mode: "UPI", bank: "State Bank of India", authCode: "APX-81273" }),
          createdAt: new Date("2026-08-10T14:30:00Z"),
        },
      });

      await prisma.receipt.create({
        data: {
          receiptNumber: "REC-2026-004812",
          paymentTransactionId: txn.id,
          studentId: st.id,
          amountPaid: 25000,
          receiptHash: "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
        },
      });
    }
  }

  // 14. Integrated LMS: Subject to Course mapping
  const lmsDBMS = await prisma.lMSCourse.create({
    data: {
      subjectId: subDBMS.id,
      facultyId: mainTeacherFacultyId,
      title: "CS301: Relational Database Management Systems",
      description: "Comprehensive study of relational algebra, schema design, SQL optimization, indexing, ACID transactions, and query execution engines.",
      isActive: true,
    },
  });

  const mod1 = await prisma.courseModule.create({
    data: {
      courseId: lmsDBMS.id,
      title: "Module 1: Relational Data Models & Schema Design",
      orderIndex: 1,
      description: "Entity-Relationship Diagrams, Enhanced ER, Relational Mapping and Functional Dependencies.",
    },
  });

  const mod2 = await prisma.courseModule.create({
    data: {
      courseId: lmsDBMS.id,
      title: "Module 2: Structured Query Language (SQL) & Indexing",
      orderIndex: 2,
      description: "Complex Joins, Subqueries, Window Functions, B+ Trees, and Query Optimization.",
    },
  });

  await prisma.lesson.create({
    data: {
      moduleId: mod1.id,
      title: "1.1 Introduction to Database Architecture & 3-Tier Schema",
      orderIndex: 1,
      content: "Databases manage structured enterprise data efficiently. In this lesson, we explore the ANSI-SPARC 3-level architecture: External, Conceptual, and Internal schema layers.",
      videoUrl: "https://www.youtube.com/watch?v=ZT_T7T0H5oA",
      durationMin: 45,
    },
  });

  await prisma.lesson.create({
    data: {
      moduleId: mod1.id,
      title: "1.2 Normalization: 1NF to BCNF with Lossless Decompositions",
      orderIndex: 2,
      content: "Normalization minimizes redundancy and eliminates insertion, update, and deletion anomalies. Learn how candidate keys enforce BCNF compliance.",
      videoUrl: "https://www.youtube.com/watch?v=UrYLYV7WSHM",
      durationMin: 50,
    },
  });

  await prisma.learningMaterial.create({
    data: {
      courseId: lmsDBMS.id,
      title: "DBMS Lecture Notes - Unit 1 & 2 Comprehensive Guide.pdf",
      fileUrl: "/materials/dbms_unit1_2.pdf",
      fileType: "PDF",
      fileSize: "4.8 MB",
      uploadedById: userHOD_CS.id,
    },
  });

  // Assignment
  const assign1 = await prisma.assignment.create({
    data: {
      subjectId: subDBMS.id,
      sectionId: secBTech3A.id,
      facultyId: mainTeacherFacultyId,
      title: "Assignment 1: Relational Schema & BCNF Normalization",
      description: "Design an optimized 3NF/BCNF relational database schema for a multi-vendor logistics system. Identify functional dependencies and specify SQL DDL statements.",
      maxMarks: 100,
      dueDate: new Date("2026-09-25T23:59:59Z"),
    },
  });

  // Aarav has submitted the assignment
  await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assign1.id,
      studentId: primaryStudent.id,
      content: "Submitted comprehensive SQL DDL schema with 12 normalized tables and foreign key constraints.",
      status: "REVIEWED",
      marksObtained: 94,
      feedback: "Exceptional functional dependency analysis. Clean surrogate keys and index design.",
      gradedAt: new Date("2026-09-03T16:00:00Z"),
    },
  });

  // Quiz
  const quiz1 = await prisma.quiz.create({
    data: {
      subjectId: subDBMS.id,
      facultyId: mainTeacherFacultyId,
      title: "Quiz 1: SQL & Relational Algebra Knowledge Check",
      instructions: "Objective quiz containing 4 questions. Each correct answer carries 5 marks. Time limit: 20 minutes.",
      totalMarks: 20,
      durationMinutes: 20,
      startDate: new Date("2026-09-01"),
      endDate: new Date("2026-09-30"),
      attemptsAllowed: 1,
      isPublished: true,
    },
  });

  const q1 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz1.id,
      questionText: "Which normal form strictly eliminates transitive functional dependencies on non-prime attributes?",
      questionType: "MCQ",
      optionsJson: JSON.stringify(["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Fourth Normal Form (4NF)"]),
      correctOption: 2,
      marks: 5,
      orderIndex: 1,
    },
  });

  const q2 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz1.id,
      questionText: "In a B+ Tree index, all data records or leaf pointers reside solely at the leaf level.",
      questionType: "TRUE_FALSE",
      optionsJson: JSON.stringify(["True", "False"]),
      correctOption: 0,
      marks: 5,
      orderIndex: 2,
    },
  });

  await prisma.quizQuestion.create({
    data: {
      quizId: quiz1.id,
      questionText: "What does the 'I' in ACID properties of transaction management stand for?",
      questionType: "MCQ",
      optionsJson: JSON.stringify(["Integrity", "Isolation", "Indexation", "Idempotence"]),
      correctOption: 1,
      marks: 5,
      orderIndex: 3,
    },
  });

  await prisma.quizQuestion.create({
    data: {
      quizId: quiz1.id,
      questionText: "Which SQL clause is executed prior to the SELECT projection list?",
      questionType: "MCQ",
      optionsJson: JSON.stringify(["ORDER BY", "HAVING", "LIMIT", "None of the above"]),
      correctOption: 1,
      marks: 5,
      orderIndex: 4,
    },
  });

  // Aarav completed the quiz
  await prisma.quizAttempt.create({
    data: {
      quizId: quiz1.id,
      studentId: primaryStudent.id,
      answersJson: JSON.stringify({ [q1.id]: 2, [q2.id]: 0 }),
      score: 20,
      maxScore: 20,
      startedAt: new Date("2026-09-02T10:00:00Z"),
      completedAt: new Date("2026-09-02T10:14:22Z"),
    },
  });

  // 15. Notices & Targeted Communications
  await prisma.notice.create({
    data: {
      title: "Commencement of Autumn Semester 2026 Examinations",
      content: "All undergraduate and postgraduate end-semester practical examinations will commence on October 18, 2026. Detailed room and seat allocation schedules will be published in the student portal.",
      targetScope: "ALL",
      priority: "HIGH",
      authorId: userAdmin.id,
      publishedAt: new Date("2026-09-04T09:00:00Z"),
    },
  });

  await prisma.notice.create({
    data: {
      title: "Computer Science Dept: Industry Guest Lecture on Cloud Infrastructure",
      content: "The Department of Computer Science is hosting a specialized seminar on Distributed Microservices and Kubernetes orchestration this Friday in Turing Auditorium at 2:00 PM.",
      targetScope: "DEPARTMENT",
      targetId: deptCS.id,
      priority: "NORMAL",
      authorId: userHOD_CS.id,
      publishedAt: new Date("2026-09-05T11:30:00Z"),
    },
  });

  await prisma.notice.create({
    data: {
      title: "Accounts Notice: Final Date for Semester 3 Tuition Fee Remittance",
      content: "Students are advised to clear outstanding semester dues by September 30, 2026 via the university ERP sandbox payment portal to avoid late registration surcharges.",
      targetScope: "ROLE",
      targetId: "STUDENT",
      priority: "HIGH",
      authorId: userAccounts.id,
      publishedAt: new Date("2026-09-05T14:00:00Z"),
    },
  });

  // 16. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: userAdmin.id,
        actorName: "Dr. Alistair Vance",
        actorRole: "ADMIN",
        action: "ACADEMIC_YEAR_CONFIGURED",
        entity: "AcademicYear",
        entityId: ay.id,
        details: JSON.stringify({ academicYear: "2026-2027", status: "ACTIVE" }),
      },
      {
        actorId: userHOD_CS.id,
        actorName: "Dr. Rajesh Sharma",
        actorRole: "HOD",
        action: "TIMETABLE_APPROVED",
        entity: "Timetable",
        entityId: ttBTech3A.id,
        details: JSON.stringify({ section: "BTech-3A", totalPeriods: 5, conflicts: 0 }),
      },
      {
        actorId: userAdmin.id,
        actorName: "Dr. Alistair Vance",
        actorRole: "ADMIN",
        action: "TIMETABLE_PUBLISHED",
        entity: "Timetable",
        entityId: ttBTech3A.id,
        details: JSON.stringify({ status: "PUBLISHED", scope: "CAMPUS_WIDE" }),
      },
      {
        actorId: userAccounts.id,
        actorName: "Suresh Patel",
        actorRole: "ACCOUNTS",
        action: "PAYMENT_RECONCILED",
        entity: "PaymentTransaction",
        entityId: "TXN-UNIV-20260810-0912",
        details: JSON.stringify({ student: "Aarav Sharma", amount: 25000, verified: true }),
      },
      {
        actorId: userHOD_CS.id,
        actorName: "Dr. Vikram Rao",
        actorRole: "TEACHER",
        action: "ATTENDANCE_RECORDED",
        entity: "AttendanceSession",
        entityId: attSession1.id,
        details: JSON.stringify({ subject: "CS301", date: "2026-09-01", presentCount: secAStudents.length - 1 }),
      },
    ],
  });

  console.log("✅ University ERP + LMS Database Seeding Completed Successfully!");
  console.log(`   - 1 Admin: admin@demo.edu`);
  console.log(`   - 2 HODs: hod@demo.edu (CS), hod.mgmt@demo.edu (Management)`);
  console.log(`   - 10 Faculty: teacher@demo.edu and colleagues`);
  console.log(`   - 1 Accounts: accounts@demo.edu`);
  console.log(`   - 1 Management: management@demo.edu`);
  console.log(`   - ${createdStudents.length} Students seeded! Primary: student@demo.edu`);
  console.log(`   - Password for all accounts: password123`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
