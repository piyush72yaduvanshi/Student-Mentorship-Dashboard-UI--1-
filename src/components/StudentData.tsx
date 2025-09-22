import { studentStorage } from '../utils/localStorage';

// Centralized student data for reusability
export const generateStudentData = (studentId, studentInfo = null) => {
  // If specific student info is provided, use it; otherwise use default
  const baseStudentInfo = studentInfo || {
    id: 1,
    name: 'John Doe',
    rollNo: 'CS001',
    year: '1st',
    email: 'john.doe@email.com',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  };

  // Create different performance profiles based on student ID for diverse risk zones
  let baseAttendance, baseMarks, baseFeePayment, performanceProfile;

  // Determine risk profile based on student ID or provided data
  if (studentInfo && studentInfo.attendance && studentInfo.avgMarks) {
    baseAttendance = studentInfo.attendance;
    baseMarks = studentInfo.avgMarks;
    
    // Determine fee payment based on performance
    if (baseAttendance < 70 || baseMarks < 60) {
      baseFeePayment = 0.3; // 30% paid (poor)
    } else if (baseAttendance < 80 || baseMarks < 75) {
      baseFeePayment = 0.6; // 60% paid (moderate)
    } else {
      baseFeePayment = 0.85; // 85% paid (good)
    }
  } else {
    // Generate based on ID for consistent but varied data
    const variance = studentId % 10;
    baseAttendance = 85 + variance;
    baseMarks = 78 + variance;
    baseFeePayment = 0.7 + (variance * 0.03);
  }

  const attendanceData = [
    { name: 'Present', value: Math.max(0, baseAttendance), color: '#22c55e' },
    { name: 'Absent', value: Math.max(0, 100 - baseAttendance), color: '#ef4444' }
  ];

  // Generate performance trend based on current level
  const trendVariation = (baseMarks > 80) ? 5 : (baseMarks > 70) ? 8 : 12;
  const performanceData = [
    { month: 'Jan', marks: Math.max(0, baseMarks - 10 + Math.random() * trendVariation) },
    { month: 'Feb', marks: Math.max(0, baseMarks - 8 + Math.random() * trendVariation) },
    { month: 'Mar', marks: Math.max(0, baseMarks - 5 + Math.random() * trendVariation) },
    { month: 'Apr', marks: Math.max(0, baseMarks - 2 + Math.random() * trendVariation) },
    { month: 'May', marks: Math.max(0, baseMarks + Math.random() * trendVariation) },
    { month: 'Jun', marks: Math.max(0, baseMarks + Math.random() * trendVariation) }
  ].map(item => ({ ...item, marks: Math.round(Math.min(100, item.marks)) }));

  // Subject performance varies based on overall performance
  const subjectVariation = baseMarks > 80 ? 10 : baseMarks > 70 ? 15 : 20;
  const subjects = [
    { 
      name: 'Mathematics', 
      marks: Math.round(Math.min(100, Math.max(0, baseMarks + (Math.random() - 0.5) * subjectVariation))), 
      attendance: Math.round(Math.min(100, Math.max(0, baseAttendance + (Math.random() - 0.5) * 10))),
      grade: 'B+'
    },
    { 
      name: 'Physics', 
      marks: Math.round(Math.min(100, Math.max(0, baseMarks + (Math.random() - 0.5) * subjectVariation))), 
      attendance: Math.round(Math.min(100, Math.max(0, baseAttendance + (Math.random() - 0.5) * 10))),
      grade: 'B+'
    },
    { 
      name: 'Chemistry', 
      marks: Math.round(Math.min(100, Math.max(0, baseMarks + (Math.random() - 0.5) * subjectVariation))), 
      attendance: Math.round(Math.min(100, Math.max(0, baseAttendance + (Math.random() - 0.5) * 10))),
      grade: 'B'
    },
    { 
      name: 'Computer Science', 
      marks: Math.round(Math.min(100, Math.max(0, baseMarks + (Math.random() - 0.5) * subjectVariation))), 
      attendance: Math.round(Math.min(100, Math.max(0, baseAttendance + (Math.random() - 0.5) * 10))),
      grade: 'A'
    },
    { 
      name: 'English', 
      marks: Math.round(Math.min(100, Math.max(0, baseMarks + (Math.random() - 0.5) * subjectVariation))), 
      attendance: Math.round(Math.min(100, Math.max(0, baseAttendance + (Math.random() - 0.5) * 10))),
      grade: 'B+'
    }
  ];

  // Calculate grades based on marks
  subjects.forEach(subject => {
    if (subject.marks >= 90) subject.grade = 'A+';
    else if (subject.marks >= 85) subject.grade = 'A';
    else if (subject.marks >= 75) subject.grade = 'B+';
    else if (subject.marks >= 65) subject.grade = 'B';
    else if (subject.marks >= 55) subject.grade = 'C+';
    else if (subject.marks >= 45) subject.grade = 'C';
    else subject.grade = 'F';
  });

  const totalMarks = subjects.reduce((sum, subject) => sum + subject.marks, 0);
  const averageMarks = Math.round(totalMarks / subjects.length);
  const totalAttendance = subjects.reduce((sum, subject) => sum + subject.attendance, 0);
  const averageAttendance = Math.round(totalAttendance / subjects.length);

  const totalFees = 50000;
  const paidFees = Math.round(totalFees * baseFeePayment);
  const pendingFees = totalFees - paidFees;

  const feeDetails = {
    totalFees,
    paidFees,
    pendingFees,
    lastPayment: '2024-08-15',
    nextDueDate: '2024-12-15'
  };

  const surveys = [
    { id: 1, title: 'Academic Performance Survey', status: averageMarks > 75 ? 'Completed' : 'Pending', date: '2024-09-10' },
    { id: 2, title: 'Campus Facilities Feedback', status: baseAttendance > 80 ? 'Completed' : 'Pending', date: '2024-09-15' },
    { id: 3, title: 'Mentorship Program Evaluation', status: 'Completed', date: '2024-09-05' }
  ];

  return {
    studentInfo: baseStudentInfo,
    attendanceData,
    performanceData,
    subjects,
    averageMarks,
    averageAttendance,
    feeDetails,
    surveys,
    // Risk assessment data
    riskFactors: {
      marks: averageMarks,
      attendance: averageAttendance,
      feesPaid: feeDetails.paidFees,
      totalFees: feeDetails.totalFees
    }
  };
};

