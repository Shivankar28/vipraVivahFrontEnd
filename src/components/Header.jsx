import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Moon, Sun, Heart, Search, User, LogOut, CreditCard, Users, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import NotificationSystem from './NotificationSystem';
import { useWebSocket } from '../context/WebSocketContext';

const Header = ({ showAllLinks = true, isLoggedIn = false }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`${darkMode ? 'bg-gray-800/95' : 'bg-red-500/95'} text-white p-4 fixed w-full z-50 backdrop-blur-md border-b ${darkMode ? 'border-gray-700' : 'border-red-400'} transition-colors duration-200`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
          <Heart className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-white'} mr-2`} />
          <span className="text-xl sm:text-2xl font-bold">विप्रVivah</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
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

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden absolute top-full left-0 right-0 ${darkMode ? 'bg-gray-800/95' : 'bg-red-500/95'} shadow-lg border-t ${darkMode ? 'border-gray-700' : 'border-red-400'} backdrop-blur-md`}>
          <div className="container mx-auto py-4 space-y-2">
            {showAllLinks ? (
              <>
                <Link 
                  to="/" 
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${getActiveLinkStyle('/')} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-400'}`}
                  onClick={closeMobileMenu}
                >
                  <Home className="w-5 h-5 mr-3" />
                  <span>Home</span>
                </Link>
                {isLoggedIn && (
                  <>
                    <Link 
                      to="/explore" 
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${getActiveLinkStyle('/explore')} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-400'}`}
                      onClick={closeMobileMenu}
                    >
                      <Search className="w-5 h-5 mr-3" />
                      <span>Explore</span>
                    </Link>
                    <Link 
                      to="/interest" 
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${getActiveLinkStyle('/interest')} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-400'}`}
                      onClick={closeMobileMenu}
                    >
                      <Users className="w-5 h-5 mr-3" />
                      <span>Interest</span>
                    </Link>
                    <Link 
                      to="/profile" 
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${getActiveLinkStyle('/profile')} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-400'}`}
                      onClick={closeMobileMenu}
                    >
                      <User className="w-5 h-5 mr-3" />
                      <span>My Profile</span>
                    </Link>
                    <Link 
                      to="/subscription" 
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${getActiveLinkStyle('/subscription')} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-400'}`}
                      onClick={closeMobileMenu}
                    >
                      <CreditCard className="w-5 h-5 mr-3" />
                      <span>Subscription</span>
                    </Link>

                    {/* Mobile Notification System */}
                    <div className="px-4 py-3">
                      <NotificationSystem />
                    </div>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                      className="flex items-center px-4 py-3 rounded-lg transition-colors text-white hover:text-gray-200 w-full"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span>Logout</span>
                    </button>
                  </>
                )}
                <Link 
                  to="/contact" 
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${getActiveLinkStyle('/contact')} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-400'}`}
                  onClick={closeMobileMenu}
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  <span>Contact</span>
                </Link>
                {!isLoggedIn && (
                  <Link 
                    to="/subscription" 
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${getActiveLinkStyle('/subscription')} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-400'}`}
                    onClick={closeMobileMenu}
                  >
                    <CreditCard className="w-5 h-5 mr-3" />
                    <span>Subscription</span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${getActiveLinkStyle('/')} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-400'}`}
                  onClick={closeMobileMenu}
                >
                  <Home size={18} className="mr-3" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/contact" 
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${getActiveLinkStyle('/contact')} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-400'}`}
                  onClick={closeMobileMenu}
                >
                  <MessageSquare size={18} className="mr-3" />
                  <span>Contact</span>
                </Link>
                <Link 
                  to="/subscription" 
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${getActiveLinkStyle('/subscription')} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-400'}`}
                  onClick={closeMobileMenu}
                >
                  <CreditCard className="w-5 h-5 mr-3" />
                  <span>Subscription</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;