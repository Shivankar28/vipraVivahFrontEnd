import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Moon, 
  Sun, 
  Heart, 
  Home, 
  Mail, 
  User, 
  Filter, 
  Search, 
  X, 
  Cake, 
  Languages, 
  MapPin, 
  Users, 
  LogOut 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { exploreProfiles } from '../../redux/slices/profileSlice';

// Available options for filters
const filterOptions = {
  lookingFor: ["Any", "male", "female", "other"], // Adjusted to match backend gender values
  languages: ["Any", "hindi", "marathi", "bengali", "tamil", "telugu", "kannada", "malayalam", "gujarati", "punjabi", "konkani", "other"],
  cities: ["Any", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Ahmedabad", "Vadodara", "Ghaziabad", "Other"],
  gotras: ["Any", "kashyap", "vashishtha", "gautam", "bharadwaj", "atri", "agastya", "other"]
};

const ExploreProfiles = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const dispatch = useDispatch();
  
  // Get profiles, loading, and error from Redux store
  const { profiles, loading, error } = useSelector((state) => state.profile);
  
  const [filters, setFilters] = useState({
    lookingFor: "Any",
    language: "Any",
    city: "Any",
    gotra: "Any"
  });

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');
    if (!isLoggedIn || !token) {
      navigate('/login');
      return;
    }

    // Fetch profiles with current filters
    dispatch(exploreProfiles({ params: filters, token }));
  }, [navigate, dispatch, filters]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const clearFilters = () => {
    setFilters({
      lookingFor: "Any",
      language: "Any",
      city: "Any",
      gotra: "Any"
    });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
console.log("profiles",profiles)
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Navigation Bar */}
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-red-500'} text-white p-4 fixed w-full z-10`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8" />
            <span className="text-2xl font-bold">विप्रVivah</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center hover:text-gray-200 transition-colors">
              <Home className="w-5 h-5 mr-1" />
              <span>Home</span>
            </Link>
            <Link to="/explore" className="flex items-center hover:text-gray-200 transition-colors">
              <Search className="w-5 h-5 mr-1" />
              <span>Explore</span>
            </Link>
            <Link to="/contact" className="flex items-center hover:text-gray-200 transition-colors">
              <Mail className="w-5 h-5 mr-1" />
              <span>Contact</span>
            </Link>
            <Link to="/profile" className="flex items-center hover:text-gray-200 transition-colors">
              <User className="w-5 h-5 mr-1" />
              <span>My Profile</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center hover:text-gray-200 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-1" />
              <span>Logout</span>
            </button>
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-8 px-4 pt-20">
        {/* Filter Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
          <div className={`flex items-center ${darkMode ? 'text-red-400' : 'text-red-500'} text-xl font-bold mb-6`}>
            <Filter className="mr-2" /> Filter Profiles
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                <Search className="mr-2" size={16} /> Looking for
              </label>
              <select 
                className={`w-full p-2 border rounded ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                value={filters.lookingFor}
                onChange={(e) => handleFilterChange('lookingFor', e.target.value)}
              >
                {filterOptions.lookingFor.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                <Languages className="mr-2" size={16} /> Mother Tongue
              </label>
              <select 
                className={`w-full p-2 border rounded ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
              >
                {filterOptions.languages.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                <MapPin className="mr-2" size={16} /> City
              </label>
              <select 
                className={`w-full p-2 border rounded ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              >
                {filterOptions.cities.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                <Users className="mr-2" size={16} /> Gotra
              </label>
              <select 
                className={`w-full p-2 border rounded ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                value={filters.gotra}
                onChange={(e) => handleFilterChange('gotra', e.target.value)}
              >
                {filterOptions.gotras.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {loading ? 'Loading...' : `${profiles.length} profiles found`}
            </div>
            <button 
              onClick={clearFilters}
              className={`flex items-center px-4 py-2 border rounded ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600' 
                  : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <X className="mr-2" size={16} /> Clear Filters
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-600 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className={`col-span-3 text-center py-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading profiles...
            </div>
          ) : profiles.length > 0 ? (
            profiles.map(profile => (
              <div key={profile._id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
                <img 
                  src={profile.profilePicture || '/api/placeholder/400/320'} 
                  alt={`${profile.firstName} ${profile.lastName}`} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <div className={`text-xl font-semibold ${darkMode ? 'text-red-400' : 'text-red-500'} mb-4`}>
                    {`${profile.firstName} ${profile.lastName || ''}`}
                  </div>
                  <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="flex items-center">
                      <Cake className="mr-2" size={16} /> {profile.age} years
                    </div>
                    <div className="flex items-center">
                      <Languages className="mr-2" size={16} /> {profile.motherTongue}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2" size={16} /> {profile.currentAddress?.city || 'Unknown'}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2" size={16} /> {profile.gotra}
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/profile/${profile._id}`)}
                    className={`w-full mt-4 px-4 py-2 rounded ${
                      darkMode 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-red-500 hover:bg-red-600'
                    } text-white transition-colors duration-200`}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={`col-span-3 text-center py-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No profiles found matching your filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreProfiles;