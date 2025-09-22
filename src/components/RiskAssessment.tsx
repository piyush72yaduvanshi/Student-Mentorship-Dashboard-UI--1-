import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  Shield, 
  TrendingDown, 
  TrendingUp,
  DollarSign,
  GraduationCap,
  Calendar,
  Target
} from 'lucide-react';

export interface RiskFactors {
  marks: number;
  attendance: number;
  feesPaid: number;
  totalFees: number;
}

export interface RiskAssessment {
  zone: 'green' | 'yellow' | 'red';
  score: number;
  factors: {
    academic: { score: number; status: 'good' | 'moderate' | 'poor'; message: string };
    attendance: { score: number; status: 'good' | 'moderate' | 'poor'; message: string };
    financial: { score: number; status: 'good' | 'moderate' | 'poor'; message: string };
  };
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
}

export const calculateRiskAssessment = (factors: RiskFactors): RiskAssessment => {
  const { marks, attendance, feesPaid, totalFees } = factors;
  
  // Academic Risk Assessment (40% weight)
  const academicScore = Math.min(100, Math.max(0, marks));
  let academicStatus: 'good' | 'moderate' | 'poor';
  let academicMessage: string;
  
  if (academicScore >= 85) {
    academicStatus = 'good';
    academicMessage = 'Excellent academic performance';
  } else if (academicScore >= 70) {
    academicStatus = 'moderate';
    academicMessage = 'Satisfactory performance, room for improvement';
  } else {
    academicStatus = 'poor';
    academicMessage = 'Poor academic performance requires immediate attention';
  }

  // Attendance Risk Assessment (35% weight)
  const attendanceScore = Math.min(100, Math.max(0, attendance));
  let attendanceStatus: 'good' | 'moderate' | 'poor';
  let attendanceMessage: string;
  
  if (attendanceScore >= 90) {
    attendanceStatus = 'good';
    attendanceMessage = 'Excellent attendance record';
  } else if (attendanceScore >= 75) {
    attendanceStatus = 'moderate';
    attendanceMessage = 'Attendance needs improvement';
  } else {
    attendanceStatus = 'poor';
    attendanceMessage = 'Poor attendance - critical issue';
  }

  // Financial Risk Assessment (25% weight)
  const feePaymentPercentage = (feesPaid / totalFees) * 100;
  const financialScore = Math.min(100, Math.max(0, feePaymentPercentage));
  let financialStatus: 'good' | 'moderate' | 'poor';
  let financialMessage: string;
  
  if (financialScore >= 80) {
    financialStatus = 'good';
    financialMessage = 'Fees are up to date';
  } else if (financialScore >= 50) {
    financialStatus = 'moderate';
    financialMessage = 'Some pending fees require attention';
  } else {
    financialStatus = 'poor';
    financialMessage = 'Significant outstanding fees';
  }

  // Calculate overall risk score (weighted average)
  const overallScore = (
    (academicScore * 0.4) +
    (attendanceScore * 0.35) +
    (financialScore * 0.25)
  );

  // Determine risk zone
  let zone: 'green' | 'yellow' | 'red';
  let urgency: 'low' | 'medium' | 'high';
  
  if (overallScore >= 80 && academicStatus !== 'poor' && attendanceStatus !== 'poor') {
    zone = 'green';
    urgency = 'low';
  } else if (overallScore >= 60 || (academicStatus === 'moderate' || attendanceStatus === 'moderate')) {
    zone = 'yellow';
    urgency = 'medium';
  } else {
    zone = 'red';
    urgency = 'high';
  }

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (academicStatus === 'poor') {
    recommendations.push('Schedule immediate academic counseling session');
    recommendations.push('Arrange additional tutoring support');
  } else if (academicStatus === 'moderate') {
    recommendations.push('Consider study group participation');
    recommendations.push('Schedule mentor meeting to discuss study strategies');
  }

  if (attendanceStatus === 'poor') {
    recommendations.push('Investigate attendance barriers and provide support');
    recommendations.push('Implement attendance monitoring plan');
  } else if (attendanceStatus === 'moderate') {
    recommendations.push('Send attendance reminder notifications');
  }

  if (financialStatus === 'poor') {
    recommendations.push('Discuss payment plan options');
    recommendations.push('Explore scholarship/financial aid opportunities');
  } else if (financialStatus === 'moderate') {
    recommendations.push('Send fee payment reminders');
  }

  if (zone === 'green' && recommendations.length === 0) {
    recommendations.push('Continue current performance level');
    recommendations.push('Consider leadership or mentoring opportunities');
  }

  return {
    zone,
    score: Math.round(overallScore),
    factors: {
      academic: { score: Math.round(academicScore), status: academicStatus, message: academicMessage },
      attendance: { score: Math.round(attendanceScore), status: attendanceStatus, message: attendanceMessage },
      financial: { score: Math.round(financialScore), status: financialStatus, message: financialMessage }
    },
    recommendations,
    urgency
  };
};

