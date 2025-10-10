// components/ExploreProfiles.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Filter,
  Search,
  X,
  Cake,
  Languages,
  MapPin,
  Users,
  Heart,
  Eye,
  Star,
  ArrowRight,
  Sparkles,
  Bell,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { exploreProfiles } from '../../redux/slices/profileSlice';
import { createLike, unlike, getUsersILiked } from '../../redux/slices/interestSlice';
import { notifyProfileLiked, notifyMutualLike } from '../../utils/notificationUtils';
import Header from '../Header';
import Footer from '../Footer';
import { addLocalNotification } from '../../redux/slices/notificationSlice';

// Utility to check if in development mode
const isDev = process.env.NODE_ENV === 'development';

// Available options for filters
const filterOptions = {
  lookingFor: ['Any', 'male', 'female', 'other'],
  languages: [
    'Any',
    'hindi',
    'marathi',
    'bengali',
    'tamil',
    'telugu',
    'kannada',
    'malayalam',
    'gujarati',
    'punjabi',
    'konkani',
    'other',
  ],
  cities: [
    'Any',
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Jaipur',
    'Ahmedabad',
    'Vadodara',
    'Ghaziabad',
    'Other',
  ],
  gotras: ['Any', 'kashyap', 'vashishtha', 'gautam', 'bharadwaj', 'atri', 'agastya', 'other'],
};