// Get students data from localStorage
export const getStudentsData = () => {
  return studentStorage.getAllStudents();
};

export const getStudentById = (id) => {
  return studentStorage.getStudentById(id);
};

export const getStudentsByMentor = (mentorName) => {
  return studentStorage.getStudentsByMentor(mentorName);
};

export const getStudentsByYear = (year) => {
  return studentStorage.getStudentsByYear(year);
};

// Legacy mock students data for backward compatibility
export const mockStudents = [
  // Green Zone Students (Good performance across all areas)
  { 
    id: 1, 
    name: 'John Doe', 
    rollNo: 'CS001', 
    year: '1st', 
    email: 'john.doe@email.com',
    attendance: 92,
    avgMarks: 85,
    status: 'Active',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    rollNo: 'CS002', 
    year: '1st', 
    email: 'jane.smith@email.com',
    attendance: 88,
    avgMarks: 90,
    status: 'Active',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  },
  { 
    id: 4, 
    name: 'Sarah Wilson', 
    rollNo: 'CS104', 
    year: '3rd', 
    email: 'sarah.w@email.com',
    attendance: 95,
    avgMarks: 88,
    status: 'Active',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  },
  { 
    id: 6, 
    name: 'Emily Chen', 
    rollNo: 'CS006', 
    year: '1st', 
    email: 'emily.chen@email.com',
    attendance: 94,
    avgMarks: 87,
    status: 'Active',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  },
  { 
    id: 8, 
    name: 'Lisa Wang', 
    rollNo: 'CS108', 
    year: '3rd', 
    email: 'lisa.w@email.com',
    attendance: 91,
    avgMarks: 89,
    status: 'Active',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  },

  // Yellow Zone Students (Moderate risk - need attention)
  { 
    id: 3, 
    name: 'Mike Johnson', 
    rollNo: 'CS053', 
    year: '2nd', 
    email: 'mike.j@email.com',
    attendance: 78,
    avgMarks: 76,
    status: 'Warning',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  },
  { 
    id: 5, 
    name: 'David Brown', 
    rollNo: 'CS155', 
    year: '4th', 
    email: 'david.b@email.com',
    attendance: 82,
    avgMarks: 79,
    status: 'Active',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  },
  { 
    id: 7, 
    name: 'Alex Rodriguez', 
    rollNo: 'CS057', 
    year: '2nd', 
    email: 'alex.r@email.com',
    attendance: 86,
    avgMarks: 74,
    status: 'Active',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  },
  { 
    id: 9, 
    name: 'Maria Garcia', 
    rollNo: 'CS059', 
    year: '2nd', 
    email: 'maria.g@email.com',
    attendance: 79,
    avgMarks: 81,
    status: 'Warning',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  },
  { 
    id: 10, 
    name: 'Kevin Kim', 
    rollNo: 'CS110', 
    year: '3rd', 
    email: 'kevin.k@email.com',
    attendance: 77,
    avgMarks: 73,
    status: 'Warning',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  },
  { 
    id: 11, 
    name: 'Rachel Green', 
    rollNo: 'CS011', 
    year: '1st', 
    email: 'rachel.g@email.com',
    attendance: 83,
    avgMarks: 72,
    status: 'Warning',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  },

  // Red Zone Students (High risk - immediate attention needed)
  { 
    id: 12, 
    name: 'Tyler Ross', 
    rollNo: 'CS112', 
    year: '3rd', 
    email: 'tyler.r@email.com',
    attendance: 65,
    avgMarks: 58,
    status: 'Critical',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  },
  { 
    id: 13, 
    name: 'Ashley Martinez', 
    rollNo: 'CS013', 
    year: '1st', 
    email: 'ashley.m@email.com',
    attendance: 58,
    avgMarks: 61,
    status: 'Critical',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  },
  { 
    id: 14, 
    name: 'Brandon Lee', 
    rollNo: 'CS064', 
    year: '2nd', 
    email: 'brandon.l@email.com',
    attendance: 70,
    avgMarks: 54,
    status: 'Critical',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  },
  { 
    id: 15, 
    name: 'Jessica Taylor', 
    rollNo: 'CS165', 
    year: '4th', 
    email: 'jessica.t@email.com',
    attendance: 62,
    avgMarks: 67,
    status: 'Critical',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  },
  { 
    id: 16, 
    name: 'Daniel White', 
    rollNo: 'CS116', 
    year: '3rd', 
    email: 'daniel.w@email.com',
    attendance: 59,
    avgMarks: 59,
    status: 'Critical',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  }
];