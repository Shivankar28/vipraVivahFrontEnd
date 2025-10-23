import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import Footer from '../Footer';
import { useTheme } from '../../context/ThemeContext';

const LogoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Call logout API to clear refresh token
        await dispatch(logoutUser()).unwrap();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Clear local storage regardless of API call success
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('loginTimestamp');
        localStorage.removeItem('isNewUser');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    };

    handleLogout();
  }, [dispatch, navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`text-center p-8 rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
        </div>
        <h2 className={`text-2xl font-semibold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Logging out...
        </h2>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
          Please wait while we log you out
        </p>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LogoutPage;
