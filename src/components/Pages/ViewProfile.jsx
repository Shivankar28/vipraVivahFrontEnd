// components/ViewProfile.jsx
import React, { useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Home,
  Mail,
  User,
  Search,
  MessageSquare,
  LogOut,
  Moon,
  Sun,
  Cake,
  MapPin,
  GraduationCap,
  Briefcase,
  Users,
  Phone,
  Languages,
  Clock,
  Heart as HeartIcon,
  Facebook,
  Instagram,
  Linkedin,
  Shield,
  ArrowLeft,
  Eye,
  Star,
  Sparkles,
  Globe,
  Calendar,
  UserCheck,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileById } from '../../redux/slices/profileSlice';
import { createLike, unlike, getUsersILiked } from '../../redux/slices/interestSlice';
import { getPlanFromToken } from '../../utils/decodeToken';
import { notifyProfileLiked, notifyMutualLike } from '../../utils/notificationUtils';
import Header from '../Header';
import Footer from '../Footer';

// Utility to check if in development mode
const isDev = process.env.NODE_ENV === 'development';

const ViewProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const dispatch = useDispatch();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('token');

  // Get profile, loading, and error from Redux store
  const { selectedProfile, loading, error } = useSelector((state) => state.profile);
  const { iLiked, likeLoading, unlikeLoading, error: interestError } = useSelector((state) => state.interest);
  const plan = useSelector((state) => state.subscription.plan);

  if (isDev) console.log('ViewProfile: Redux state', { selectedProfile, iLiked: iLiked.length, plan, interestError });

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');
    if (!isLoggedIn || !token) {
      if (isDev) console.log('ViewProfile: User not logged in, redirecting to login');
      navigate('/login');
      return;
    }

    // Restrict free users from viewing others' profiles
    try {
      const decoded = getPlanFromToken(token);
      const userId = decoded.id;
      if (plan !== 'premium' && id !== userId) {
        if (isDev) console.log('ViewProfile: Non-premium user attempted to view profile', { id, userId });
        navigate('/subscription');
        return;
      }
    } catch (error) {
      if (isDev) console.error('ViewProfile: Token decode error', error);
    }

    // Fetch profile data
    if (isDev) console.log('ViewProfile: Fetching profile', { id });
    dispatch(getProfileById({ id, token }));

    // Fetch liked profiles
    if (isDev) console.log('ViewProfile: Fetching liked profiles');
    dispatch(getUsersILiked(token));
  }, [id, navigate, dispatch, plan]);

  const handleLogout = () => {
    if (isDev) console.log('ViewProfile: Logging out');
    localStorage.clear();
    navigate('/login');
  };

  // Calculate age from dateOfBirth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'Not specified';
    const dob = new Date(dateOfBirth);
    const now = new Date();
    if (isNaN(dob) || dob >= now) return 'Invalid date';
    const age = Math.floor((now - dob) / (365.25 * 24 * 60 * 60 * 1000));
    return age >= 0 ? `${age} years` : 'Invalid date';
  };

  // Format date to DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return 'Not specified';
    const d = new Date(date);
    if (isNaN(d)) return 'Invalid date';
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  // Format marital status (e.g., never_married -> Never Married)
  const formatMaritalStatus = (status) => {
    if (!status) return 'Not specified';
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format height (assuming cm)
  const formatHeight = (height) => {
    if (!height) return 'Not specified';
    return `${height} cm`;
  };

  // Check if profile is liked
  const isProfileLiked = useCallback(
    (profileId) => {
      const liked = iLiked.some((p) => p._id === profileId);
      if (isDev) console.log('ViewProfile: Checking if profile is liked', { profileId, liked, iLiked });
      return liked;
    },
    [iLiked]
  );

  // Handle like/unlike toggle
  const handleLikeToggle = async (profileId) => {
    if (plan !== 'premium') {
      if (isDev) console.log('ViewProfile: Non-premium user attempted like/unlike', { profileId });
      navigate('/subscription');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      if (isDev) console.log('ViewProfile: No token found');
      navigate('/login');
      return;
    }

    const alreadyLiked = isProfileLiked(profileId);
    if (isDev) console.log('ViewProfile: Initiating like/unlike action', { profileId, alreadyLiked });

    try {
      if (alreadyLiked) {
        await dispatch(unlike({ token, likedId: profileId })).unwrap();
        if (isDev) console.log('ViewProfile: Unlike successful', { profileId });
      } else {
        await dispatch(createLike({ token, likedId: profileId })).unwrap();
        if (isDev) console.log('ViewProfile: Like successful', { profileId });
        
        // Trigger notification for profile like
        const profileName = `${selectedProfile.firstName} ${selectedProfile.lastName}`;
        notifyProfileLiked(profileName, profileId);
      }
      // Refresh iLiked state
      await dispatch(getUsersILiked(token)).unwrap();
      if (isDev) console.log('ViewProfile: Refreshed iLiked state', { iLiked });
    } catch (error) {
      if (isDev) console.error('ViewProfile: Like/unlike error', { profileId, error: error.message || error });
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header showAllLinks={true} isLoggedIn={isLoggedIn} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className={`w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header showAllLinks={true} isLoggedIn={isLoggedIn} />
        <div className="flex items-center justify-center h-screen">
          <div className={`p-6 rounded-3xl ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} ${darkMode ? 'text-red-400' : 'text-red-600'} border ${darkMode ? 'border-red-500/30' : 'border-red-200'}`}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!selectedProfile) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header showAllLinks={true} isLoggedIn={isLoggedIn} />
        <div className="flex items-center justify-center h-screen">
          <div className={`p-6 rounded-3xl ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'} ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} border ${darkMode ? 'border-yellow-500/30' : 'border-yellow-200'}`}>
            Profile not found
          </div>
        </div>
      </div>
    );
  }

  if (isDev) console.log('ViewProfile: Selected profile', selectedProfile);
  if (isDev) console.log('ViewProfile: Profile image data', {
    profileImage: selectedProfile.profileImage,
    profilePicture: selectedProfile.profilePicture
  });

  // Map backend profile to frontend structure
  const profile = {
    name: `${selectedProfile.firstName} ${selectedProfile.lastName || ''}`,
    age: calculateAge(selectedProfile.dateOfBirth),
    gender: selectedProfile.gender || 'Not specified',
    height: formatHeight(selectedProfile.height),
    birthDate: formatDate(selectedProfile.dateOfBirth),
    maritalStatus: formatMaritalStatus(selectedProfile.maritalStatus),
    language: selectedProfile.motherTongue || 'Not specified',
    profileFor: selectedProfile.profileFor || 'Not specified',
    lookingFor: selectedProfile.lookingFor || 'Not specified',
    foodHabits: selectedProfile.foodHabits || 'Not specified',
    location: {
      city: selectedProfile.currentAddress?.city || 'Unknown',
      state: selectedProfile.currentAddress?.state || 'Unknown',
      street: selectedProfile.currentAddress?.street || 'Unknown',
      pincode: selectedProfile.currentAddress?.pincode || 'Unknown',
      country: 'India', // Default
    },
    permanentAddress: {
      city: selectedProfile.permanentAddress?.city || 'Unknown',
      state: selectedProfile.permanentAddress?.state || 'Unknown',
      street: selectedProfile.permanentAddress?.street || 'Unknown',
      pincode: selectedProfile.permanentAddress?.pincode || 'Unknown',
    },
    isCurrentPermanentSame: selectedProfile.isCurrentPermanentSame ? 'Yes' : 'No',
    education: {
      degree: selectedProfile.HighestQualification || 'Not specified',
      field: selectedProfile.specialization || 'Not specified',
      university: selectedProfile.university || 'Not specified',
      graduationYear: selectedProfile.yearOfCompletion || 'Not specified',
    },
    occupation: {
      profession: selectedProfile.occupation || 'Not specified',
      company: selectedProfile.company || 'Not specified',
      experience: selectedProfile.currentWorking ? `Employed (${selectedProfile.currentWorking})` : 'Not specified',
      income: selectedProfile.annualIncome || 'Not specified',
      workLocation: selectedProfile.workLocation || 'Not specified',
    },
    family: {
      gotra: selectedProfile.gotra || 'Not specified',
      subcaste: selectedProfile.subcaste || 'Not specified',
      fatherName: selectedProfile.fatherName || 'Not specified',
      motherName: selectedProfile.motherName || 'Not specified',
      fatherOccupation: 'Not specified', // Not in schema
      motherOccupation: 'Not specified', // Not in schema
      siblings: 'Not specified', // Not in schema
      livesWithFamily: selectedProfile.isLivesWithFamily || 'Not specified',
    },
    contact: {
      email: selectedProfile.userId?.email || 'Not available',
      phone: selectedProfile.phoneNumber || 'Not available',
    },
    socialMedia: {
      facebook: selectedProfile.facebook || 'Not specified',
      instagram: selectedProfile.instagram || 'Not specified',
      linkedin: selectedProfile.linkedin || 'Not specified',
    },
    idVerification: {
      type: selectedProfile.idVerification?.type || 'Not specified',
      number: selectedProfile.idVerification?.number || 'Not specified',
    },
    about: selectedProfile.about || 'No description provided.',
    preferences: {
      ageRange: 'Not specified', // Not in schema
      height: 'Not specified', // Not in schema
      education: 'Not specified', // Not in schema
      occupation: 'Not specified', // Not in schema
      location: 'Not specified', // Not in schema
    },
    photos: selectedProfile.profileImage ? [selectedProfile.profileImage] : (selectedProfile.profilePicture ? [selectedProfile.profilePicture] : ['/api/placeholder/400/500']),
    createdAt: formatDate(selectedProfile.createdAt),
    updatedAt: formatDate(selectedProfile.updatedAt),
  };

  if (isDev) console.log('ViewProfile: Mapped profile photos', profile.photos);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <Header showAllLinks={true} isLoggedIn={isLoggedIn} />

      {/* Hero Section */}
      <section className={`relative overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-red-50 via-pink-50 to-orange-50'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className={`p-3 sm:p-4 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-500/10'} shadow-lg`}>
                <Eye className={`w-10 h-10 sm:w-12 sm:h-12 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              </div>
            </div>
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
              Profile Details
            </h1>
            <p className={`text-base sm:text-lg md:text-xl lg:text-2xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed px-2`}>
              View detailed information about this profile
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-12 md:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <div className={`max-w-6xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            {/* Profile Header */}
            <div className={`relative p-4 sm:p-6 md:p-8 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between space-y-4 sm:space-y-0">
                {/* Profile Image - Passport Style */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-8 w-full sm:w-auto">
                  <div className="relative">
                    <div className={`w-36 h-48 sm:w-40 sm:h-56 md:w-48 md:h-64 rounded-lg overflow-hidden shadow-xl sm:shadow-2xl border-2 sm:border-4 ${darkMode ? 'border-gray-600' : 'border-white'} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                      {profile.photos[0] && profile.photos[0] !== '/api/placeholder/400/500' ? (
                        <img 
                          src={profile.photos[0]} 
                          alt={profile.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            console.error('Image failed to load:', profile.photos[0]);
                            e.target.src = '/api/placeholder/400/500';
                          }}
                          onLoad={(e) => {
                            console.log('Image loaded successfully:', profile.photos[0]);
                          }}
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <User className="w-12 h-12 sm:w-16 sm:h-16" />
                        </div>
                      )}
                    </div>
                    {/* Passport-style border effect */}
                    <div className={`absolute inset-0 rounded-lg border-2 ${darkMode ? 'border-gray-500' : 'border-gray-300'} pointer-events-none`}></div>
                  </div>
                  
                  {/* Profile Info */}
                  <div className={`${darkMode ? 'text-gray-100' : 'text-white'} text-center sm:text-left`}>
                    <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>{profile.name}</h1>
                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg">
                      <div className="flex items-center justify-center sm:justify-start">
                        <MapPin className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 ${darkMode ? 'text-red-400' : 'text-white'}`} />
                        <span>{profile.location.city}, {profile.location.state}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start">
                        <Briefcase className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 ${darkMode ? 'text-red-400' : 'text-white'}`} />
                        <span>{profile.occupation.profession}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start">
                        <Cake className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 ${darkMode ? 'text-red-400' : 'text-white'}`} />
                        <span>{profile.age}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start">
                        <GraduationCap className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 ${darkMode ? 'text-red-400' : 'text-white'}`} />
                        <span>{profile.education.degree}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-row sm:flex-col space-x-3 sm:space-x-0 sm:space-y-3 md:space-y-4 w-full sm:w-auto">
                  <button
                    disabled={likeLoading || unlikeLoading}
                    onClick={() => handleLikeToggle(id)}
                    className={`flex-1 sm:flex-initial flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                      isProfileLiked(id)
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
                        : darkMode 
                          ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 backdrop-blur-sm border border-red-500/30'
                          : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                    } transform sm:hover:scale-105`}
                    title={isProfileLiked(id) ? 'Unlike' : 'Express Interest'}
                  >
                    <HeartIcon
                      className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${
                        isProfileLiked(id) ? 'text-red-200 fill-current' : ''
                      }`}
                      fill={isProfileLiked(id) ? 'currentColor' : 'none'}
                    />
                    <span className="hidden sm:inline">{isProfileLiked(id) ? 'Liked' : 'Express Interest'}</span>
                    <span className="sm:hidden">{isProfileLiked(id) ? 'Liked' : 'Interest'}</span>
                  </button>
                  <button
                    className={`flex-1 sm:flex-initial flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 transform sm:hover:scale-105 ${
                      darkMode 
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 backdrop-blur-sm border border-red-500/30'
                        : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">Send Message</span>
                    <span className="sm:hidden">Message</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-4 sm:p-6 md:p-8">
              {/* Error Message */}
              {interestError && (
                <div className={`mb-4 sm:mb-6 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-2xl md:rounded-3xl text-sm sm:text-base ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} ${darkMode ? 'text-red-400' : 'text-red-600'} border ${darkMode ? 'border-red-500/30' : 'border-red-200'}`}>
                  {interestError}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {/* Basic Information */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className={`p-2 sm:p-3 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} mr-3 sm:mr-4`}>
                      <User className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                    </div>
                    <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Basic Information
                    </h2>
                  </div>
                  <div className={`space-y-3 sm:space-y-4 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                      <Cake className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <span className="block text-xs sm:text-sm opacity-70">Age</span>
                        <span className="block font-semibold text-sm sm:text-base">{profile.age}</span>
                      </div>
                    </div>
                    <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <span className="block text-xs sm:text-sm opacity-70">Gender</span>
                        <span className="block font-semibold text-sm sm:text-base capitalize">{profile.gender}</span>
                      </div>
                    </div>
                    <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <span className="block text-xs sm:text-sm opacity-70">Height</span>
                        <span className="block font-semibold text-sm sm:text-base">{profile.height}</span>
                      </div>
                    </div>
                    <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <span className="block text-xs sm:text-sm opacity-70">Date of Birth</span>
                        <span className="block font-semibold text-sm sm:text-base">{profile.birthDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <span className="block text-xs sm:text-sm opacity-70">Marital Status</span>
                        <span className="block font-semibold text-sm sm:text-base">{profile.maritalStatus}</span>
                      </div>
                    </div>
                    <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                      <Languages className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <span className="block text-xs sm:text-sm opacity-70">Mother Tongue</span>
                        <span className="block font-semibold text-sm sm:text-base capitalize">{profile.language}</span>
                      </div>
                    </div>
                    <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <span className="block text-xs sm:text-sm opacity-70">Profile For</span>
                        <span className="block font-semibold text-sm sm:text-base capitalize">{profile.profileFor}</span>
                      </div>
                    </div>
                    <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <span className="block text-xs sm:text-sm opacity-70">Looking For</span>
                        <span className="block font-semibold text-sm sm:text-base capitalize">{profile.lookingFor}</span>
                      </div>
                    </div>
                    <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <span className="block text-xs sm:text-sm opacity-70">Food Habits</span>
                        <span className="block font-semibold text-sm sm:text-base capitalize">{profile.foodHabits}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education & Career */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className={`p-2 sm:p-3 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} mr-3 sm:mr-4`}>
                      <GraduationCap className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                    </div>
                    <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Education & Career
                    </h2>
                  </div>
                  <div className={`space-y-4 sm:space-y-6 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <div className="flex items-start">
                        <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className={`text-base sm:text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Education</h3>
                          <p className="font-semibold text-sm sm:text-base">{profile.education.degree} in {profile.education.field}</p>
                          <p className="text-xs sm:text-sm opacity-70">{profile.education.university}</p>
                          <p className="text-xs sm:text-sm opacity-70">Graduated: {profile.education.graduationYear}</p>
                        </div>
                      </div>
                    </div>
                    <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <div className="flex items-start">
                        <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className={`text-base sm:text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Career</h3>
                          <p className="font-semibold text-sm sm:text-base">{profile.occupation.profession}</p>
                          <p className="text-xs sm:text-sm opacity-70">Company: {profile.occupation.company}</p>
                          <p className="text-xs sm:text-sm opacity-70">Status: {profile.occupation.experience}</p>
                          <p className="text-xs sm:text-sm opacity-70">Income: {profile.occupation.income}</p>
                          <p className="text-xs sm:text-sm opacity-70">Location: {profile.occupation.workLocation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Family Background */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className={`p-2 sm:p-3 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} mr-3 sm:mr-4`}>
                      <Users className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                    </div>
                    <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Family Background
                    </h2>
                  </div>
                  <div className={`space-y-3 sm:space-y-4 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <span className="block text-xs sm:text-sm opacity-70">Gotra</span>
                        <span className="block font-semibold text-sm sm:text-base">{profile.family.gotra}</span>
                      </div>
                    </div>
                    <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <span className="block text-xs sm:text-sm opacity-70">Subcaste</span>
                        <span className="block font-semibold text-sm sm:text-base capitalize">{profile.family.subcaste}</span>
                      </div>
                    </div>
                    <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <span className="block text-xs sm:text-sm opacity-70">Father</span>
                        <span className="block font-semibold text-sm sm:text-base">{profile.family.fatherName}</span>
                      </div>
                    </div>
                    <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <span className="block text-xs sm:text-sm opacity-70">Mother</span>
                        <span className="block font-semibold text-sm sm:text-base">{profile.family.motherName}</span>
                      </div>
                    </div>
                    <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <span className="block text-xs sm:text-sm opacity-70">Lives with Family</span>
                        <span className="block font-semibold text-sm sm:text-base">{profile.family.livesWithFamily}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className={`mt-6 sm:mt-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className={`p-2 sm:p-3 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} mr-3 sm:mr-4`}>
                    <MapPin className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                  </div>
                  <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Address Information
                  </h2>
                </div>
                <div className={`space-y-4 sm:space-y-6 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <h3 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Current Address</h3>
                    <p className="font-semibold text-sm sm:text-base">{profile.location.street}</p>
                    <p className="text-xs sm:text-sm opacity-70">
                      {profile.location.city}, {profile.location.state} - {profile.location.pincode}
                    </p>
                  </div>
                  <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl ${darkMode ? 'bg-gray-600/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <h3 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Permanent Address {profile.isCurrentPermanentSame === 'Yes' ? '(Same as Current)' : ''}
                    </h3>
                    {profile.isCurrentPermanentSame !== 'Yes' && (
                      <>
                        <p className="font-semibold text-sm sm:text-base">{profile.permanentAddress.street}</p>
                        <p className="text-xs sm:text-sm opacity-70">
                          {profile.permanentAddress.city}, {profile.permanentAddress.state} - {profile.permanentAddress.pincode}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Media & Contact */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8">
                {/* Social Media */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className={`p-2 sm:p-3 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} mr-3 sm:mr-4`}>
                      <Globe className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                    </div>
                    <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Social Media
                    </h2>
                  </div>
                  <div className={`space-y-3 sm:space-y-4 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {profile.socialMedia.facebook !== 'Not specified' && (
                      <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                        <Facebook className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                        <a
                          href={profile.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline font-semibold text-sm sm:text-base truncate"
                        >
                          {profile.socialMedia.facebook}
                        </a>
                      </div>
                    )}
                    {profile.socialMedia.instagram !== 'Not specified' && (
                      <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                        <Instagram className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                        <a
                          href={profile.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline font-semibold text-sm sm:text-base truncate"
                        >
                          {profile.socialMedia.instagram}
                        </a>
                      </div>
                    )}
                    {profile.socialMedia.linkedin !== 'Not specified' && (
                      <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                        <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                        <a
                          href={profile.socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline font-semibold text-sm sm:text-base truncate"
                        >
                          {profile.socialMedia.linkedin}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className={`p-2 sm:p-3 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} mr-3 sm:mr-4`}>
                      <Mail className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                    </div>
                    <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Contact Information
                    </h2>
                  </div>
                  <div className={`space-y-3 sm:space-y-4 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <div className="overflow-hidden">
                        <span className="block text-xs sm:text-sm opacity-70">Email</span>
                        <span className="block font-semibold text-sm sm:text-base truncate">{profile.contact.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <span className="block text-xs sm:text-sm opacity-70">Phone</span>
                        <span className="block font-semibold text-sm sm:text-base">{profile.contact.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Metadata */}
              <div className={`mt-6 sm:mt-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className={`p-2 sm:p-3 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} mr-3 sm:mr-4`}>
                    <Clock className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                  </div>
                  <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Profile Metadata
                  </h2>
                </div>
                <div className={`space-y-3 sm:space-y-4 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                    <div>
                      <span className="block text-xs sm:text-sm opacity-70">Created</span>
                      <span className="block font-semibold text-sm sm:text-base">{profile.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-gray-600/50">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                    <div>
                      <span className="block text-xs sm:text-sm opacity-70">Updated</span>
                      <span className="block font-semibold text-sm sm:text-base">{profile.updatedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ViewProfile;