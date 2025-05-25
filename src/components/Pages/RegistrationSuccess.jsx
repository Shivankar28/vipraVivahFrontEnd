import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    // Automatically redirect to explore page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/explore', { 
        replace: true,
        state: { registrationSuccess: true }
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
      <div className={`max-w-md w-full mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 text-center`}>
        <div className="flex justify-center mb-4">
          <CheckCircle2 className={`w-16 h-16 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
        </div>
        <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Your Profile Has Been Created Successfully!
        </h1>
        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Welcome to विप्रVivah! Your profile is now active and ready to be discovered.
        </p>
        <button
          onClick={() => navigate('/explore')}
          className={`w-full px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors duration-200`}
        >
          Explore Profiles
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccess; 