const ExploreProfiles = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const dispatch = useDispatch();

  // Get profiles, loading, and error from Redux store
  const { profiles, loading, error } = useSelector((state) => state.profile);
  const { iLiked, likeLoading, unlikeLoading, error: interestError } = useSelector((state) => state.interest);
  const plan = useSelector((state) => state.subscription.plan);

  if (isDev) console.log('ExploreProfiles: Redux state', { profiles: profiles.length, iLiked: iLiked.length, plan, interestError });

  const [filters, setFilters] = useState({
    lookingFor: 'Any',
    language: 'Any',
    city: 'Any',
    gotra: 'Any',
  });

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');
    if (!isLoggedIn || !token) {
      if (isDev) console.log('ExploreProfiles: User not logged in, redirecting to login');
      navigate('/login');
      return;
    }
    // Fetch profiles with current filters
    if (isDev) console.log('ExploreProfiles: Fetching profiles with filters', filters);
    dispatch(exploreProfiles({ params: filters, token }));
    // Fetch liked profiles
    if (isDev) console.log('ExploreProfiles: Fetching liked profiles');
    dispatch(getUsersILiked(token));
    // Fetch subscription status
    if (isDev) console.log('ExploreProfiles: Fetching subscription status');
    dispatch({ type: 'subscription/getSubscriptionStatus/pending' });
  }, [navigate, dispatch, filters]);

  const handleLogout = () => {
    if (isDev) console.log('ExploreProfiles: Logging out');
    localStorage.clear();
    navigate('/login');
  };

  const clearFilters = () => {
    if (isDev) console.log('ExploreProfiles: Clearing filters');
    setFilters({
      lookingFor: 'Any',
      language: 'Any',
      city: 'Any',
      gotra: 'Any',
    });
  };

  const handleFilterChange = (filterName, value) => {
    if (isDev) console.log('ExploreProfiles: Filter changed', { filterName, value });
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const isProfileLiked = (profileId) => {
    const liked = iLiked.some((p) => p._id === profileId);
    if (isDev) console.log('ExploreProfiles: Checking if profile is liked', { profileId, liked, iLiked });
    return liked;
  };

  const handleLikeToggle = async (profileId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (isDev) console.log('ExploreProfiles: No token found');
      navigate('/login');
      return;
    }

    const alreadyLiked = isProfileLiked(profileId);
    if (isDev) console.log('ExploreProfiles: Initiating like/unlike action', { profileId, alreadyLiked });

    try {
      if (alreadyLiked) {
        await dispatch(unlike({ token, likedId: profileId })).unwrap();
        if (isDev) console.log('ExploreProfiles: Unlike successful', { profileId });
      } else {
        await dispatch(createLike({ token, likedId: profileId })).unwrap();
        if (isDev) console.log('ExploreProfiles: Like successful', { profileId });
        
        // Find the profile that was liked to get their name
        const likedProfile = profiles.find(profile => profile._id === profileId);
        if (likedProfile) {
          const profileName = `${likedProfile.firstName} ${likedProfile.lastName}`;
          
          // Trigger notification for profile like
          notifyProfileLiked(profileName, profileId);
          
          // Check if this creates a mutual like (both users liked each other)
          // This would require checking if the other user has also liked the current user
          // For now, we'll just show the basic like notification
        }
      }
      // Refresh iLiked state only on success
      await dispatch(getUsersILiked(token)).unwrap();
      if (isDev) console.log('ExploreProfiles: Refreshed iLiked state', { iLiked });
    } catch (error) {
      if (isDev) console.error('ExploreProfiles: Like/unlike error', { profileId, error: error.message || error });
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <Header showAllLinks={true} isLoggedIn={true} />

      {/* Hero Section */}
      <section className={`relative overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-red-50 via-pink-50 to-orange-50'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className={`p-3 sm:p-4 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-500/10'} shadow-lg`}>
                <Sparkles className={`w-10 h-10 sm:w-12 sm:h-12 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              </div>
            </div>
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
              Explore Profiles
            </h1>
            <p className={`text-base sm:text-lg md:text-xl lg:text-2xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed px-2`}>
              Discover your perfect match from our verified community
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-12 md:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Filter Section */}
          <div className={`p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl sm:shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-100'} mb-6 sm:mb-8 md:mb-12`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
              <div className="flex items-center">
                <div className={`p-2 sm:p-3 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} mr-3 sm:mr-4`}>
                  <Filter className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                </div>
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Filter Profiles
                </h2>
              </div>
              <button
                onClick={clearFilters}
                className={`flex items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Clear
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              <div>
                <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 text-sm sm:text-base font-medium`}>
                  <Search className="mr-2" size={16} />
                  Looking for
                </label>
                <select
                  className={`w-full p-3 sm:p-4 text-base rounded-lg sm:rounded-2xl border-2 transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-red-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-red-500'
                  } focus:outline-none`}
                  value={filters.lookingFor}
                  onChange={(e) => handleFilterChange('lookingFor', e.target.value)}
                >
                  {filterOptions.lookingFor.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 text-sm sm:text-base font-medium`}>
                  <Languages className="mr-2" size={16} />
                  Mother Tongue
                </label>
                <select
                  className={`w-full p-3 sm:p-4 text-base rounded-lg sm:rounded-2xl border-2 transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-red-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-red-500'
                  } focus:outline-none`}
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                >
                  {filterOptions.languages.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 text-sm sm:text-base font-medium`}>
                  <MapPin className="mr-2" size={16} />
                  City
                </label>
                <select
                  className={`w-full p-3 sm:p-4 text-base rounded-lg sm:rounded-2xl border-2 transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-red-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-red-500'
                  } focus:outline-none`}
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                >
                  {filterOptions.cities.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 text-sm sm:text-base font-medium`}>
                  <Users className="mr-2" size={16} />
                  Gotra
                </label>
                <select
                  className={`w-full p-3 sm:p-4 text-base rounded-lg sm:rounded-2xl border-2 transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-red-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-red-500'
                  } focus:outline-none`}
                  value={filters.gotra}
                  onChange={(e) => handleFilterChange('gotra', e.target.value)}
                >
                  {filterOptions.gotras.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 sm:mt-8 pt-5 sm:pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} space-y-3 sm:space-y-0`}>
              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm sm:text-base font-medium`}>
                {loading ? 'Loading...' : `${profiles.length} profiles found`}
              </div>
              {plan === 'premium' && (
                <div className={`flex items-center ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-sm sm:text-base font-medium">Premium Access</span>
                </div>
              )}
            </div>

            {/* Error Messages */}
            {(error || interestError) && (
              <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-2xl text-sm sm:text-base ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} ${darkMode ? 'text-red-400' : 'text-red-600'} border ${darkMode ? 'border-red-500/30' : 'border-red-200'}`}>
                {error || interestError}
              </div>
            )}

        
          </div>

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {loading ? (
              <div className={`col-span-full text-center py-12 sm:py-16 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="flex justify-center mb-4">
                  <div className={`w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin`}></div>
                </div>
                <p className="text-base sm:text-lg font-medium">Loading profiles...</p>
              </div>
            ) : profiles.length > 0 ? (
              profiles.map((profile) => (
                <div
                  key={profile._id}
                  className={`group ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-100'} sm:hover:scale-105`}
                >
                  <div className="relative">
                    <img
                      src={profile.profilePicture || '/api/placeholder/400/320'}
                      alt={`${profile.firstName} ${profile.lastName || ''}`}
                      className="w-full h-56 sm:h-64 object-cover"
                    />
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <button
                        disabled={likeLoading || unlikeLoading}
                        onClick={() => {
                          if (plan !== 'premium') {
                            if (isDev) console.log('ExploreProfiles: Non-premium user attempted like/unlike', { profileId: profile._id });
                            navigate('/subscription');
                            return;
                          }
                          handleLikeToggle(profile._id);
                        }}
                        className={`p-2.5 sm:p-3 rounded-full transition-all duration-300 ${
                          isProfileLiked(profile._id)
                            ? 'bg-red-500 text-white shadow-lg'
                            : darkMode
                            ? 'bg-gray-800/80 text-gray-400 hover:text-white'
                            : 'bg-white/80 text-gray-500 hover:text-red-500'
                        }`}
                        title={isProfileLiked(profile._id) ? 'Unlike' : 'Like'}
                      >
                        <Heart
                          className={`w-5 h-5 sm:w-5 sm:h-5 ${
                            isProfileLiked(profile._id) ? 'fill-current' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-5 md:p-6">
                    <div className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {`${profile.firstName} ${profile.lastName || ''}`}
                    </div>
                    
                    <div className={`space-y-2.5 sm:space-y-3 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div className="flex items-center">
                        <div className={`p-1.5 sm:p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mr-2.5 sm:mr-3`}>
                          <Cake className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <span className="font-medium">{profile.age} years</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className={`p-1.5 sm:p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mr-2.5 sm:mr-3`}>
                          <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <span className="font-medium">{profile.motherTongue}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className={`p-1.5 sm:p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mr-2.5 sm:mr-3`}>
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <span className="font-medium">{profile.currentAddress?.city || 'Unknown'}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className={`p-1.5 sm:p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mr-2.5 sm:mr-3`}>
                          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <span className="font-medium">{profile.gotra}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 sm:mt-6">
                      <button
                        onClick={() => {
                          if (plan !== 'premium') {
                            if (isDev) console.log('ExploreProfiles: Non-premium user attempted to view profile', { profileId: profile._id });
                            navigate('/subscription');
                            return;
                          }
                          navigate(`/profile/${profile._id}`);
                        }}
                        className={`group flex items-center justify-center w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                          darkMode 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        } shadow-lg hover:shadow-xl transform sm:hover:scale-105`}
                      >
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        <span>View Profile</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`col-span-full text-center py-12 sm:py-16 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="flex justify-center mb-4">
                  <div className={`p-3 sm:p-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Search className={`w-6 h-6 sm:w-8 sm:h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No profiles found</h3>
                <p className="text-sm sm:text-base">Try adjusting your filters to find more matches</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ExploreProfiles;