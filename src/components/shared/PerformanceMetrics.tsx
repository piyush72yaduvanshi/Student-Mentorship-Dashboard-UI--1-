import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Award, Calendar, BookOpen, DollarSign, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface PerformanceMetricsProps {
  averageMarks: number;
  averageAttendance: number;
  subjectCount: number;
  pendingFees: number;
  riskZone?: 'green' | 'yellow' | 'red';
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  averageMarks,
  averageAttendance,
  subjectCount,
  pendingFees,
  riskZone
}) => {
  // Risk zone metric
  const getRiskZoneConfig = () => {
    if (!riskZone) return null;
    
    switch (riskZone) {
      case 'green':
        return {
          title: 'Risk Status',
          value: 'Safe Zone',
          icon: CheckCircle,
          gradient: 'from-green-600 to-green-700',
          iconColor: 'text-green-200'
        };
      case 'yellow':
        return {
          title: 'Risk Status',
          value: 'Monitor Zone',
          icon: AlertTriangle,
          gradient: 'from-yellow-600 to-yellow-700',
          iconColor: 'text-yellow-200'
        };
      case 'red':
        return {
          title: 'Risk Status',
          value: 'Alert Zone',
          icon: AlertTriangle,
          gradient: 'from-red-600 to-red-700',
          iconColor: 'text-red-200'
        };
      default:
        return null;
    }
  };

  const baseMetrics = [
    {
      title: 'Average Marks',
      value: `${averageMarks}%`,
      icon: Award,
      gradient: 'from-blue-600 to-blue-700',
      iconColor: 'text-blue-200'
    },
    {
      title: 'Attendance',
      value: `${averageAttendance}%`,
      icon: Calendar,
      gradient: 'from-green-600 to-green-700',
      iconColor: 'text-green-200'
    },
    {
      title: 'Subjects',
      value: subjectCount.toString(),
      icon: BookOpen,
      gradient: 'from-purple-600 to-purple-700',
      iconColor: 'text-purple-200'
    },
    {
      title: 'Pending Fees',
      value: `₹${pendingFees.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-orange-600 to-orange-700',
      iconColor: 'text-orange-200'
    }
  ];

  const riskZoneConfig = getRiskZoneConfig();
  const metrics = riskZoneConfig ? [riskZoneConfig, ...baseMetrics] : baseMetrics;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${riskZone ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6`}>
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Card key={index} className={`bg-gradient-to-r ${metric.gradient} text-white`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <IconComponent className={`w-8 h-8 ${metric.iconColor}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};