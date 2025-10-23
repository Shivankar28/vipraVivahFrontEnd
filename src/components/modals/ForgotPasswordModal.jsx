import React, { useState } from 'react';
import { X, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ForgotPasswordModal = ({ isOpen, onClose, onOtpSent }) => {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onOtpSent(email);
        }, 2000);
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className={`relative w-full max-w-md rounded-2xl shadow-2xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } p-8 transform transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            darkMode 
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-500/10'}`}>
            <Mail className={`w-8 h-8 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
          </div>
        </div>

        {/* Title */}
        <h2 className={`text-2xl font-bold text-center mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Forgot Password?
        </h2>
        <p className={`text-center mb-6 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Enter your email address and we'll send you an OTP to reset your password
        </p>

        {/* Success Message */}
        {success && (
          <div className={`mb-4 p-4 rounded-lg flex items-start space-x-3 ${
            darkMode ? 'bg-green-500/20 border border-green-500/30' : 'bg-green-100 border border-green-200'
          }`}>
            <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`} />
            <div>
              <p className={`text-sm font-medium ${
                darkMode ? 'text-green-400' : 'text-green-800'
              }`}>
                OTP sent successfully!
              </p>
              <p className={`text-xs mt-1 ${
                darkMode ? 'text-green-300' : 'text-green-700'
              }`}>
                Check your email for the OTP
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={`mb-4 p-4 rounded-lg flex items-start space-x-3 ${
            darkMode ? 'bg-red-500/20 border border-red-500/30' : 'bg-red-100 border border-red-200'
          }`}>
            <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
              darkMode ? 'text-red-400' : 'text-red-600'
            }`} />
            <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Mail className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-red-500'
              } focus:outline-none transition-all`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || success}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              loading || success
                ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-600' 
                : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? 'Sending OTP...' : success ? 'OTP Sent!' : 'Send OTP'}
          </button>
        </form>

        {/* Help Text */}
        <p className={`text-center text-xs mt-4 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Remember your password?{' '}
          <button
            onClick={handleClose}
            className={`font-semibold ${
              darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'
            }`}
          >
            Back to login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

