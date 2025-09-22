import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { 
  Plus, 
  Trash2, 
  Save, 
  Eye,
  ArrowLeft,
  Star,
  Type,
  CheckSquare,
  List,
  MessageSquare
} from 'lucide-react';
import { SurveyQuestion } from './SurveyData';

interface CreateSurveyFormProps {
  onBack: () => void;
  onSave: (surveyData: any) => void;
}

export const CreateSurveyForm: React.FC<CreateSurveyFormProps> = ({ onBack, onSave }) => {
  const [surveyData, setSurveyData] = useState({
    title: '',
    description: '',
    targetAudience: '',
    endDate: '',
    questions: [] as SurveyQuestion[]
  });

  const [currentQuestion, setCurrentQuestion] = useState<Partial<SurveyQuestion>>({
    type: 'text',
    question: '',
    options: [],
    required: false
  });

  const questionTypes = [
    { value: 'text', label: 'Short Text', icon: Type },
    { value: 'textarea', label: 'Long Text', icon: MessageSquare },
    { value: 'radio', label: 'Multiple Choice', icon: List },
    { value: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
    { value: 'rating', label: 'Rating Scale', icon: Star }
  ];

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...(prev.options || []), '']
    }));
  };

  const updateOption = (index: number, value: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options?.map((opt, i) => i === index ? value : opt) || []
    }));
  };

  const removeOption = (index: number) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || []
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.question) return;

    const newQuestion: SurveyQuestion = {
      id: `q${Date.now()}`,
      type: currentQuestion.type as SurveyQuestion['type'],
      question: currentQuestion.question,
      options: currentQuestion.options?.filter(opt => opt.trim() !== '') || undefined,
      required: currentQuestion.required || false
    };

    setSurveyData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    setCurrentQuestion({
      type: 'text',
      question: '',
      options: [],
      required: false
    });
  };

  const removeQuestion = (index: number) => {
    setSurveyData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (!surveyData.title || !surveyData.description || surveyData.questions.length === 0) {
      alert('Please fill in all required fields and add at least one question.');
      return;
    }

    const survey = {
      ...surveyData,
      id: Date.now().toString(),
      status: 'Draft',
      createdDate: new Date().toISOString().split('T')[0],
      responses: 0
    };

    onSave(survey);
  };

  const needsOptions = currentQuestion.type === 'radio' || currentQuestion.type === 'checkbox';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Surveys
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Survey</h1>
            <p className="text-gray-600">Design and customize your survey questions</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save Survey
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Survey Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Survey Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Survey Title</Label>
                <Input
                  id="title"
                  value={surveyData.title}
                  onChange={(e) => setSurveyData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter survey title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={surveyData.description}
                  onChange={(e) => setSurveyData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose of this survey"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select onValueChange={(value) => setSurveyData(prev => ({ ...prev, targetAudience: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Students">All Students</SelectItem>
                    <SelectItem value="1st Year">1st Year Students</SelectItem>
                    <SelectItem value="2nd Year">2nd Year Students</SelectItem>
                    <SelectItem value="3rd Year">3rd Year Students</SelectItem>
                    <SelectItem value="4th Year">4th Year Students</SelectItem>
                    <SelectItem value="Mentors">Mentors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={surveyData.endDate}
                  onChange={(e) => setSurveyData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Question */}
          <Card>
            <CardHeader>
              <CardTitle>Add Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Question Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {questionTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setCurrentQuestion(prev => ({ ...prev, type: type.value as SurveyQuestion['type'] }))}
                        className={`p-3 rounded-lg border-2 transition-colors text-left ${
                          currentQuestion.type === type.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm font-medium">{type.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="questionText">Question</Label>
                <Textarea
                  id="questionText"
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Enter your question here"
                  rows={2}
                />
              </div>

              {needsOptions && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )) || []}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="required"
                  checked={currentQuestion.required}
                  onCheckedChange={(checked) => setCurrentQuestion(prev => ({ ...prev, required: !!checked }))}
                />
                <Label htmlFor="required">Required question</Label>
              </div>

              <Button
                onClick={addQuestion}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                disabled={!currentQuestion.question}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Questions Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Questions ({surveyData.questions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {surveyData.questions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No questions added yet</p>
                  <p className="text-sm">Add your first question to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {surveyData.questions.map((question, index) => (
                    <div key={question.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{question.type}</Badge>
                            {question.required && <Badge variant="destructive">Required</Badge>}
                          </div>
                          <p className="font-medium mb-2">{question.question}</p>
                          {question.options && (
                            <ul className="text-sm text-gray-600 space-y-1">
                              {question.options.map((option, idx) => (
                                <li key={idx}>• {option}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};