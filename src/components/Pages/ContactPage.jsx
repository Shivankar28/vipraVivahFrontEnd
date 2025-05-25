import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Home, Search, User, MessageSquare, LogOut, Moon, Sun, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ContactPage = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Navigation Bar */}
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-red-500'} text-white p-4`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Heart className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-white'} mr-2`} />
            <span className="text-2xl font-bold">विप्रVivah</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="flex items-center hover:text-gray-200 transition-colors">
              <Home size={18} className="mr-1" />
              <span>Home</span>
            </Link>
            <Link to="/explore" className="flex items-center hover:text-gray-200 transition-colors">
              <Search size={18} className="mr-1" />
              <span>Explore</span>
            </Link>
            <Link to="/profile" className="flex items-center hover:text-gray-200 transition-colors">
              <User size={18} className="mr-1" />
              <span>My Profile</span>
            </Link>
            <Link to="/contact" className="flex items-center hover:text-gray-200 transition-colors">
              <MessageSquare size={18} className="mr-1" />
              <span>Contact</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center hover:text-gray-200 transition-colors"
            >
              <LogOut size={18} className="mr-1" />
              <span>Logout</span>
            </button>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-300" />
            ) : (
              <Moon size={20} className="text-white" />
            )}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`flex-grow container mx-auto py-8 px-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Connect With Us</h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>We're here to help you find your perfect match</p>
        </div>

        {/* Contact Card */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-6 max-w-4xl mx-auto`}>
          {/* About Us Section */}
          <div className="mb-8">
            <div className="flex items-center text-red-500 mb-2">
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-red-100'} rounded-full p-2 mr-2`}>
                <User size={20} />
              </div>
              <h2 className="text-2xl font-bold">About Us</h2>
            </div>
            
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Welcome to <span className="font-bold">विप्रVivah</span>, a dedicated matchmaking platform for the Brahmin community. Our mission is to connect like-minded individuals and families, helping them find compatible partners while preserving cultural values. Through advanced technology and personalized services, we ensure a smooth and secure matchmaking experience.
            </p>
          </div>
          
          <hr className={`my-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
          
          {/* Contact Information */}
          <div className="mb-8">
            <div className="flex items-center text-red-500 mb-4">
              <MessageSquare size={20} className="mr-2" />
              <h2 className="text-2xl font-bold">Contact Information</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-4">
              {/* Email */}
              <div className="flex items-start">
                <Mail className="text-red-500 mr-3 mt-1" />
                <div>
                  <h3 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Email</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>support@vipravivah.in</p>
                </div>
              </div>
              
              {/* Phone */}
              <div className="flex items-start">
                <Phone className="text-red-500 mr-3 mt-1" />
                <div>
                  <h3 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Phone</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>+91 1234567890</p>
                </div>
              </div>
              
              {/* Address */}
              <div className="flex items-start">
                <MapPin className="text-red-500 mr-3 mt-1" />
                <div>
                  <h3 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Address</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>123 Matchmaking Street, Matrimony City, India - 123456</p>
                </div>
              </div>
            </div>
          </div>
          
          <hr className={`my-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
          
          {/* Follow Us */}
          <div>
            <div className="flex items-center text-red-500 mb-4">
              <div className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Follow Us</h2>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className={`flex items-center py-2 px-4 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-md transition-colors`}>
                <Facebook className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mr-2`} size={20} />
                <span>Facebook</span>
              </a>
              <a href="#" className={`flex items-center py-2 px-4 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-md transition-colors`}>
                <Instagram className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mr-2`} size={20} />
                <span>Instagram</span>
              </a>
              <a href="#" className={`flex items-center py-2 px-4 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-md transition-colors`}>
                <Linkedin className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mr-2`} size={20} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-gray-900'} text-white py-12 transition-colors duration-200`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-6">
              <Heart className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-500'} mr-2`} />
              <h3 className="text-2xl font-bold">विप्रVivah</h3>
            </div>
            <div className="max-w-3xl mx-auto">
              <p className={`text-base leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-400'}`}>
                विप्रVivah is a platform for Brahmin matrimony. We verify profiles to ensure authenticity, but we recommend users to exercise due diligence before proceeding with any match.
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                © 2024 विप्रVivah. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;

     

