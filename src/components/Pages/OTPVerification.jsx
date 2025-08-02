import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Mail, Home, HeartHandshake, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { verifyOtp, resendOtp } from '../../redux/slices/authSlice';
import Footer from '../Footer';
import Header from '../Header';

// Utility to check if in development mode
const isDev = process.env.NODE_ENV === 'development';

export default function OTPVerification() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const { loading, error: authError } = useSelector((state) => state.auth);
  const email = location.state?.email || '';

  // Log component mount
  useEffect(() => {
    if (isDev) {
      console.group('OTPVerification: Component Mounted');
      console.log('Initial State:', { email, otp, resendCooldown, darkMode });
      console.groupEnd();
    }
  }, []);

  // Handle OTP input (restrict to 6 digits)
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError('');
    setResendMessage('');
    if (isDev) {
      console.group('OTPVerification: OTP Input Change');
      console.log('New OTP Value:', value);
      console.groupEnd();
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (isDev) {
      console.group('OTPVerification: handleVerifyOtp');
      console.log('Input Data:', { email, otp });
    }
    setError('');
    setResendMessage('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      if (isDev) {
        console.error('Validation Error: Invalid OTP');
        console.groupEnd();
      }
      return;
    }

    try {
      if (isDev) console.log('Dispatching verifyOtp action...');
      const result = await dispatch(verifyOtp({ email, otp })).unwrap();
      if (isDev) {
        console.log('OTP Verification Success:', result);
      }
      if (result.data) {
        localStorage.setItem('isNewUser', 'true');
        localStorage.setItem('token', result.data.token);
        const isProfileFlag = result.data.isProfileFlag ?? false;
        if (isDev) {
          console.log('isProfileFlag:', isProfileFlag);
          console.log('Navigating to:', isProfileFlag ? '/explore' : '/matrimony-registration');
          console.groupEnd();
        }
        navigate(isProfileFlag ? '/explore' : '/matrimony-registration');
      }
    } catch (err) {
      setError(err.error || 'Invalid OTP. Please try again.');
      if (isDev) {
        console.error('OTP Verification Error:', err);
        console.groupEnd();
      }
    }
  };

  // Handle OTP resend
  const handleResendOtp = async () => {
    if (isDev) {
      console.group('OTPVerification: handleResendOtp');
      console.log('Input Data:', { email });
    }
    setError('');
    setResendMessage('');

    try {
      if (isDev) console.log('Dispatching resendOtp action...');
      const result = await dispatch(resendOtp({ email })).unwrap();
      if (isDev) {
        console.log('Resend OTP Success:', result);
      }
      if (result.statusCode === 200) {
        setResendMessage('OTP resent successfully');
        setResendCooldown(30); // 30-second cooldown
        if (isDev) {
          console.log('Set resend cooldown to 30 seconds');
          console.groupEnd();
        }
      }
    } catch (err) {
      setError(err.error || 'Failed to resend OTP. Please try again.');
      if (isDev) {
        console.error('Resend OTP Error:', err);
        console.groupEnd();
      }
    }
  };

  // Cooldown timer for resend button
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (isDev) {
            console.group('OTPVerification: Resend Cooldown Tick');
            console.log('Current Cooldown:', prev - 1);
            console.groupEnd();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  return (
    <>
      {/* Header Component */}
      <Header showAllLinks={false} isLoggedIn={false} />
      
      <div className={`flex flex-col items-center justify-center min-h-screen ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        {/* Back to Homepage Button - Fixed at Bottom */}
        <Link
          to="/"
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 px-6 py-3 rounded-full shadow-lg ${
            darkMode 
              ? 'bg-gray-800 text-white hover:bg-gray-700' 
              : 'bg-white text-red-500 hover:bg-gray-100'
          } transition-all duration-200 hover:shadow-xl`}
        >
          <Home className="w-5 h-5" />
          <span>Back to Homepage</span>
        </Link>

        {/* Add margin top to account for fixed header */}
        <div className="mt-24">
          <div className={`${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-lg p-8 w-full max-w-md mx-4 transition-colors duration-200`}>
            <h1 className={`text-2xl font-bold text-center mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Verify OTP
            </h1>

            {/* Instructions */}
            <p className={`text-center mb-6 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Enter the 6-digit OTP sent to {email}
            </p>

            {/* Error Message */}
            {(error || authError) && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
                {error || authError}
              </div>
            )}

            {/* Success Message for Resend */}
            {resendMessage && (
              <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-600 text-sm">
                {resendMessage}
              </div>
            )}

            {/* OTP Input */}
            <div className="mb-6 relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Mail className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                type="text"
                placeholder="Enter OTP"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-red-500`}
                value={otp}
                onChange={handleOtpChange}
                maxLength={6}
                required
              />
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className={`w-full bg-red-500 text-white py-3 rounded-lg transition-colors mb-4 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-600'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {/* Resend OTP Button */}
            <div className="text-center">
              <button
                onClick={handleResendOtp}
                disabled={loading || resendCooldown > 0}
                className={`text-sm ${
                  darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'
                } transition-colors ${resendCooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}