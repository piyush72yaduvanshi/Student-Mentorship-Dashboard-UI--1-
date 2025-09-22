import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { userStorage } from '../utils/localStorage';

interface LoginPageProps {
  onLogin: (user: any) => void;
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
  const [formData, setFormData] = useState({
    role: '',
    userId: '',
    password: ''
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registerData, setRegisterData] = useState({
    role: '',
    name: '',
    email: '',
    userId: '',
    password: ''
  });
  const [registerError, setRegisterError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    if (!formData.role || !formData.userId || !formData.password) {
      setLoginError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Authenticate user with localStorage
      const user = userStorage.getUserByCredentials(formData.userId, formData.password);
      
      if (user && user.role === formData.role) {
        onLogin(user);
      } else {
        setLoginError('Invalid credentials or role mismatch');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOTPVerification(true);
  };

  const handleOTPVerification = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock OTP verification
    setShowOTPVerification(false);
    setShowForgotPassword(false);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setIsLoading(true);

    if (!registerData.role || !registerData.name || !registerData.email || !registerData.userId || !registerData.password) {
      setRegisterError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Check if user already exists
      const existingUser = userStorage.getUserByCredentials(registerData.userId, registerData.password);
      if (existingUser) {
        setRegisterError('User with this username already exists');
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser = userStorage.addUser({
        username: registerData.userId,
        password: registerData.password,
        role: registerData.role,
        name: registerData.name,
        email: registerData.email
      });

      if (newUser) {
        // Auto-login the new user
        onLogin(newUser);
      } else {
        setRegisterError('Failed to create account. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegisterError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showRegister) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold">EduMentor</span>
            </div>
            <CardTitle>Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {registerError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {registerError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="register-role">Role</Label>
                <Select onValueChange={(value) => setRegisterData({...registerData, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <Input 
                  id="register-name" 
                  value={registerData.name}
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  placeholder="Enter your full name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input 
                  id="register-email" 
                  type="email" 
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  placeholder="Enter your email" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-userId">User ID</Label>
                <Input 
                  id="register-userId" 
                  value={registerData.userId}
                  onChange={(e) => setRegisterData({...registerData, userId: e.target.value})}
                  placeholder="Enter your user ID" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input 
                  id="register-password" 
                  type="password" 
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  placeholder="Enter your password" 
                />
              </div>
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
              <Button 
                type="button"
                variant="ghost" 
                className="w-full"
                onClick={() => setShowRegister(false)}
              >
                Back to Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Landing */}
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold">EduMentor</span>
            </div>
            <CardTitle>
              {showForgotPassword ? 'Reset Password' : showOTPVerification ? 'Verify OTP' : 'Welcome Back'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showOTPVerification ? (
              <form onSubmit={handleOTPVerification} className="space-y-4">
                <Alert>
                  <AlertDescription>
                    We've sent a verification code to {email}. Please enter the 6-digit code below.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Verify Code
                </Button>
                <Button 
                  type="button"
                  variant="ghost" 
                  className="w-full"
                  onClick={() => {
                    setShowOTPVerification(false);
                    setShowForgotPassword(false);
                  }}
                >
                  Back to Login
                </Button>
              </form>
            ) : showForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Send Reset Code
                </Button>
                <Button 
                  type="button"
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Back to Login
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">
                      {loginError}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={(value) => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="mentor">Mentor</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userId">Username</Label>
                  <Input
                    id="userId"
                    value={formData.userId}
                    onChange={(e) => setFormData({...formData, userId: e.target.value})}
                    placeholder="Enter your username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter your password"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>

                {/* Demo Credentials Info */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">Demo Credentials:</p>
                  <div className="text-xs text-blue-700 space-y-1">
                    <div><strong>Admin:</strong> admin / admin123</div>
                    <div><strong>Mentor:</strong> mentor / mentor123</div>
                    <div><strong>Student:</strong> student / student123</div>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Forgot password?
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRegister(true)}
                    className="text-green-600 hover:text-green-800 hover:underline"
                  >
                    Register
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};