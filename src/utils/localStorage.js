// Comprehensive localStorage management utility for Student Mentorship System

const STORAGE_KEYS = {
  AUTH: 'sms_auth',
  USERS: 'sms_users',
  STUDENTS: 'sms_students',
  SURVEYS: 'sms_surveys',
  SURVEY_RESPONSES: 'sms_survey_responses',
  SETTINGS: 'sms_settings',
  VERSION: 'sms_version'
};

const CURRENT_VERSION = '1.0.0';

// Error handling utility
const handleStorageError = (operation, key, error) => {
  console.error(`LocalStorage ${operation} failed for key ${key}:`, error);
  return null;
};

// Basic localStorage operations with error handling
export const storageUtils = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      handleStorageError('set', key, error);
      return false;
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      handleStorageError('get', key, error);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      handleStorageError('remove', key, error);
      return false;
    }
  },

  clear: () => {
    try {
      // Only clear app-specific keys
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }
};

// Authentication management
export const authStorage = {
  setCurrentUser: (user) => {
    return storageUtils.set(STORAGE_KEYS.AUTH, {
      ...user,
      loginTime: new Date().toISOString(),
      isLoggedIn: true
    });
  },

  getCurrentUser: () => {
    const auth = storageUtils.get(STORAGE_KEYS.AUTH);
    if (auth && auth.isLoggedIn) {
      return auth;
    }
    return null;
  },

  logout: () => {
    return storageUtils.remove(STORAGE_KEYS.AUTH);
  },

  isAuthenticated: () => {
    const auth = authStorage.getCurrentUser();
    return auth && auth.isLoggedIn;
  }
};

// Default users data
const defaultUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    email: 'admin@university.edu',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    username: 'mentor',
    password: 'mentor123',
    role: 'mentor',
    name: 'Dr. Sarah Miller',
    email: 'sarah.miller@university.edu',
    department: 'Computer Science',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    username: 'student',
    password: 'student123',
    role: 'student',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    rollNo: 'CS001',
    year: '1st',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
  }
];

// User management
export const userStorage = {
  initializeUsers: () => {
    const existingUsers = storageUtils.get(STORAGE_KEYS.USERS);
    if (!existingUsers || existingUsers.length === 0) {
      storageUtils.set(STORAGE_KEYS.USERS, defaultUsers);
      return defaultUsers;
    }
    return existingUsers;
  },

  getAllUsers: () => {
    return storageUtils.get(STORAGE_KEYS.USERS, []);
  },

  getUserByCredentials: (username, password) => {
    const users = userStorage.getAllUsers();
    return users.find(user => 
      user.username === username && user.password === password
    );
  },

  getUserById: (id) => {
    const users = userStorage.getAllUsers();
    return users.find(user => user.id === id);
  },

  addUser: (userData) => {
    const users = userStorage.getAllUsers();
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    storageUtils.set(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  updateUser: (id, userData) => {
    const users = userStorage.getAllUsers();
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData, updatedAt: new Date().toISOString() };
      storageUtils.set(STORAGE_KEYS.USERS, users);
      return users[index];
    }
    return null;
  },

  deleteUser: (id) => {
    const users = userStorage.getAllUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    storageUtils.set(STORAGE_KEYS.USERS, filteredUsers);
    return filteredUsers;
  }
};

// Default students data (from StudentData.tsx)
const defaultStudents = [
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
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
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
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
  },
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
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
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
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
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
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
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
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
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
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
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
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
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
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
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
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
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
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
  },
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
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
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
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
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
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
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
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
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
    mentor: 'Dr. Sarah Miller',
    createdAt: new Date().toISOString()
  }
];

// Student management
export const studentStorage = {
  initializeStudents: () => {
    const existingStudents = storageUtils.get(STORAGE_KEYS.STUDENTS);
    if (!existingStudents || existingStudents.length === 0) {
      storageUtils.set(STORAGE_KEYS.STUDENTS, defaultStudents);
      return defaultStudents;
    }
    return existingStudents;
  },

  getAllStudents: () => {
    return storageUtils.get(STORAGE_KEYS.STUDENTS, []);
  },

  getStudentById: (id) => {
    const students = studentStorage.getAllStudents();
    return students.find(student => student.id === parseInt(id));
  },

  getStudentsByMentor: (mentorName) => {
    const students = studentStorage.getAllStudents();
    return students.filter(student => student.mentor === mentorName);
  },

  getStudentsByYear: (year) => {
    const students = studentStorage.getAllStudents();
    return students.filter(student => student.year === year);
  },

  addStudent: (studentData) => {
    const students = studentStorage.getAllStudents();
    const newStudent = {
      ...studentData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'Active'
    };
    students.push(newStudent);
    storageUtils.set(STORAGE_KEYS.STUDENTS, students);
    return newStudent;
  },

  updateStudent: (id, studentData) => {
    const students = studentStorage.getAllStudents();
    const index = students.findIndex(student => student.id === parseInt(id));
    if (index !== -1) {
      students[index] = { 
        ...students[index], 
        ...studentData, 
        updatedAt: new Date().toISOString() 
      };
      storageUtils.set(STORAGE_KEYS.STUDENTS, students);
      return students[index];
    }
    return null;
  },

  deleteStudent: (id) => {
    const students = studentStorage.getAllStudents();
    const filteredStudents = students.filter(student => student.id !== parseInt(id));
    storageUtils.set(STORAGE_KEYS.STUDENTS, filteredStudents);
    return filteredStudents;
  }
};

