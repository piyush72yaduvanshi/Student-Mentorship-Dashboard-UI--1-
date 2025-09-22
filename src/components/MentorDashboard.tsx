import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { 
  Users, 
  Search, 
  Filter,
  BookOpen,
  GraduationCap,
  LogOut,
  BarChart3,
  UserCheck,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  Shield,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';

import { mockStudents, generateStudentData } from './StudentData';
import { calculateRiskAssessment } from './RiskAssessment';
import { RiskAnalytics } from './RiskAnalytics';

interface MentorDashboardProps {
  onLogout: () => void;
  onStudentSelect: (student: any) => void;
  onBack?: () => void;
  user?: any;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({ onLogout, onStudentSelect, onBack, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [riskZoneFilter, setRiskZoneFilter] = useState<string>('all');

  // Modal states
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [isMarkAttendanceOpen, setIsMarkAttendanceOpen] = useState(false);
  
  // Form states for Schedule Meeting
  const [meetingForm, setMeetingForm] = useState({
    studentId: '',
    date: '',
    time: '',
    duration: '30',
    type: 'individual',
    notes: ''
  });

  // Form states for Mark Attendance
  const [attendanceForm, setAttendanceForm] = useState({
    date: new Date().toISOString().split('T')[0],
    selectedStudents: new Set()
  });

  // Use centralized student data with risk assessment
  const studentsWithRisk = mockStudents.map(student => {
    const studentData = generateStudentData(student.id, student);
    const riskAssessment = calculateRiskAssessment(studentData.riskFactors);
    return {
      ...student,
      riskZone: riskAssessment.zone,
      riskScore: riskAssessment.score
    };
  });

  // Calculate stats from actual data
  const studentStats = {
    firstYear: studentsWithRisk.filter(s => s.year === '1st').length,
    secondYear: studentsWithRisk.filter(s => s.year === '2nd').length,
    thirdYear: studentsWithRisk.filter(s => s.year === '3rd').length,
    fourthYear: studentsWithRisk.filter(s => s.year === '4th').length,
    total: studentsWithRisk.length
  };

  // Risk zone stats
  const riskStats = {
    green: studentsWithRisk.filter(s => s.riskZone === 'green').length,
    yellow: studentsWithRisk.filter(s => s.riskZone === 'yellow').length,
    red: studentsWithRisk.filter(s => s.riskZone === 'red').length
  };

  const filteredStudents = studentsWithRisk.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === 'all' || student.year === selectedYear;
    const matchesRiskZone = riskZoneFilter === 'all' || student.riskZone === riskZoneFilter;
    return matchesSearch && matchesYear && matchesRiskZone;
  });

  const handleViewStudentsByRisk = (riskZone?: string) => {
    if (riskZone) {
      setRiskZoneFilter(riskZone);
    }
    setActiveTab('students');
  };

  // Handle Schedule Meeting
  const handleScheduleMeeting = () => {
    if (!meetingForm.studentId || !meetingForm.date || !meetingForm.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Save meeting to localStorage
    const meetings = JSON.parse(localStorage.getItem('meetings') || '[]');
    const newMeeting = {
      id: Date.now(),
      ...meetingForm,
      mentorId: user?.id,
      mentorName: user?.name || 'Dr. Sarah Miller',
      studentName: studentsWithRisk.find(s => s.id === meetingForm.studentId)?.name,
      createdAt: new Date().toISOString()
    };
    meetings.push(newMeeting);
    localStorage.setItem('meetings', JSON.stringify(meetings));

    toast.success('Meeting scheduled successfully!');
    setIsScheduleMeetingOpen(false);
    setMeetingForm({
      studentId: '',
      date: '',
      time: '',
      duration: '30',
      type: 'individual',
      notes: ''
    });
  };

  // Handle Mark Attendance
  const handleMarkAttendance = () => {
    if (attendanceForm.selectedStudents.size === 0) {
      toast.error('Please select at least one student');
      return;
    }

    // Save attendance to localStorage
    const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    const attendanceRecord = {
      id: Date.now(),
      date: attendanceForm.date,
      mentorId: user?.id,
      students: Array.from(attendanceForm.selectedStudents),
      markedAt: new Date().toISOString()
    };
    attendance.push(attendanceRecord);
    localStorage.setItem('attendance', JSON.stringify(attendance));

    toast.success(`Attendance marked for ${attendanceForm.selectedStudents.size} students`);
    setIsMarkAttendanceOpen(false);
    setAttendanceForm({
      date: new Date().toISOString().split('T')[0],
      selectedStudents: new Set()
    });
  };

  // Handle student selection for attendance
  const toggleStudentAttendance = (studentId: string) => {
    const newSelectedStudents = new Set(attendanceForm.selectedStudents);
    if (newSelectedStudents.has(studentId)) {
      newSelectedStudents.delete(studentId);
    } else {
      newSelectedStudents.add(studentId);
    }
    setAttendanceForm(prev => ({
      ...prev,
      selectedStudents: newSelectedStudents
    }));
  };

  const recentActivities = [
    { id: 1, student: 'Ashley Martinez', action: 'Critical attendance alert', time: '1 hour ago' },
    { id: 2, student: 'Tyler Ross', action: 'Failed exam notification', time: '2 hours ago' },
    { id: 3, student: 'Mike Johnson', action: 'Submitted late assignment', time: '4 hours ago' },
    { id: 4, student: 'Jane Smith', action: 'Attended mentoring session', time: '1 day ago' },
  ];

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
              <AvatarImage src="/mentor-avatar.jpg" />
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Dr. Sarah Miller</p>
              <p className="text-sm text-gray-500">Computer Science</p>
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
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'analytics' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Risk Analytics</span>
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentor Dashboard</h1>
                <p className="text-gray-600">Manage and track your mentee students' progress.</p>
              </div>

              {/* Risk Zone Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Green Zone</p>
                        <p className="text-2xl font-bold">{riskStats.green}</p>
                        <p className="text-xs text-green-200">Low Risk Students</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100">Yellow Zone</p>
                        <p className="text-2xl font-bold">{riskStats.yellow}</p>
                        <p className="text-xs text-yellow-200">Moderate Risk Students</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-yellow-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100">Red Zone</p>
                        <p className="text-2xl font-bold">{riskStats.red}</p>
                        <p className="text-xs text-red-200">High Risk Students</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-red-200" />
                    </div>
                  </CardContent>
                </Card>
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
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5" />
                      <span>Recent Activities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{activity.student}</p>
                              <p className="text-sm text-gray-600">{activity.action}</p>
                            </div>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="w-5 h-5" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        className="flex flex-col items-center space-y-2 h-auto py-4 bg-blue-50 text-blue-600 hover:bg-blue-100"
                        variant="ghost"
                        onClick={() => setActiveTab('students')}
                      >
                        <Users className="w-6 h-6" />
                        <span className="text-sm">View Students</span>
                      </Button>
                      <Button 
                        className="flex flex-col items-center space-y-2 h-auto py-4 bg-green-50 text-green-600 hover:bg-green-100"
                        variant="ghost"
                        onClick={() => setActiveTab('analytics')}
                      >
                        <TrendingUp className="w-6 h-6" />
                        <span className="text-sm">Risk Analytics</span>
                      </Button>
                      <Dialog open={isScheduleMeetingOpen} onOpenChange={setIsScheduleMeetingOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="flex flex-col items-center space-y-2 h-auto py-4 bg-purple-50 text-purple-600 hover:bg-purple-100"
                            variant="ghost"
                          >
                            <Calendar className="w-6 h-6" />
                            <span className="text-sm">Schedule Meeting</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Schedule Meeting</DialogTitle>
                            <DialogDescription>
                              Schedule a one-on-one meeting with a student to discuss their progress and provide guidance.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="student">Select Student</Label>
                              <Select 
                                value={meetingForm.studentId} 
                                onValueChange={(value) => setMeetingForm(prev => ({ ...prev, studentId: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a student" />
                                </SelectTrigger>
                                <SelectContent>
                                  {studentsWithRisk.map(student => (
                                    <SelectItem key={student.id} value={student.id}>
                                      {student.name} - {student.rollNo}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="date">Date</Label>
                                <Input
                                  id="date"
                                  type="date"
                                  value={meetingForm.date}
                                  onChange={(e) => setMeetingForm(prev => ({ ...prev, date: e.target.value }))}
                                  min={new Date().toISOString().split('T')[0]}
                                />
                              </div>
                              <div>
                                <Label htmlFor="time">Time</Label>
                                <Input
                                  id="time"
                                  type="time"
                                  value={meetingForm.time}
                                  onChange={(e) => setMeetingForm(prev => ({ ...prev, time: e.target.value }))}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="duration">Duration (minutes)</Label>
                                <Select 
                                  value={meetingForm.duration} 
                                  onValueChange={(value) => setMeetingForm(prev => ({ ...prev, duration: value }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="30">30 minutes</SelectItem>
                                    <SelectItem value="45">45 minutes</SelectItem>
                                    <SelectItem value="60">1 hour</SelectItem>
                                    <SelectItem value="90">1.5 hours</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="type">Meeting Type</Label>
                                <Select 
                                  value={meetingForm.type} 
                                  onValueChange={(value) => setMeetingForm(prev => ({ ...prev, type: value }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="individual">Individual</SelectItem>
                                    <SelectItem value="group">Group</SelectItem>
                                    <SelectItem value="parent">With Parents</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="notes">Notes (Optional)</Label>
                              <Textarea
                                id="notes"
                                placeholder="Add any specific topics or notes for the meeting..."
                                value={meetingForm.notes}
                                onChange={(e) => setMeetingForm(prev => ({ ...prev, notes: e.target.value }))}
                                rows={3}
                              />
                            </div>

                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setIsScheduleMeetingOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleScheduleMeeting}>
                                Schedule Meeting
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={isMarkAttendanceOpen} onOpenChange={setIsMarkAttendanceOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="flex flex-col items-center space-y-2 h-auto py-4 bg-orange-50 text-orange-600 hover:bg-orange-100"
                            variant="ghost"
                          >
                            <UserCheck className="w-6 h-6" />
                            <span className="text-sm">Mark Attendance</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Mark Attendance</DialogTitle>
                            <DialogDescription>
                              Mark attendance for your students for a specific date. Select all students who were present.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="attendance-date">Date</Label>
                              <Input
                                id="attendance-date"
                                type="date"
                                value={attendanceForm.date}
                                onChange={(e) => setAttendanceForm(prev => ({ ...prev, date: e.target.value }))}
                                max={new Date().toISOString().split('T')[0]}
                              />
                            </div>

                            <div>
                              <Label>Select Students ({attendanceForm.selectedStudents.size} selected)</Label>
                              <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                                {studentsWithRisk.map(student => (
                                  <div 
                                    key={student.id} 
                                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                                      attendanceForm.selectedStudents.has(student.id) 
                                        ? 'bg-blue-50 border-blue-200' 
                                        : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => toggleStudentAttendance(student.id)}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <Avatar className="w-8 h-8">
                                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">{student.name}</p>
                                        <p className="text-sm text-gray-600">{student.rollNo} • {student.year} Year</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Badge 
                                        className={`text-xs ${
                                          student.riskZone === 'green' ? 'bg-green-100 text-green-800' :
                                          student.riskZone === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-red-100 text-red-800'
                                        }`}
                                        variant="outline"
                                      >
                                        {student.riskZone.charAt(0).toUpperCase() + student.riskZone.slice(1)}
                                      </Badge>
                                      <div className={`w-4 h-4 rounded border-2 ${
                                        attendanceForm.selectedStudents.has(student.id) 
                                          ? 'bg-blue-600 border-blue-600' 
                                          : 'border-gray-300'
                                      }`}>
                                        {attendanceForm.selectedStudents.has(student.id) && (
                                          <UserCheck className="w-3 h-3 text-white" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setIsMarkAttendanceOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleMarkAttendance}>
                                Mark Attendance
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Students</h1>
                <p className="text-gray-600">Manage and view detailed information about your mentee students.</p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Student List ({filteredStudents.length})</span>
                    </CardTitle>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <Input
                          placeholder="Search by name or roll number..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Years</SelectItem>
                          <SelectItem value="1st">1st Year</SelectItem>
                          <SelectItem value="2nd">2nd Year</SelectItem>
                          <SelectItem value="3rd">3rd Year</SelectItem>
                          <SelectItem value="4th">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={riskZoneFilter} onValueChange={setRiskZoneFilter}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Risk Zones</SelectItem>
                          <SelectItem value="green">Green Zone</SelectItem>
                          <SelectItem value="yellow">Yellow Zone</SelectItem>
                          <SelectItem value="red">Red Zone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredStudents.map((student) => (
                      <div key={student.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4" onClick={() => onStudentSelect(student)}>
                            <Avatar>
                              <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{student.name}</h4>
                              <p className="text-sm text-gray-600">{student.rollNo} • {student.year} Year</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">Attendance: {student.attendance}%</p>
                              <p className="text-sm text-gray-600">Avg Marks: {student.avgMarks}%</p>
                              <p className="text-xs text-gray-500">Risk Score: {student.riskScore}/100</p>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <Badge 
                                className={`text-xs ${
                                  student.riskZone === 'green' ? 'bg-green-100 text-green-800 border-green-200' :
                                  student.riskZone === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                  'bg-red-100 text-red-800 border-red-200'
                                }`}
                                variant="outline"
                              >
                                {student.riskZone === 'green' && <CheckCircle className="w-3 h-3 mr-1" />}
                                {(student.riskZone === 'yellow' || student.riskZone === 'red') && <AlertTriangle className="w-3 h-3 mr-1" />}
                                {student.riskZone.charAt(0).toUpperCase() + student.riskZone.slice(1)} Zone
                              </Badge>
                              <Badge variant={student.status === 'Active' ? 'outline' : 'destructive'} className="text-xs">
                                {student.status}
                              </Badge>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onStudentSelect(student)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Risk Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Analytics</h1>
                <p className="text-gray-600">Comprehensive analysis of student risk levels and performance trends.</p>
              </div>

              <RiskAnalytics 
                riskStats={riskStats} 
                totalStudents={studentStats.total} 
                onViewStudents={handleViewStudentsByRisk}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};