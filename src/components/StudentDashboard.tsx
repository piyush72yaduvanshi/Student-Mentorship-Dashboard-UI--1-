import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateStudentData } from './StudentData';
import { PerformanceMetrics } from './shared/PerformanceMetrics';
import { RiskAssessmentDisplay, calculateRiskAssessment } from './RiskAssessment';
import { 
  GraduationCap,
  LogOut,
  BarChart3,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Calendar,
  DollarSign,
  Award,
  Shield
} from 'lucide-react';

interface StudentDashboardProps {
  onLogout: () => void;
  student?: any;
  onBack?: () => void;
  viewMode?: 'student' | 'mentor';
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  onLogout, 
  student, 
  onBack, 
  viewMode = 'student' 
}) => {
  // Use provided student data or generate default data
  const studentData = generateStudentData(
    student?.id || 1, 
    student ? {
      ...student,
      year: student.year + ' Year',
      department: student.department || 'Computer Science',
      mentor: student.mentor || 'Dr. Sarah Miller'
    } : null
  );

  const {
    studentInfo,
    attendanceData,
    performanceData,
    subjects,
    averageMarks,
    averageAttendance,
    feeDetails,
    surveys,
    riskFactors
  } = studentData;

  // Calculate risk assessment
  const riskAssessment = calculateRiskAssessment(riskFactors);

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

          <div className="flex items-center space-x-3 mb-8 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/student-avatar.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{studentInfo.name}</p>
              <p className="text-sm text-gray-600">{studentInfo.rollNo}</p>
              <p className="text-xs text-gray-500">{studentInfo.year}</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Department</p>
              <p className="text-sm text-gray-600">{studentInfo.department}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Mentor</p>
              <p className="text-sm text-gray-600">{studentInfo.mentor}</p>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 space-y-2">
            {onBack && (
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 w-full"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{viewMode === 'mentor' ? 'Back to Dashboard' : 'Back to Landing'}</span>
              </Button>
            )}
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 w-full"
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
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {viewMode === 'mentor' ? `${studentInfo.name}'s Dashboard` : 'Student Dashboard'}
              </h1>
              <p className="text-gray-600">
                {viewMode === 'mentor' 
                  ? `Detailed view of ${studentInfo.name}'s academic progress and performance.`
                  : 'Track your academic progress and performance.'
                }
              </p>
            </div>

            {/* Risk Assessment - Priority section for mentors/admins */}
            {(viewMode === 'mentor' || riskAssessment.zone !== 'green') && (
              <RiskAssessmentDisplay 
                assessment={riskAssessment}
                studentName={studentInfo.name}
                viewMode={viewMode}
              />
            )}

            {/* Overview Cards - Using shared component */}
            <PerformanceMetrics
              averageMarks={averageMarks}
              averageAttendance={averageAttendance}
              subjectCount={subjects.length}
              pendingFees={feeDetails.pendingFees}
              riskZone={riskAssessment.zone}
            />

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Attendance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Attendance Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={attendanceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {attendanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Present (85%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Absent (15%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Performance Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="marks" stroke="#3b82f6" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Fee Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Fee Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Total Fees</span>
                      <span>₹{feeDetails.totalFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Paid</span>
                      <span className="text-green-600">₹{feeDetails.paidFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Pending</span>
                      <span className="text-red-600">₹{feeDetails.pendingFees.toLocaleString()}</span>
                    </div>
                    <Progress value={(feeDetails.paidFees / feeDetails.totalFees) * 100} className="mt-2" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Last Payment: {feeDetails.lastPayment}</p>
                    <p>Next Due: {feeDetails.nextDueDate}</p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    Pay Fees
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Subject-wise Details */}
            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Subject</th>
                        <th className="text-center p-3">Marks</th>
                        <th className="text-center p-3">Attendance</th>
                        <th className="text-center p-3">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{subject.name}</td>
                          <td className="p-3 text-center">
                            <Badge variant={subject.marks >= 85 ? 'default' : subject.marks >= 70 ? 'secondary' : 'destructive'}>
                              {subject.marks}%
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <Badge variant={subject.attendance >= 85 ? 'default' : subject.attendance >= 75 ? 'secondary' : 'destructive'}>
                              {subject.attendance}%
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <Badge variant="outline">{subject.grade}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t bg-gray-50">
                        <td className="p-3 font-semibold">Total/Average</td>
                        <td className="p-3 text-center font-semibold">{averageMarks}%</td>
                        <td className="p-3 text-center font-semibold">{averageAttendance}%</td>
                        <td className="p-3 text-center">-</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Survey Results */}
            <Card>
              <CardHeader>
                <CardTitle>Survey Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {surveys.map((survey) => (
                    <div key={survey.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{survey.title}</h4>
                        <p className="text-sm text-gray-600">Date: {survey.date}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={survey.status === 'Completed' ? 'default' : 'secondary'}>
                          {survey.status === 'Completed' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {survey.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {survey.status === 'Completed' ? 'View Results' : 'Take Survey'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {surveys.filter(s => s.status === 'Completed').length > 0 && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
                    <Award className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="text-green-800 font-medium">Great work!</p>
                    <p className="text-green-700 text-sm">You've completed most of your surveys. Keep up the excellent participation!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};