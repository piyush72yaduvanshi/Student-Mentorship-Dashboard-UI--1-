import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Users, Target, Eye } from 'lucide-react';
import { Button } from './ui/button';

interface RiskAnalyticsProps {
  riskStats: {
    green: number;
    yellow: number;
    red: number;
  };
  totalStudents: number;
  onViewStudents?: (riskZone?: string) => void;
}

export const RiskAnalytics: React.FC<RiskAnalyticsProps> = ({ riskStats, totalStudents, onViewStudents }) => {
  // Prepare data for charts
  const barChartData = [
    {
      name: 'Green Zone',
      students: riskStats.green,
      percentage: Math.round((riskStats.green / totalStudents) * 100),
      fill: '#22c55e'
    },
    {
      name: 'Yellow Zone',
      students: riskStats.yellow,
      percentage: Math.round((riskStats.yellow / totalStudents) * 100),
      fill: '#eab308'
    },
    {
      name: 'Red Zone',
      students: riskStats.red,
      percentage: Math.round((riskStats.red / totalStudents) * 100),
      fill: '#ef4444'
    }
  ];

  const pieChartData = [
    { name: 'Low Risk', value: riskStats.green, color: '#22c55e' },
    { name: 'Moderate Risk', value: riskStats.yellow, color: '#eab308' },
    { name: 'High Risk', value: riskStats.red, color: '#ef4444' }
  ];

  const COLORS = ['#22c55e', '#eab308', '#ef4444'];

  // Calculate risk insights
  const highRiskPercentage = Math.round((riskStats.red / totalStudents) * 100);
  const needsAttentionCount = riskStats.yellow + riskStats.red;
  const needsAttentionPercentage = Math.round((needsAttentionCount / totalStudents) * 100);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Students: {payload[0].value}
          </p>
          <p className="text-gray-600">
            {payload[0].payload.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">High Risk</p>
                <p className="text-2xl font-bold text-red-700">{highRiskPercentage}%</p>
                <p className="text-xs text-red-600">{riskStats.red} students</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                {onViewStudents && riskStats.red > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs border-red-300 text-red-700 hover:bg-red-50"
                    onClick={() => onViewStudents('red')}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Students
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Needs Attention</p>
                <p className="text-2xl font-bold text-yellow-700">{needsAttentionPercentage}%</p>
                <p className="text-xs text-yellow-600">{needsAttentionCount} students</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Target className="w-8 h-8 text-yellow-500" />
                {onViewStudents && riskStats.yellow > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                    onClick={() => onViewStudents('yellow')}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Students
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Performing Well</p>
                <p className="text-2xl font-bold text-green-700">
                  {Math.round((riskStats.green / totalStudents) * 100)}%
                </p>
                <p className="text-xs text-green-600">{riskStats.green} students</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <TrendingUp className="w-8 h-8 text-green-500" />
                {onViewStudents && riskStats.green > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs border-green-300 text-green-700 hover:bg-green-50"
                    onClick={() => onViewStudents('green')}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Students
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Risk Zone Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="students" 
                    radius={[4, 4, 0, 0]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Risk Assessment Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: string) => [value, `${name} Students`]}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Recommended Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskStats.red > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Critical Priority</h4>
                <p className="text-sm text-red-700 mb-3">
                  {riskStats.red} student{riskStats.red > 1 ? 's' : ''} in the red zone require immediate intervention.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Schedule individual meetings
                  </span>
                  <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Academic support plan
                  </span>
                  <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Parent/guardian contact
                  </span>
                </div>
              </div>
            )}

            {riskStats.yellow > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Medium Priority</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  {riskStats.yellow} student{riskStats.yellow > 1 ? 's' : ''} in the yellow zone need monitoring and support.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Weekly check-ins
                  </span>
                  <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Study groups
                  </span>
                  <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Attendance monitoring
                  </span>
                </div>
              </div>
            )}

            {riskStats.green > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Success Recognition</h4>
                <p className="text-sm text-green-700 mb-3">
                  {riskStats.green} student{riskStats.green > 1 ? 's' : ''} are performing excellently. Consider leadership opportunities.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Peer mentoring roles
                  </span>
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Advanced projects
                  </span>
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Recognition programs
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};