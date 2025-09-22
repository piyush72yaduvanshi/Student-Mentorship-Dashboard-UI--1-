import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { CreateSurveyForm } from './CreateSurveyForm';
import { getAllSurveys } from './SurveyData';
import { getStudentsData } from './StudentData';
import { userStorage, studentStorage, surveyStorage, dataManager } from '../utils/localStorage';
import { 
  Users, 
  GraduationCap, 
  FileText, 
  Upload, 
  Plus, 
  BarChart3, 
  Settings,
  LogOut,
  UserPlus,
  BookOpen,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  UserCheck,
  Calendar
} from 'lucide-react';

interface AdminDashboardProps {
  user?: any;
  onLogout: () => void;
  onBack?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadType, setUploadType] = useState('single');
  const [showCreateSurvey, setShowCreateSurvey] = useState(false);
  const [surveys, setSurveys] = useState(getAllSurveys());
  const [students, setStudents] = useState(getStudentsData());
  const [users, setUsers] = useState(userStorage.getAllUsers());
  const [newStudentData, setNewStudentData] = useState({
    firstName: '',
    lastName: '',
    rollNo: '',
    year: '',
    email: '',
    department: 'Computer Science',
    mentor: 'Dr. Sarah Miller'
  });
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [selectedStudentForView, setSelectedStudentForView] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  
  // Edit student states
  const [editingStudent, setEditingStudent] = useState(null);
  const [editStudentData, setEditStudentData] = useState({});
  
  // Attendance update states
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceStudent, setAttendanceStudent] = useState(null);
  const [newAttendance, setNewAttendance] = useState('');
  
  // Grades view states
  const [showGradesModal, setShowGradesModal] = useState(false);
  const [gradesStudent, setGradesStudent] = useState(null);
  
  // Meeting schedule states
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingStudent, setMeetingStudent] = useState(null);
  const [meetingData, setMeetingData] = useState({
    date: '',
    time: '',
    purpose: '',
    notes: ''
  });
  
  // Add mentor states
  const [showAddMentorModal, setShowAddMentorModal] = useState(false);
  const [newMentorData, setNewMentorData] = useState({
    name: '',
    email: '',
    department: '',
    subjects: ''
  });
  
  // Add subject states
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectData, setNewSubjectData] = useState({
    name: '',
    department: '',
    code: '',
    credits: ''
  });

  // Calculate real statistics from localStorage data
  const studentStats = {
    firstYear: students.filter(s => s.year === '1st').length,
    secondYear: students.filter(s => s.year === '2nd').length,
    thirdYear: students.filter(s => s.year === '3rd').length,
    fourthYear: students.filter(s => s.year === '4th').length,
    total: students.length
  };

  const handleDataRefresh = () => {
    setSurveys(getAllSurveys());
    setStudents(getStudentsData());
    setUsers(userStorage.getAllUsers());
  };

  const handleDataReset = () => {
    if (dataManager.reset()) {
      handleDataRefresh();
    }
  };

  const handleDataExport = () => {
    const data = dataManager.export();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `edumentor-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const recentActivities = [
    { id: 1, action: 'New student added', student: 'John Doe', time: '2 hours ago' },
    { id: 2, action: 'Survey completed', student: 'Jane Smith', time: '4 hours ago' },
    { id: 3, action: 'Mentor assigned', student: 'Mike Johnson', time: '6 hours ago' },
  ];

  const handleCreateSurvey = (surveyData: any) => {
    setSurveys(prev => [...prev, surveyData]);
    setShowCreateSurvey(false);
    setActiveTab('surveys');
  };

  const handleDeleteSurvey = (surveyId: string) => {
    setSurveys(prev => prev.filter(survey => survey.id !== surveyId));
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStudentData.firstName || !newStudentData.lastName || !newStudentData.rollNo || 
        !newStudentData.year || !newStudentData.email) {
      alert('Please fill in all required fields');
      return;
    }

    const studentData = {
      name: `${newStudentData.firstName} ${newStudentData.lastName}`,
      rollNo: newStudentData.rollNo,
      year: newStudentData.year,
      email: newStudentData.email,
      department: newStudentData.department,
      mentor: newStudentData.mentor,
      attendance: Math.floor(Math.random() * 30) + 70, // Random between 70-100
      avgMarks: Math.floor(Math.random() * 30) + 70, // Random between 70-100
      status: 'Active'
    };

    const newStudent = studentStorage.addStudent(studentData);
    setStudents(prev => [...prev, newStudent]);
    
    // Reset form
    setNewStudentData({
      firstName: '',
      lastName: '',
      rollNo: '',
      year: '',
      email: '',
      department: 'Computer Science',
      mentor: 'Dr. Sarah Miller'
    });
    
    setShowStudentForm(false);
    alert('Student added successfully!');
  };

  const handleStudentView = (student: any) => {
    setSelectedStudentForView(student);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      alert('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Expected headers: First Name, Last Name, Roll Number, Year, Email
      if (!headers.includes('First Name') || !headers.includes('Last Name') || 
          !headers.includes('Roll Number') || !headers.includes('Year') || 
          !headers.includes('Email')) {
        alert('CSV file must contain headers: First Name, Last Name, Roll Number, Year, Email');
        return;
      }

      const newStudents = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',').map(v => v.trim());
        const studentData = {
          name: `${values[headers.indexOf('First Name')]} ${values[headers.indexOf('Last Name')]}`,
          rollNo: values[headers.indexOf('Roll Number')],
          year: values[headers.indexOf('Year')],
          email: values[headers.indexOf('Email')],
          department: 'Computer Science',
          mentor: 'Dr. Sarah Miller',
          attendance: Math.floor(Math.random() * 30) + 70,
          avgMarks: Math.floor(Math.random() * 30) + 70,
          status: 'Active'
        };

        const newStudent = studentStorage.addStudent(studentData);
        newStudents.push(newStudent);
      }

      setStudents(prev => [...prev, ...newStudents]);
      alert(`Successfully added ${newStudents.length} students!`);
    };

    reader.readAsText(file);
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      ['First Name', 'Last Name', 'Roll Number', 'Year', 'Email'],
      ['John', 'Doe', 'CS001', '1st', 'john.doe@university.edu'],
      ['Jane', 'Smith', 'CS002', '1st', 'jane.smith@university.edu'],
      ['Mike', 'Johnson', 'CS003', '2nd', 'mike.johnson@university.edu']
    ];

    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_students.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter students based on search and filter criteria
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === 'all' || student.year === filterYear;
    return matchesSearch && matchesYear;
  });

  // Edit student handlers
  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setEditStudentData({
      name: student.name,
      email: student.email,
      department: student.department,
      mentor: student.mentor,
      year: student.year
    });
  };

  const handleUpdateStudent = () => {
    if (editingStudent) {
      const updatedStudent = { ...editingStudent, ...editStudentData };
      studentStorage.updateStudent(editingStudent.id, updatedStudent);
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? updatedStudent : s));
      setEditingStudent(null);
      setEditStudentData({});
      alert('Student updated successfully!');
    }
  };

  // Attendance update handlers
  const handleUpdateAttendance = (student) => {
    setAttendanceStudent(student);
    setNewAttendance(student.attendance.toString());
    setShowAttendanceModal(true);
  };

  const handleSaveAttendance = () => {
    if (attendanceStudent && newAttendance) {
      const attendance = Math.min(100, Math.max(0, parseInt(newAttendance)));
      const updatedStudent = { ...attendanceStudent, attendance };
      studentStorage.updateStudent(attendanceStudent.id, updatedStudent);
      setStudents(prev => prev.map(s => s.id === attendanceStudent.id ? updatedStudent : s));
      setShowAttendanceModal(false);
      setAttendanceStudent(null);
      setNewAttendance('');
      alert('Attendance updated successfully!');
    }
  };

  // Grades view handlers
  const handleViewGrades = (student) => {
    setGradesStudent(student);
    setShowGradesModal(true);
  };

  // Meeting schedule handlers
  const handleScheduleMeeting = (student) => {
    setMeetingStudent(student);
    setMeetingData({
      date: '',
      time: '',
      purpose: '',
      notes: ''
    });
    setShowMeetingModal(true);
  };

  const handleSaveMeeting = () => {
    if (meetingStudent && meetingData.date && meetingData.time && meetingData.purpose) {
      // In a real app, this would save to database
      alert(`Meeting scheduled with ${meetingStudent.name} on ${meetingData.date} at ${meetingData.time}`);
      setShowMeetingModal(false);
      setMeetingStudent(null);
      setMeetingData({
        date: '',
        time: '',
        purpose: '',
        notes: ''
      });
    } else {
      alert('Please fill in all required fields');
    }
  };

  // Add mentor handlers
  const handleAddMentor = () => {
    if (newMentorData.name && newMentorData.email && newMentorData.department) {
      // In a real app, this would save to database
      alert(`Mentor ${newMentorData.name} added successfully!`);
      setShowAddMentorModal(false);
      setNewMentorData({
        name: '',
        email: '',
        department: '',
        subjects: ''
      });
    } else {
      alert('Please fill in all required fields');
    }
  };

  // Add subject handlers
  const handleAddSubject = () => {
    if (newSubjectData.name && newSubjectData.department && newSubjectData.code) {
      // In a real app, this would save to database
      alert(`Subject ${newSubjectData.name} added successfully!`);
      setShowAddSubjectModal(false);
      setNewSubjectData({
        name: '',
        department: '',
        code: '',
        credits: ''
      });
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold">EduMentor</span>
          </div>

          <div className="flex items-center space-x-3 mb-8 p-3 bg-gray-50 rounded-lg">
            <Avatar>
              <AvatarImage src="/admin-avatar.jpg" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Admin User</p>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'students' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Students</span>
            </button>
            <button
              onClick={() => setActiveTab('mentors')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'mentors' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Mentors & Subjects</span>
            </button>
            <button
              onClick={() => setActiveTab('surveys')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'surveys' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Surveys</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'upload' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span>Upload Data</span>
            </button>
          </nav>

          <div className="absolute bottom-6 left-6 space-y-2">
            {onBack && (
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 w-full"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Landing</span>
              </Button>
            )}
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {showCreateSurvey ? (
            <CreateSurveyForm 
              onBack={() => setShowCreateSurvey(false)}
              onSave={handleCreateSurvey}
            />
          ) : (
            <div>
              {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening in your institution.</p>
              </div>

              {/* Student Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">1st Year</p>
                        <p className="text-2xl font-bold">{studentStats.firstYear}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">2nd Year</p>
                        <p className="text-2xl font-bold">{studentStats.secondYear}</p>
                      </div>
                      <Users className="w-8 h-8 text-green-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">3rd Year</p>
                        <p className="text-2xl font-bold">{studentStats.thirdYear}</p>
                      </div>
                      <Users className="w-8 h-8 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100">4th Year</p>
                        <p className="text-2xl font-bold">{studentStats.fourthYear}</p>
                      </div>
                      <Users className="w-8 h-8 text-orange-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300">Total</p>
                        <p className="text-2xl font-bold">{studentStats.total}</p>
                      </div>
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.student}</p>
                          </div>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        onClick={() => setActiveTab('students')}
                        className="flex flex-col items-center space-y-2 h-auto py-4 bg-blue-50 text-blue-600 hover:bg-blue-100"
                        variant="ghost"
                      >
                        <UserPlus className="w-6 h-6" />
                        <span>Add Student</span>
                      </Button>
                      <Button 
                        onClick={() => setShowCreateSurvey(true)}
                        className="flex flex-col items-center space-y-2 h-auto py-4 bg-green-50 text-green-600 hover:bg-green-100"
                        variant="ghost"
                      >
                        <FileText className="w-6 h-6" />
                        <span>Create Survey</span>
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('upload')}
                        className="flex flex-col items-center space-y-2 h-auto py-4 bg-purple-50 text-purple-600 hover:bg-purple-100"
                        variant="ghost"
                      >
                        <Upload className="w-6 h-6" />
                        <span>Upload Data</span>
                      </Button>
                      <Button 
                        className="flex flex-col items-center space-y-2 h-auto py-4 bg-orange-50 text-orange-600 hover:bg-orange-100"
                        variant="ghost"
                      >
                        <BarChart3 className="w-6 h-6" />
                        <span>View Reports</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && !selectedStudentForView && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
                <Button 
                  onClick={() => setShowStudentForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </div>

              {showStudentForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Student</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddStudent} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input 
                            id="firstName" 
                            value={newStudentData.firstName}
                            onChange={(e) => setNewStudentData({...newStudentData, firstName: e.target.value})}
                            placeholder="Enter first name" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input 
                            id="lastName" 
                            value={newStudentData.lastName}
                            onChange={(e) => setNewStudentData({...newStudentData, lastName: e.target.value})}
                            placeholder="Enter last name" 
                            required 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rollNo">Roll Number *</Label>
                          <Input 
                            id="rollNo" 
                            value={newStudentData.rollNo}
                            onChange={(e) => setNewStudentData({...newStudentData, rollNo: e.target.value})}
                            placeholder="Enter roll number" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="year">Year *</Label>
                          <Select onValueChange={(value) => setNewStudentData({...newStudentData, year: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1st">1st Year</SelectItem>
                              <SelectItem value="2nd">2nd Year</SelectItem>
                              <SelectItem value="3rd">3rd Year</SelectItem>
                              <SelectItem value="4th">4th Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={newStudentData.email}
                          onChange={(e) => setNewStudentData({...newStudentData, email: e.target.value})}
                          placeholder="Enter email address" 
                          required 
                        />
                      </div>
                      <div className="flex space-x-4">
                        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                          Add Student
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowStudentForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>All Students ({filteredStudents.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Input 
                        placeholder="Search students..." 
                        className="max-w-sm" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Select value={filterYear} onValueChange={setFilterYear}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Filter by year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Years</SelectItem>
                          <SelectItem value="1st">1st Year</SelectItem>
                          <SelectItem value="2nd">2nd Year</SelectItem>
                          <SelectItem value="3rd">3rd Year</SelectItem>
                          <SelectItem value="4th">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {filteredStudents.length > 0 ? (
                      <div className="space-y-3">
                        {filteredStudents.map((student) => (
                          <div key={student.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Avatar>
                                  <AvatarFallback>{student.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">{student.name}</h4>
                                  <p className="text-sm text-gray-600">{student.rollNo} • {student.year} Year • {student.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="text-sm font-medium">Attendance: {student.attendance}%</p>
                                  <p className="text-sm text-gray-600">Avg Marks: {student.avgMarks}%</p>
                                </div>
                                <Badge variant={student.status === 'Active' ? 'outline' : 'destructive'}>
                                  {student.status}
                                </Badge>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleStudentView(student)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No students found</p>
                        <Button variant="outline" className="mt-4" onClick={() => setShowStudentForm(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Student
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Student Detail View */}
          {activeTab === 'students' && selectedStudentForView && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Student Report</h1>
                  <p className="text-gray-600">{selectedStudentForView.name} - {selectedStudentForView.rollNo}</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedStudentForView(null)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to List
                </Button>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="text-lg">
                          {selectedStudentForView.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedStudentForView.name}</h3>
                        <p className="text-gray-600">{selectedStudentForView.rollNo}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Year:</span>
                        <span>{selectedStudentForView.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span>{selectedStudentForView.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span>{selectedStudentForView.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mentor:</span>
                        <span>{selectedStudentForView.mentor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant={selectedStudentForView.status === 'Active' ? 'outline' : 'destructive'}>
                          {selectedStudentForView.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Attendance</span>
                          <span className="text-sm">{selectedStudentForView.attendance}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${selectedStudentForView.attendance}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Average Marks</span>
                          <span className="text-sm">{selectedStudentForView.avgMarks}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${selectedStudentForView.avgMarks}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{selectedStudentForView.attendance}%</p>
                          <p className="text-xs text-gray-600">Attendance Rate</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">{selectedStudentForView.avgMarks}%</p>
                          <p className="text-xs text-gray-600">Average Score</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleEditStudent(selectedStudentForView)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Student
                      </Button>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleUpdateAttendance(selectedStudentForView)}
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Update Attendance
                      </Button>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleViewGrades(selectedStudentForView)}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Grades
                      </Button>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleScheduleMeeting(selectedStudentForView)}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Meeting
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Mentors & Subjects Tab */}
          {activeTab === 'mentors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Mentors & Subjects</h1>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  onClick={() => setShowAddMentorModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Mentor
                </Button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Mentors List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mentors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>SM</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">Dr. Sarah Miller</h4>
                              <p className="text-sm text-gray-600">Computer Science</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{students.length} Students</Badge>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>More mentors will be listed here</p>
                        <Button 
                          variant="outline" 
                          className="mt-3"
                          onClick={() => setShowAddMentorModal(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Mentor
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Subjects List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subjects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['Computer Science Fundamentals', 'Data Structures', 'Algorithms', 'Database Systems', 'Software Engineering'].map((subject, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{subject}</h4>
                              <p className="text-sm text-gray-600">Computer Science Department</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-center py-4">
                        <Button 
                          variant="outline"
                          onClick={() => setShowAddSubjectModal(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Subject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Surveys Tab */}
          {activeTab === 'surveys' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Survey Management</h1>
                <Button 
                  onClick={() => setShowCreateSurvey(true)}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Survey
                </Button>
              </div>

              <div className="grid gap-6">
                {surveys.map((survey) => (
                  <Card key={survey.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{survey.title}</h3>
                            <Badge variant={survey.status === 'Active' ? 'default' : survey.status === 'Draft' ? 'secondary' : 'outline'}>
                              {survey.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{survey.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{survey.responses} responses</span>
                            <span>Target: {survey.targetAudience}</span>
                            <span>Created: {survey.createdDate}</span>
                            <span>Ends: {survey.endDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteSurvey(survey.id)}
                            className="text-red-600 hover:text-red-800 hover:border-red-200"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">Upload Student Data</h1>

              <Tabs value={uploadType} onValueChange={setUploadType}>
                <TabsList>
                  <TabsTrigger value="single">Single Upload</TabsTrigger>
                  <TabsTrigger value="batch">Batch Upload</TabsTrigger>
                </TabsList>

                <TabsContent value="single">
                  <Card>
                    <CardHeader>
                      <CardTitle>Add Single Student</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddStudent} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="upload-firstName">First Name</Label>
                            <Input 
                              id="upload-firstName" 
                              value={newStudentData.firstName}
                              onChange={(e) => setNewStudentData({...newStudentData, firstName: e.target.value})}
                              placeholder="Enter first name" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="upload-lastName">Last Name</Label>
                            <Input 
                              id="upload-lastName" 
                              value={newStudentData.lastName}
                              onChange={(e) => setNewStudentData({...newStudentData, lastName: e.target.value})}
                              placeholder="Enter last name" 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="upload-rollNo">Roll Number</Label>
                            <Input 
                              id="upload-rollNo" 
                              value={newStudentData.rollNo}
                              onChange={(e) => setNewStudentData({...newStudentData, rollNo: e.target.value})}
                              placeholder="Enter roll number" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="upload-year">Year</Label>
                            <Select onValueChange={(value) => setNewStudentData({...newStudentData, year: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1st">1st Year</SelectItem>
                                <SelectItem value="2nd">2nd Year</SelectItem>
                                <SelectItem value="3rd">3rd Year</SelectItem>
                                <SelectItem value="4th">4th Year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="upload-email">Email</Label>
                          <Input 
                            id="upload-email" 
                            type="email" 
                            value={newStudentData.email}
                            onChange={(e) => setNewStudentData({...newStudentData, email: e.target.value})}
                            placeholder="Enter email address" 
                          />
                        </div>
                        <Button 
                          type="submit"
                          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                        >
                          Add Student
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="batch">
                  <Card>
                    <CardHeader>
                      <CardTitle>Batch Upload</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium text-gray-900 mb-2">Upload CSV File</p>
                        <p className="text-gray-600 mb-4">Drag and drop your CSV file here, or click to browse</p>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="csv-upload"
                        />
                        <Button 
                          variant="outline"
                          onClick={() => document.getElementById('csv-upload')?.click()}
                        >
                          Choose File
                        </Button>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-blue-900">CSV Format Requirements:</h4>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={downloadSampleCSV}
                            className="text-blue-700 border-blue-300 hover:bg-blue-100"
                          >
                            Download Sample
                          </Button>
                        </div>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Columns: First Name, Last Name, Roll Number, Year, Email</li>
                          <li>• Maximum 500 students per upload</li>
                          <li>• File size limit: 5MB</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Student - {editingStudent.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input 
                    id="edit-name"
                    value={editStudentData.name || ''}
                    onChange={(e) => setEditStudentData({...editStudentData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input 
                    id="edit-email"
                    type="email"
                    value={editStudentData.email || ''}
                    onChange={(e) => setEditStudentData({...editStudentData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input 
                    id="edit-department"
                    value={editStudentData.department || ''}
                    onChange={(e) => setEditStudentData({...editStudentData, department: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-mentor">Mentor</Label>
                  <Input 
                    id="edit-mentor"
                    value={editStudentData.mentor || ''}
                    onChange={(e) => setEditStudentData({...editStudentData, mentor: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-year">Year</Label>
                <Select value={editStudentData.year || ''} onValueChange={(value) => setEditStudentData({...editStudentData, year: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Year</SelectItem>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-4 pt-4">
                <Button onClick={handleUpdateStudent} className="bg-blue-600 hover:bg-blue-700">
                  Update Student
                </Button>
                <Button variant="outline" onClick={() => setEditingStudent(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Update Attendance Modal */}
      {showAttendanceModal && (
        <Dialog open={showAttendanceModal} onOpenChange={setShowAttendanceModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Attendance - {attendanceStudent?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="attendance">Attendance Percentage</Label>
                <Input 
                  id="attendance"
                  type="number"
                  min="0"
                  max="100"
                  value={newAttendance}
                  onChange={(e) => setNewAttendance(e.target.value)}
                  placeholder="Enter attendance percentage"
                />
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleSaveAttendance} className="bg-blue-600 hover:bg-blue-700">
                  Update Attendance
                </Button>
                <Button variant="outline" onClick={() => setShowAttendanceModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* View Grades Modal */}
      {showGradesModal && (
        <Dialog open={showGradesModal} onOpenChange={setShowGradesModal}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Grades - {gradesStudent?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Semester</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['Mathematics', 'Physics', 'Computer Science', 'English'].map((subject, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded">
                          <span>{subject}</span>
                          <Badge variant="outline">{85 + Math.floor(Math.random() * 15)}%</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Current GPA:</span>
                        <span className="font-semibold">3.7</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overall GPA:</span>
                        <span className="font-semibold">3.6</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Credits Completed:</span>
                        <span className="font-semibold">45/120</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Button variant="outline" onClick={() => setShowGradesModal(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Schedule Meeting Modal */}
      {showMeetingModal && (
        <Dialog open={showMeetingModal} onOpenChange={setShowMeetingModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Meeting - {meetingStudent?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meeting-date">Date</Label>
                  <Input 
                    id="meeting-date"
                    type="date"
                    value={meetingData.date}
                    onChange={(e) => setMeetingData({...meetingData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting-time">Time</Label>
                  <Input 
                    id="meeting-time"
                    type="time"
                    value={meetingData.time}
                    onChange={(e) => setMeetingData({...meetingData, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-purpose">Purpose</Label>
                <Input 
                  id="meeting-purpose"
                  value={meetingData.purpose}
                  onChange={(e) => setMeetingData({...meetingData, purpose: e.target.value})}
                  placeholder="Meeting purpose"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-notes">Notes (Optional)</Label>
                <Textarea 
                  id="meeting-notes"
                  value={meetingData.notes}
                  onChange={(e) => setMeetingData({...meetingData, notes: e.target.value})}
                  placeholder="Additional notes"
                />
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleSaveMeeting} className="bg-blue-600 hover:bg-blue-700">
                  Schedule Meeting
                </Button>
                <Button variant="outline" onClick={() => setShowMeetingModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Mentor Modal */}
      {showAddMentorModal && (
        <Dialog open={showAddMentorModal} onOpenChange={setShowAddMentorModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Mentor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mentor-name">Name</Label>
                <Input 
                  id="mentor-name"
                  value={newMentorData.name}
                  onChange={(e) => setNewMentorData({...newMentorData, name: e.target.value})}
                  placeholder="Mentor's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentor-email">Email</Label>
                <Input 
                  id="mentor-email"
                  type="email"
                  value={newMentorData.email}
                  onChange={(e) => setNewMentorData({...newMentorData, email: e.target.value})}
                  placeholder="mentor@university.edu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentor-department">Department</Label>
                <Input 
                  id="mentor-department"
                  value={newMentorData.department}
                  onChange={(e) => setNewMentorData({...newMentorData, department: e.target.value})}
                  placeholder="Department name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentor-subjects">Subjects (Optional)</Label>
                <Input 
                  id="mentor-subjects"
                  value={newMentorData.subjects}
                  onChange={(e) => setNewMentorData({...newMentorData, subjects: e.target.value})}
                  placeholder="Comma-separated subjects"
                />
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleAddMentor} className="bg-blue-600 hover:bg-blue-700">
                  Add Mentor
                </Button>
                <Button variant="outline" onClick={() => setShowAddMentorModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <Dialog open={showAddSubjectModal} onOpenChange={setShowAddSubjectModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject-name">Subject Name</Label>
                <Input 
                  id="subject-name"
                  value={newSubjectData.name}
                  onChange={(e) => setNewSubjectData({...newSubjectData, name: e.target.value})}
                  placeholder="Subject name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-code">Subject Code</Label>
                  <Input 
                    id="subject-code"
                    value={newSubjectData.code}
                    onChange={(e) => setNewSubjectData({...newSubjectData, code: e.target.value})}
                    placeholder="CS101"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject-credits">Credits</Label>
                  <Input 
                    id="subject-credits"
                    type="number"
                    value={newSubjectData.credits}
                    onChange={(e) => setNewSubjectData({...newSubjectData, credits: e.target.value})}
                    placeholder="3"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject-department">Department</Label>
                <Input 
                  id="subject-department"
                  value={newSubjectData.department}
                  onChange={(e) => setNewSubjectData({...newSubjectData, department: e.target.value})}
                  placeholder="Department name"
                />
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleAddSubject} className="bg-blue-600 hover:bg-blue-700">
                  Add Subject
                </Button>
                <Button variant="outline" onClick={() => setShowAddSubjectModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};