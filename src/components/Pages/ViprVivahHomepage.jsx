import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, UserPlus, Shield, Users, Star, Heart, User, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { notifyCustom, NotificationTypes } from '../../utils/notificationUtils';
import Image2 from '../../../assets/viprvahHome.png';
import Header from '../Header';
import Footer from '../Footer';

const ViprVivahHomepage = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('token');

  const handleExploreClick = () => {
    if (isLoggedIn) {
      navigate('/explore');
    } else {
      navigate('/login', { state: { message: 'Please login to find your match' } });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <Header showAllLinks={true} isLoggedIn={isLoggedIn} />

      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${Image2})`,
            transform: 'scale(1.1)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 drop-shadow-lg leading-tight">
              अखंड एवं विराट विप्र समाज को समर्पित
            </h1>
              <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-md max-w-3xl mx-auto leading-relaxed">
              Find your perfect match in the Brahmin community with our trusted matrimonial service
            </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleExploreClick}
              className={`inline-flex items-center px-8 py-4 text-lg font-medium rounded-full 
                ${darkMode 
                  ? 'bg-white text-gray-900 hover:bg-gray-100' 
                  : 'bg-white text-red-500 hover:bg-gray-100'
                } transition-all duration-300 transform hover:scale-105 shadow-xl`}
            >
              <span className="mr-2">{isLoggedIn ? 'Explore Matches' : 'Let\'s Begin'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
              {!isLoggedIn && (
                <Link
                  to="/login"
                  className={`inline-flex items-center px-8 py-4 text-lg font-medium rounded-full border-2 border-white text-white hover:bg-white hover:text-red-500 transition-all duration-300 transform hover:scale-105`}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  <span>Create Account</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className={`py-20 pt-32 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-200`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Why Choose विप्रVivah?
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Experience the most trusted matrimonial platform designed specifically for the Brahmin community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className={`text-center p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-all duration-300 hover:transform hover:scale-105`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${darkMode ? 'bg-red-500' : 'bg-red-500'} flex items-center justify-center`}>
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Secure & Private</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your privacy is our priority with advanced security measures
              </p>
            </div>
            
            <div className={`text-center p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-all duration-300 hover:transform hover:scale-105`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${darkMode ? 'bg-red-500' : 'bg-red-500'} flex items-center justify-center`}>
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Verified Profiles</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                All profiles are verified to ensure authenticity
              </p>
            </div>
            
            <div className={`text-center p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-all duration-300 hover:transform hover:scale-105`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${darkMode ? 'bg-red-500' : 'bg-red-500'} flex items-center justify-center`}>
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Premium Service</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Advanced features for serious matchmaking
              </p>
            </div>
            
            <div className={`text-center p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-all duration-300 hover:transform hover:scale-105`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${darkMode ? 'bg-red-500' : 'bg-red-500'} flex items-center justify-center`}>
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cultural Focus</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Dedicated to preserving Brahmin cultural values
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section with Parallax */}
      <section className={`relative py-20 pt-32 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-200`}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-10"
          style={{ backgroundImage: `url(${Image2})` }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-xl rounded-2xl p-12 max-w-4xl mx-auto transition-colors duration-200`}>
            <h2 className={`text-3xl md:text-4xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-900'} mb-8`}>
              About Us
              <div className={`h-1 w-24 ${darkMode ? 'bg-red-400' : 'bg-red-500'} mx-auto mt-4`}></div>
            </h2>
            <div className="max-w-3xl mx-auto text-center">
              <p className={`text-lg leading-relaxed mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Welcome to <span className="font-bold text-red-500">विप्रVivah</span>, a dedicated matchmaking platform for the Brahmin community. Our mission 
                is to connect like-minded individuals and families, helping them find compatible partners while 
                preserving cultural values. Through advanced technology and personalized services, we ensure a 
                smooth and secure matchmaking experience.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Trusted Platform</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Verified profiles and secure environment</p>
                </div>
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cultural Values</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Preserving traditional values</p>
                </div>
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Success Stories</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Thousands of happy marriages</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Steps Section */}
      <section className={`py-20 pt-32 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-200`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              How to Get Started
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Follow these simple steps to create your profile and start your journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-all duration-300 hover:transform hover:scale-105`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${darkMode ? 'bg-red-500' : 'bg-red-500'} flex items-center justify-center text-white text-2xl font-bold`}>
                1
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create Account</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Sign up with your email and basic information
              </p>
              <div className="flex justify-center">
                <UserPlus className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              </div>
            </div>
            
            <div className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-all duration-300 hover:transform hover:scale-105`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${darkMode ? 'bg-red-500' : 'bg-red-500'} flex items-center justify-center text-white text-2xl font-bold`}>
                2
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Complete Profile</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Add detailed information about yourself and preferences
              </p>
              <div className="flex justify-center">
                <User className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              </div>
            </div>
            
            <div className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-all duration-300 hover:transform hover:scale-105`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${darkMode ? 'bg-red-500' : 'bg-red-500'} flex items-center justify-center text-white text-2xl font-bold`}>
                3
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Explore Matches</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Browse profiles and find your perfect match
              </p>
              <div className="flex justify-center">
                <Search className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              </div>
            </div>
            
            <div className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-all duration-300 hover:transform hover:scale-105`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${darkMode ? 'bg-red-500' : 'bg-red-500'} flex items-center justify-center text-white text-2xl font-bold`}>
                4
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Connect & Meet</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Express interest and start your journey together
            </p>
            <div className="flex justify-center">
                <Heart className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12 space-y-4">
            <button
              onClick={handleExploreClick}
              className={`inline-flex items-center px-8 py-4 text-lg font-medium rounded-full ${
                darkMode ? 'bg-red-500 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'
              } text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200`}
            >
              <span className="mr-2">Start Your Journey</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ViprVivahHomepage;