import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Survey, SurveyQuestion } from './SurveyData';
import { 
  ArrowLeft, 
  Send, 
  Star,
  CheckCircle,
  Clock
} from 'lucide-react';

interface SurveyFormProps {
  survey: Survey;
  onBack: () => void;
  onSubmit: (responses: Record<string, any>) => void;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ survey, onBack, onSubmit }) => {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Check for required questions
    const requiredQuestions = survey.questions.filter(q => q.required);
    const missingResponses = requiredQuestions.filter(q => !responses[q.id]);

    if (missingResponses.length > 0) {
      alert('Please answer all required questions before submitting.');
      return;
    }

    onSubmit(responses);
    setIsSubmitted(true);
  };

  const renderQuestion = (question: SurveyQuestion) => {
    const response = responses[question.id];

    switch (question.type) {
      case 'text':
        return (
          <Input
            value={response || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder="Enter your answer"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={response || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder="Enter your detailed response"
            rows={4}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            value={response || ''}
            onValueChange={(value) => handleResponse(question.id, value)}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={Array.isArray(response) ? response.includes(option) : false}
                  onCheckedChange={(checked) => {
                    const currentResponses = Array.isArray(response) ? response : [];
                    if (checked) {
                      handleResponse(question.id, [...currentResponses, option]);
                    } else {
                      handleResponse(question.id, currentResponses.filter(item => item !== option));
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'rating':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleResponse(question.id, rating)}
                  className={`p-2 rounded-lg transition-colors ${
                    response >= rating
                      ? 'text-yellow-500'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Very Poor</span>
              <span>Excellent</span>
            </div>
            {response && (
              <p className="text-sm text-blue-600">You rated: {response}/5</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your response has been successfully submitted. We appreciate your feedback and will use it to improve our services.
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <p className="text-green-800 font-medium">Great work!</p>
              <p className="text-green-700 text-sm">You've completed the survey. Your input helps us make better decisions.</p>
            </div>
            <Button onClick={onBack} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              Back to Surveys
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;
  const currentQuestion = survey.questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Surveys
        </Button>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Ends {survey.endDate}</span>
        </div>
      </div>

      {/* Survey Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{survey.title}</CardTitle>
              <p className="text-gray-600 mt-2">{survey.description}</p>
            </div>
            <Badge>{survey.targetAudience}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">
              {currentQuestionIndex + 1} of {survey.questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-600 text-white text-sm font-medium px-2 py-1 rounded">
              {currentQuestionIndex + 1}
            </span>
            <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
            {currentQuestion.required && (
              <Badge variant="destructive" className="text-xs">Required</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {renderQuestion(currentQuestion)}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="flex space-x-3">
          {currentQuestionIndex === survey.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Survey
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              Next Question
            </Button>
          )}
        </div>
      </div>

      {/* Question Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {survey.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : responses[survey.questions[index].id]
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};