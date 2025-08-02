import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Moon, Sun, Heart, Search, User, LogOut, CreditCard, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import NotificationSystem from './NotificationSystem';
import { useWebSocket } from '../context/WebSocketContext';

const Header = ({ showAllLinks = true, isLoggedIn = false }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  
  // Function to check if a link is active (current page)
  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  // Function to get active link styling
  const getActiveLinkStyle = (path) => {
    const isActive = isActiveLink(path);
    if (isActive) {
      return darkMode ? 'text-red-400' : 'text-gray-900'; // Footer background color
    }
    return 'text-white hover:text-gray-200';
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className={`${darkMode ? 'bg-gray-800/95' : 'bg-red-500/95'} text-white p-4 fixed w-full z-50 backdrop-blur-md border-b ${darkMode ? 'border-gray-700' : 'border-red-400'} transition-colors duration-200`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Heart className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-white'} mr-2`} />
          <span className="text-2xl font-bold">विप्रVivah</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          {showAllLinks ? (
            <>
              <Link to="/" className={`flex items-center transition-colors ${getActiveLinkStyle('/')}`}>
                <Home className="w-5 h-5 mr-1" />
                <span>Home</span>
              </Link>
              {isLoggedIn && (
                <>
                  <Link to="/explore" className={`flex items-center transition-colors ${getActiveLinkStyle('/explore')}`}>
                    <Search className="w-5 h-5 mr-1" />
                    <span>Explore</span>
                  </Link>
                  <Link to="/interest" className={`flex items-center transition-colors ${getActiveLinkStyle('/interest')}`}>
                    <Users className="w-5 h-5 mr-1" />
                    <span>Interest</span>
                  </Link>
                  <Link to="/profile" className={`flex items-center transition-colors ${getActiveLinkStyle('/profile')}`}>
                    <User className="w-5 h-5 mr-1" />
                    <span>My Profile</span>
                  </Link>
                  <Link to="/subscription" className={`flex items-center transition-colors ${getActiveLinkStyle('/subscription')}`}>
                    <CreditCard className="w-5 h-5 mr-1" />
                    <span>Subscription</span>
                  </Link>

                  
                  {/* Notification System */}
                  <NotificationSystem />
                  <button
                    onClick={handleLogout}
                    className="flex items-center hover:text-gray-200 transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-1" />
                    <span>Logout</span>
                  </button>
                </>
              )}
              <Link to="/contact" className={`flex items-center transition-colors ${getActiveLinkStyle('/contact')}`}>
                <MessageSquare className="w-5 h-5 mr-1" />
                <span>Contact</span>
              </Link>
              {!isLoggedIn && (
                <Link to="/subscription" className={`flex items-center transition-colors ${getActiveLinkStyle('/subscription')}`}>
                  <CreditCard className="w-5 h-5 mr-1" />
                  <span>Subscription</span>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/" className={`flex items-center transition-colors ${getActiveLinkStyle('/')}`}>
                <Home size={18} className="mr-1" />
                <span>Home</span>
              </Link>
              <Link to="/contact" className={`flex items-center transition-colors ${getActiveLinkStyle('/contact')}`}>
                <MessageSquare size={18} className="mr-1" />
                <span>Contact</span>
              </Link>
              <Link to="/subscription" className={`flex items-center transition-colors ${getActiveLinkStyle('/subscription')}`}>
                <CreditCard className="w-5 h-5 mr-1" />
                <span>Subscription</span>
              </Link>
            </>
          )}
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header; 