// Default surveys data
const defaultSurveys = [
  {
    id: '1',
    title: 'Academic Performance Survey',
    description: 'Help us understand how we can improve our academic programs and support systems.',
    status: 'Active',
    createdDate: '2024-09-01',
    endDate: '2024-10-01',
    responses: 45,
    targetAudience: 'All Students',
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        type: 'rating',
        question: 'How satisfied are you with the quality of teaching in your courses?',
        required: true
      },
      {
        id: 'q2',
        type: 'radio',
        question: 'Which subject do you find most challenging?',
        options: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'],
        required: true
      },
      {
        id: 'q3',
        type: 'textarea',
        question: 'What suggestions do you have for improving the academic experience?',
        required: false
      },
      {
        id: 'q4',
        type: 'checkbox',
        question: 'Which support services have you used? (Select all that apply)',
        options: ['Library', 'Tutoring', 'Career Counseling', 'Academic Advising', 'Mentorship Program'],
        required: false
      }
    ]
  },
  {
    id: '2',
    title: 'Campus Facilities Feedback',
    description: 'Share your thoughts on our campus facilities and help us identify areas for improvement.',
    status: 'Active',
    createdDate: '2024-09-10',
    endDate: '2024-10-10',
    responses: 32,
    targetAudience: 'All Students',
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        type: 'rating',
        question: 'How would you rate the overall condition of campus facilities?',
        required: true
      },
      {
        id: 'q2',
        type: 'radio',
        question: 'Which facility needs the most improvement?',
        options: ['Library', 'Cafeteria', 'Laboratories', 'Sports Complex', 'Dormitories'],
        required: true
      },
      {
        id: 'q3',
        type: 'textarea',
        question: 'Please describe any specific issues you\'ve encountered with campus facilities.',
        required: false
      }
    ]
  },
  {
    id: '3',
    title: 'Mentorship Program Evaluation',
    description: 'Evaluate your experience with our mentorship program and help us enhance it.',
    status: 'Completed',
    createdDate: '2024-08-15',
    endDate: '2024-09-15',
    responses: 67,
    targetAudience: 'All Students',
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        type: 'rating',
        question: 'How helpful has your mentor been in your academic journey?',
        required: true
      },
      {
        id: 'q2',
        type: 'radio',
        question: 'How often do you meet with your mentor?',
        options: ['Weekly', 'Bi-weekly', 'Monthly', 'Rarely', 'Never'],
        required: true
      },
      {
        id: 'q3',
        type: 'textarea',
        question: 'What improvements would you suggest for the mentorship program?',
        required: false
      }
    ]
  }
];

// Survey management
export const surveyStorage = {
  initializeSurveys: () => {
    const existingSurveys = storageUtils.get(STORAGE_KEYS.SURVEYS);
    if (!existingSurveys || existingSurveys.length === 0) {
      storageUtils.set(STORAGE_KEYS.SURVEYS, defaultSurveys);
      return defaultSurveys;
    }
    return existingSurveys;
  },

  getAllSurveys: () => {
    return storageUtils.get(STORAGE_KEYS.SURVEYS, []);
  },

  getSurveyById: (id) => {
    const surveys = surveyStorage.getAllSurveys();
    return surveys.find(survey => survey.id === id);
  },

  getActiveSurveys: () => {
    const surveys = surveyStorage.getAllSurveys();
    return surveys.filter(survey => survey.status === 'Active');
  },

  getSurveysByStatus: (status) => {
    const surveys = surveyStorage.getAllSurveys();
    return surveys.filter(survey => survey.status === status);
  },

  addSurvey: (surveyData) => {
    const surveys = surveyStorage.getAllSurveys();
    const newSurvey = {
      ...surveyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      responses: 0
    };
    surveys.push(newSurvey);
    storageUtils.set(STORAGE_KEYS.SURVEYS, surveys);
    return newSurvey;
  },

  updateSurvey: (id, surveyData) => {
    const surveys = surveyStorage.getAllSurveys();
    const index = surveys.findIndex(survey => survey.id === id);
    if (index !== -1) {
      surveys[index] = { 
        ...surveys[index], 
        ...surveyData, 
        updatedAt: new Date().toISOString() 
      };
      storageUtils.set(STORAGE_KEYS.SURVEYS, surveys);
      return surveys[index];
    }
    return null;
  },

  deleteSurvey: (id) => {
    const surveys = surveyStorage.getAllSurveys();
    const filteredSurveys = surveys.filter(survey => survey.id !== id);
    storageUtils.set(STORAGE_KEYS.SURVEYS, filteredSurveys);
    return filteredSurveys;
  }
};

