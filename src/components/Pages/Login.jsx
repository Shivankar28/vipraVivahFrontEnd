import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, HeartHandshake, Home, Heart, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { login, signup } from '../../redux/slices/authSlice';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import { notifyWelcome } from '../../utils/notificationUtils';
import Header from '../Header';
import Footer from '../Footer';

// Utility to check if in development mode
const isDev = process.env.NODE_ENV === 'development';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode, toggleDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const { loading, error: authError } = useSelector((state) => state.auth);

  // Log component mount
  useEffect(() => {
    if (isDev) {
      console.group('Login: Component Mounted');
      console.log('Initial State:', { email, password, confirmPassword, activeTab, darkMode });
      console.groupEnd();
    }
  }, []);

  // Email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Password validation
  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  const handleLogin = async () => {
    if (isDev) {
      console.group('Login: handleLogin');
      console.log('Input Data:', { email, password });
    }
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      if (isDev) {
        console.error('Validation Error: Missing fields');
        console.groupEnd();
      }
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      if (isDev) {
        console.error('Validation Error: Invalid email');
        console.groupEnd();
      }
      return;
    }

    try {
      if (isDev) console.log('Dispatching login action...');
      const result = await dispatch(login({ email, password })).unwrap();
      if (isDev) {
        console.log('Login Success:', result);
      }
      if (result.data) {
        const token = result.data.token;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('loginTimestamp', Date.now().toString());
        localStorage.setItem('token', token);
        if (isDev) console.log('Login Token:', token);

        // Decode token to get isProfileFlag and role
        let isProfileFlag = false;
        let userRole = 'user';
        try {
          const decoded = jwtDecode(token);
          if (isDev) console.log('Decoded Token:', decoded);
          isProfileFlag = decoded.isProfileFlag || false;
          userRole = decoded.role || 'user';
        } catch (err) {
          if (isDev) console.error('Token Decode Error:', err);
          setError('Invalid token. Please try again.');
          console.groupEnd();
          return;
        }

        // Navigate based on role and isProfileFlag
        if (isDev) {
          console.log('isProfileFlag:', isProfileFlag);
          console.log('userRole:', userRole);
          console.groupEnd();
        }
        
        // Show welcome notification
        notifyWelcome();
        
        // Check if user is admin
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (isProfileFlag) {
          navigate('/explore');
        } else {
          navigate('/matrimony-registration');
        }
      }
    } catch (err) {
      setError(err.error || 'Invalid email or password');
      if (isDev) {
        console.error('Login Error:', err);
        console.groupEnd();
      }
    }
  };

  const handleSignup = async () => {
    if (isDev) {
      console.group('Login: handleSignup');
      console.log('Input Data:', { email, password, confirmPassword });
    }
    setError('');

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      if (isDev) {
        console.error('Validation Error: Missing fields');
        console.groupEnd();
      }
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      if (isDev) {
        console.error('Validation Error: Invalid email');
        console.groupEnd();
      }
      return;
    }

    if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters long');
      if (isDev) {
        console.error('Validation Error: Password too short');
        console.groupEnd();
      }
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      if (isDev) {
        console.error('Validation Error: Passwords do not match');
        console.groupEnd();
      }
      return;
    }

    try {
      if (isDev) console.log('Dispatching signup action...');
      const result = await dispatch(signup({ email, password })).unwrap();
      if (isDev) {
        console.log('Signup Success:', result);
      }
      if (result.statusCode === 201) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('loginTimestamp', Date.now().toString());
        localStorage.setItem('isNewUser', 'true');
        if (isDev) {
          console.log('Navigating to /otp-verification with email:', email);
          console.groupEnd();
        }
        navigate('/otp-verification', { state: { email } });
      }
    } catch (err) {
      setError(err.error || 'Failed to create account. Please try again.');
      if (isDev) {
        console.error('Signup Error:', err);
        console.groupEnd();
      }
    }
  };

  // Log tab changes
  const handleTabChange = (tab) => {
    if (isDev) {
      console.group('Login: Tab Change');
      console.log('Current Tab:', activeTab);
      console.log('New Tab:', tab);
      console.groupEnd();
    }
    setActiveTab(tab);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <Header showAllLinks={false} isLoggedIn={false} />

      {/* Hero Section */}
      <section className={`relative overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-red-50 via-pink-50 to-orange-50'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-500/10'} shadow-lg`}>
                <Heart className={`w-12 h-12 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              </div>
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
              Welcome to विप्रVivah
            </h1>
            <p className={`text-xl md:text-2xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed`}>
              Join our community and find your perfect match
            </p>
          </div>
        </div>
      </section>

      {/* Login/Signup Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className={`p-10 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              
              {/* Tab Navigation */}
              <div className={`flex rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-1 mb-8`}>
                <button
                  className={`flex-1 py-3 px-6 rounded-xl text-center font-semibold transition-all duration-300 ${
                    activeTab === 'login' 
                      ? 'bg-red-500 text-white shadow-lg' 
                      : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`
                  }`}
                  onClick={() => handleTabChange('login')}
                >
                  Login
                </button>
                <button
                  className={`flex-1 py-3 px-6 rounded-xl text-center font-semibold transition-all duration-300 ${
                    activeTab === 'signup' 
                      ? 'bg-red-500 text-white shadow-lg' 
                      : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`
                  }`}
                  onClick={() => handleTabChange('signup')}
                >
                  Signup
                </button>
              </div>

              {/* Error Message */}
              {(error || authError) && (
                <div className={`mb-6 p-4 rounded-2xl ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} ${darkMode ? 'text-red-400' : 'text-red-600'} text-sm border ${darkMode ? 'border-red-500/30' : 'border-red-200'}`}>
                  {error || authError}
                </div>
              )}
              
              {activeTab === 'login' ? (
                /* Login Form */
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Mail className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-red-500'
                      } focus:outline-none transition-all duration-300`}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (isDev) {
                          console.group('Login: Email Input Change');
                          console.log('New Email:', e.target.value);
                          console.groupEnd();
                        }
                      }}
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Lock className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-red-500'
                      } focus:outline-none transition-all duration-300`}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (isDev) {
                          console.group('Login: Password Input Change');
                          console.log('New Password:', '[REDACTED]');
                          console.groupEnd();
                        }
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-4 flex items-center"
                      onClick={() => {
                        setShowPassword(!showPassword);
                        if (isDev) {
                          console.group('Login: Toggle Password Visibility');
                          console.log('Show Password:', !showPassword);
                          console.groupEnd();
                        }
                      }}
                    >
                      {showPassword ? (
                        <EyeOff className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <Eye className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <button 
                      className={`text-sm font-medium ${
                        darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'
                      } transition-colors`}
                      onClick={() => {
                        if (isDev) {
                          console.group('Login: Forgot Password Click');
                          console.log('Action: Triggering forgot password alert');
                          console.groupEnd();
                        }
                        alert('Password reset functionality coming soon!');
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                      loading 
                        ? 'opacity-70 cursor-not-allowed bg-gray-400 text-gray-600' 
                        : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                  
                  <div className="text-center pt-4">
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Not a member?{' '}
                      <button 
                        className={`font-semibold ${
                          darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'
                        } transition-colors`}
                        onClick={() => handleTabChange('signup')}
                      >
                        Signup now
                      </button>
                    </p>
                  </div>
                </div>
              ) : (
                /* Signup Form */
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Mail className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-red-500'
                      } focus:outline-none transition-all duration-300`}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (isDev) {
                          console.group('Login: Email Input Change (Signup)');
                          console.log('New Email:', e.target.value);
                          console.groupEnd();
                        }
                      }}
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Lock className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-red-500'
                      } focus:outline-none transition-all duration-300`}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (isDev) {
                          console.group('Login: Password Input Change (Signup)');
                          console.log('New Password:', '[REDACTED]');
                          console.groupEnd();
                        }
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-4 flex items-center"
                      onClick={() => {
                        setShowPassword(!showPassword);
                        if (isDev) {
                          console.group('Login: Toggle Password Visibility (Signup)');
                          console.log('Show Password:', !showPassword);
                          console.groupEnd();
                        }
                      }}
                    >
                      {showPassword ? (
                        <EyeOff className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <Eye className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Lock className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-red-500'
                      } focus:outline-none transition-all duration-300`}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (isDev) {
                          console.group('Login: Confirm Password Input Change');
                          console.log('New Confirm Password:', '[REDACTED]');
                          console.groupEnd();
                        }
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-4 flex items-center"
                      onClick={() => {
                        setShowConfirmPassword(!showConfirmPassword);
                        if (isDev) {
                          console.group('Login: Toggle Confirm Password Visibility');
                          console.log('Show Confirm Password:', !showConfirmPassword);
                          console.groupEnd();
                        }
                      }}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <Eye className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </button>
                  </div>
                  
                  <button
                    onClick={handleSignup}
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                      loading 
                        ? 'opacity-70 cursor-not-allowed bg-gray-400 text-gray-600' 
                        : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <Footer />
    </div>
  );
}