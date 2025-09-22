import { surveyStorage } from '../utils/localStorage';

// Centralized survey data management
export interface SurveyQuestion {
  id: string;
  type: 'text' | 'radio' | 'checkbox' | 'rating' | 'textarea';
  question: string;
  options?: string[];
  required: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'Draft' | 'Active' | 'Completed';
  createdDate: string;
  endDate: string;
  responses: number;
  targetAudience: 'All Students' | '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Mentors';
  questions: SurveyQuestion[];
}

export const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'Academic Performance Survey',
    description: 'Help us understand how we can improve our academic programs and support systems.',
    status: 'Active',
    createdDate: '2024-09-01',
    endDate: '2024-10-01',
    responses: 45,
    targetAudience: 'All Students',
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

// Updated functions to use localStorage
export const getActiveSurveys = (): Survey[] => {
  return surveyStorage.getActiveSurveys();
};

export const getSurveyById = (id: string): Survey | undefined => {
  return surveyStorage.getSurveyById(id);
};

export const getAllSurveys = (): Survey[] => {
  return surveyStorage.getAllSurveys();
};

export const getSurveysByStatus = (status: string): Survey[] => {
  return surveyStorage.getSurveysByStatus(status);
};

export const addSurvey = (surveyData: Partial<Survey>): Survey => {
  return surveyStorage.addSurvey(surveyData);
};

export const updateSurvey = (id: string, surveyData: Partial<Survey>): Survey | null => {
  return surveyStorage.updateSurvey(id, surveyData);
};

export const deleteSurvey = (id: string): Survey[] => {
  return surveyStorage.deleteSurvey(id);
};