// Survey responses management
export const surveyResponseStorage = {
  getAllResponses: () => {
    return storageUtils.get(STORAGE_KEYS.SURVEY_RESPONSES, []);
  },

  getResponsesBySurvey: (surveyId) => {
    const responses = surveyResponseStorage.getAllResponses();
    return responses.filter(response => response.surveyId === surveyId);
  },

  getResponsesByUser: (userId) => {
    const responses = surveyResponseStorage.getAllResponses();
    return responses.filter(response => response.userId === userId);
  },

  addResponse: (responseData) => {
    const responses = surveyResponseStorage.getAllResponses();
    const newResponse = {
      ...responseData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString()
    };
    responses.push(newResponse);
    storageUtils.set(STORAGE_KEYS.SURVEY_RESPONSES, responses);

    // Update survey response count
    const surveys = surveyStorage.getAllSurveys();
    const surveyIndex = surveys.findIndex(survey => survey.id === responseData.surveyId);
    if (surveyIndex !== -1) {
      surveys[surveyIndex].responses = (surveys[surveyIndex].responses || 0) + 1;
      storageUtils.set(STORAGE_KEYS.SURVEYS, surveys);
    }

    return newResponse;
  },

  hasUserRespondedToSurvey: (userId, surveyId) => {
    const responses = surveyResponseStorage.getAllResponses();
    return responses.some(response => 
      response.userId === userId && response.surveyId === surveyId
    );
  }
};

// Settings management
export const settingsStorage = {
  getSettings: () => {
    return storageUtils.get(STORAGE_KEYS.SETTINGS, {
      theme: 'light',
      notifications: true,
      language: 'en',
      autoSave: true
    });
  },

  updateSettings: (newSettings) => {
    const currentSettings = settingsStorage.getSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    storageUtils.set(STORAGE_KEYS.SETTINGS, updatedSettings);
    return updatedSettings;
  }
};

// Data initialization and migration
export const dataManager = {
  initialize: () => {
    try {
      // Check version for migrations
      const currentVersion = storageUtils.get(STORAGE_KEYS.VERSION);
      
      if (!currentVersion || currentVersion !== CURRENT_VERSION) {
        console.log('Initializing data or running migration...');
        dataManager.migrate(currentVersion);
      }

      // Initialize all data stores
      userStorage.initializeUsers();
      studentStorage.initializeStudents();
      surveyStorage.initializeSurveys();
      
      // Set current version
      storageUtils.set(STORAGE_KEYS.VERSION, CURRENT_VERSION);

      console.log('Data initialization completed successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize data:', error);
      return false;
    }
  },

  migrate: (fromVersion) => {
    console.log(`Migrating data from version ${fromVersion} to ${CURRENT_VERSION}`);
    // Add migration logic here when needed
    // For now, we'll just ensure all default data is present
  },

  reset: () => {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      storageUtils.clear();
      dataManager.initialize();
      return true;
    }
    return false;
  },

  export: () => {
    const data = {
      users: userStorage.getAllUsers(),
      students: studentStorage.getAllStudents(),
      surveys: surveyStorage.getAllSurveys(),
      responses: surveyResponseStorage.getAllResponses(),
      settings: settingsStorage.getSettings(),
      version: CURRENT_VERSION,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  import: (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.users) storageUtils.set(STORAGE_KEYS.USERS, data.users);
      if (data.students) storageUtils.set(STORAGE_KEYS.STUDENTS, data.students);
      if (data.surveys) storageUtils.set(STORAGE_KEYS.SURVEYS, data.surveys);
      if (data.responses) storageUtils.set(STORAGE_KEYS.SURVEY_RESPONSES, data.responses);
      if (data.settings) storageUtils.set(STORAGE_KEYS.SETTINGS, data.settings);
      
      storageUtils.set(STORAGE_KEYS.VERSION, CURRENT_VERSION);
      
      console.log('Data import completed successfully');
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
};

// Initialize data on module load
if (typeof window !== 'undefined') {
  dataManager.initialize();
}