import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { MentorDashboard } from './components/MentorDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { SurveyForm } from './components/SurveyForm';
import { authStorage, surveyStorage, dataManager } from './utils/localStorage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app and check for existing authentication
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize localStorage data
        dataManager.initialize();
        
        // Check if user is already logged in
        const existingAuth = authStorage.getCurrentUser();
        if (existingAuth) {
          setCurrentUser(existingAuth);
          setUserRole(existingAuth.role);
          switch (existingAuth.role) {
            case 'admin':
              setCurrentPage('admin-dashboard');
              break;
            case 'mentor':
              setCurrentPage('mentor-dashboard');
              break;
            case 'student':
              setCurrentPage('student-dashboard');
              break;
            default:
              setCurrentPage('landing');
          }
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleLogin = (user) => {
    // Save auth state to localStorage
    authStorage.setCurrentUser(user);
    setCurrentUser(user);
    setUserRole(user.role);
    
    switch (user.role) {
      case 'admin':
        setCurrentPage('admin-dashboard');
        break;
      case 'mentor':
        setCurrentPage('mentor-dashboard');
        break;
      case 'student':
        setCurrentPage('student-dashboard');
        break;
      default:
        setCurrentPage('landing');
    }
  };

  const handleLogout = () => {
    // Clear auth state from localStorage
    authStorage.logout();
    setCurrentUser(null);
    setUserRole(null);
    setSelectedStudent(null);
    setSelectedSurvey(null);
    setCurrentPage('landing');
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setCurrentPage('mentor-student-view');
  };

  const handleBackToMentor = () => {
    setSelectedStudent(null);
    setCurrentPage('mentor-dashboard');
  };

  const handleSurveySelect = (surveyId) => {
    const survey = surveyStorage.getSurveyById(surveyId);
    setSelectedSurvey(survey);
    setCurrentPage('survey-form');
  };

  const handleSurveySubmit = (responses) => {
    console.log('Survey responses:', responses);
    // Save survey response to localStorage
    if (currentUser && selectedSurvey) {
      const responseData = {
        surveyId: selectedSurvey.id,
        userId: currentUser.id,
        userRole: currentUser.role,
        responses: responses,
        surveyTitle: selectedSurvey.title
      };
      
      // Note: Import surveyResponseStorage when we update this
      // surveyResponseStorage.addResponse(responseData);
    }
    
    setSelectedSurvey(null);
    setCurrentPage('landing');
  };

  const handleBackToLanding = () => {
    setSelectedSurvey(null);
    setCurrentPage('landing');
  };

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading application...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} onSurveySelect={handleSurveySelect} currentUser={currentUser} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'admin-dashboard':
        return <AdminDashboard user={currentUser} onLogout={handleLogout} onBack={() => setCurrentPage('landing')} />;
      case 'mentor-dashboard':
        return <MentorDashboard user={currentUser} onLogout={handleLogout} onStudentSelect={handleStudentSelect} onBack={() => setCurrentPage('landing')} />;
      case 'student-dashboard':
        return <StudentDashboard user={currentUser} onLogout={handleLogout} onBack={() => setCurrentPage('landing')} />;
      case 'mentor-student-view':
        return (
          <StudentDashboard 
            user={currentUser}
            onLogout={handleLogout} 
            student={selectedStudent}
            onBack={handleBackToMentor}
            viewMode="mentor"
          />
        );
      case 'survey-form':
        return selectedSurvey ? (
          <SurveyForm 
            survey={selectedSurvey}
            user={currentUser}
            onBack={handleBackToLanding}
            onSubmit={handleSurveySubmit}
          />
        ) : <LandingPage onNavigate={setCurrentPage} onSurveySelect={handleSurveySelect} currentUser={currentUser} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} onSurveySelect={handleSurveySelect} currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
    </div>
  );
}