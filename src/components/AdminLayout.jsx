import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CreditCard, 
  LogOut, 
  Menu, 
  X,
  Shield,
  Settings
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { jwtDecode } from 'jwt-decode';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();

  // Check if user is admin
  const token = localStorage.getItem('token');
  const isAdmin = token ? (() => {
    try {
      const decoded = jwtDecode(token);
      return decoded.role === 'admin';
    } catch (error) {
      return false;
    }
  })() : false;

  if (!isAdmin) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      current: location.pathname === '/admin'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      current: location.pathname === '/admin/users'
    },
    {
      name: 'Profiles',
      href: '/admin/profiles',
      icon: UserCheck,
      current: location.pathname === '/admin/profiles'
    },
    {
      name: 'Subscriptions',
      href: '/admin/subscriptions',
      icon: CreditCard,
      current: location.pathname === '/admin/subscriptions'
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Fixed Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className={`flex h-full flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
          {/* Sidebar header */}
          <div className={`flex h-16 items-center justify-between px-6 ${darkMode ? 'bg-gray-700' : 'bg-red-500'}`}>
            <div className="flex items-center">
              <Shield className={`h-8 w-8 ${darkMode ? 'text-red-400' : 'text-white'}`} />
              <span className={`ml-3 text-xl font-semibold ${darkMode ? 'text-white' : 'text-white'}`}>
                Admin Panel
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className={`h-6 w-6 ${darkMode ? 'text-gray-300' : 'text-white'}`} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    item.current
                      ? `${darkMode ? 'bg-red-500 text-white' : 'bg-red-500 text-white'}`
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-red-50 hover:text-red-600'}`
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${
                    item.current 
                      ? 'text-white' 
                      : darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-red-500'
                  }`} />
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
            <button
              onClick={handleLogout}
              className={`group flex w-full items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                darkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <LogOut className={`mr-3 h-5 w-5 ${
                darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-red-500'
              }`} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Main Content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className={`sticky top-0 z-30 flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className={`h-6 w-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Welcome, Admin
            </div>
            <div className={`flex items-center space-x-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <Settings className="h-4 w-4" />
              <span className="text-xs">Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