interface RiskAssessmentDisplayProps {
  assessment: RiskAssessment;
  studentName: string;
  viewMode?: 'student' | 'mentor' | 'admin';
}

export const RiskAssessmentDisplay: React.FC<RiskAssessmentDisplayProps> = ({ 
  assessment, 
  studentName, 
  viewMode = 'student' 
}) => {
  const { zone, score, factors, recommendations, urgency } = assessment;

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'red': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getZoneIcon = (zone: string) => {
    switch (zone) {
      case 'green': return <CheckCircle className="w-5 h-5" />;
      case 'yellow': return <AlertTriangle className="w-5 h-5" />;
      case 'red': return <AlertTriangle className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Zone Header */}
      <Card className={`border-2 ${getZoneColor(zone)}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getZoneIcon(zone)}
              <div>
                <CardTitle className="text-xl">
                  {zone.charAt(0).toUpperCase() + zone.slice(1)} Zone
                </CardTitle>
                <p className="text-sm opacity-75">
                  {viewMode === 'student' ? 'Your current' : `${studentName}'s`} academic risk level
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{score}/100</div>
              <div className="text-sm opacity-75">Overall Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <span>Risk Level: {urgency.charAt(0).toUpperCase() + urgency.slice(1)}</span>
            <Badge variant={urgency === 'high' ? 'destructive' : urgency === 'medium' ? 'secondary' : 'default'}>
              {urgency.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Risk Factors */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Academic Performance */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Academic</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`font-medium ${getStatusColor(factors.academic.status)}`}>
                {factors.academic.score}%
              </span>
              {factors.academic.status === 'good' ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </div>
            <Progress 
              value={factors.academic.score} 
              className="h-2"
              // Apply custom color based on status
              style={{ 
                backgroundColor: '#f3f4f6',
              }}
            />
            <p className="text-xs text-gray-600">{factors.academic.message}</p>
          </CardContent>
        </Card>

        {/* Attendance */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">Attendance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`font-medium ${getStatusColor(factors.attendance.status)}`}>
                {factors.attendance.score}%
              </span>
              {factors.attendance.status === 'good' ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </div>
            <Progress 
              value={factors.attendance.score} 
              className="h-2"
            />
            <p className="text-xs text-gray-600">{factors.attendance.message}</p>
          </CardContent>
        </Card>

        {/* Financial */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">Financial</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`font-medium ${getStatusColor(factors.financial.status)}`}>
                {factors.financial.score}%
              </span>
              {factors.financial.status === 'good' ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </div>
            <Progress 
              value={factors.financial.score} 
              className="h-2"
            />
            <p className="text-xs text-gray-600">{factors.financial.message}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <CardTitle>Recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <Alert key={index} className="py-3">
                  <AlertDescription className="flex items-start space-x-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>{recommendation}</span>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Items for Mentors/Admins */}
      {(viewMode === 'mentor' || viewMode === 'admin') && urgency !== 'low' && (
        <Alert className={urgency === 'high' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            <strong>Action Required:</strong> This student requires {urgency} priority attention. 
            {urgency === 'high' 
              ? ' Schedule immediate intervention meeting.' 
              : ' Monitor progress and provide additional support.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};