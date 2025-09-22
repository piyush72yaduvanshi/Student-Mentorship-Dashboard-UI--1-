import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { surveyStorage } from '../utils/localStorage';
import { GraduationCap, Users, BarChart3, BookOpen, FileText, Clock, Target, LogOut } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onSurveySelect?: (surveyId: string) => void;
  currentUser?: any;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSurveySelect, currentUser }) => {
  const activeSurveys = surveyStorage.getActiveSurveys();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">EduMentor</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</a>
              <a href="#surveys" className="text-gray-600 hover:text-gray-900 transition-colors">Surveys</a>
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {currentUser.name || currentUser.username}
                  </span>
                  <Button 
                    onClick={() => {
                      // Navigate to appropriate dashboard based on role
                      switch (currentUser.role) {
                        case 'admin':
                          onNavigate('admin-dashboard');
                          break;
                        case 'mentor':
                          onNavigate('mentor-dashboard');
                          break;
                        case 'student':
                          onNavigate('student-dashboard');
                          break;
                        default:
                          onNavigate('login');
                      }
                    }}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    Dashboard
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => onNavigate('login')}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Login
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Student Mentorship & Survey Management System
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Empowering educational institutions with comprehensive tools for student mentorship, 
                  performance tracking, and feedback management. Connect mentors with students and drive academic excellence.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => onNavigate('login')}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3"
                  size="lg"
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3"
                  size="lg"
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1659080927204-de39f5fdfb02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBtZW50b3JzaGlwJTIwc3R1ZGVudHMlMjBtb2Rlcm58ZW58MXx8fHwxNzU4Mzk2NDcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Student mentorship"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-r from-blue-600 to-green-600 rounded-full opacity-20"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-green-600 to-blue-600 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Comprehensive Management Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage student mentorship programs, track academic progress, and gather valuable feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-8 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Student Management</h3>
              <p className="text-gray-600">
                Efficiently manage student data, track academic progress, and maintain comprehensive records for all year groups.
              </p>
            </div>

            <div className="text-center space-y-4 p-8 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Analytics & Reporting</h3>
              <p className="text-gray-600">
                Gain insights through detailed analytics, performance charts, and comprehensive reporting tools.
              </p>
            </div>

            <div className="text-center space-y-4 p-8 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Survey Management</h3>
              <p className="text-gray-600">
                Create, distribute, and analyze surveys to gather valuable feedback from students and improve programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Surveys Section */}
      {activeSurveys.length > 0 && (
        <section id="surveys" className="py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Current Surveys</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Participate in our ongoing surveys and help us improve the educational experience for everyone.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSurveys.map((survey) => (
                <Card key={survey.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{survey.title}</CardTitle>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{survey.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Target className="w-4 h-4" />
                        <span>Target: {survey.targetAudience}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Ends: {survey.endDate}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{survey.responses} responses so far</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => onSurveySelect && onSurveySelect(survey.id)}
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Take Survey
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">
                Want to see all surveys or manage them? 
              </p>
              <Button 
                onClick={() => onNavigate('login')}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Login to Access Dashboard
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">EduMentor</span>
          </div>
          <p className="text-gray-400">© 2024 EduMentor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};