import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Settings,
  Camera,
  CheckCircle2,
  Pencil,
  MapPin,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Globe,
  Home,
  User
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptionStatus, upgradeToPremium, resetUpgradeSuccess } from '../../redux/slices/subscriptionSlice';
import { getProfile } from '../../redux/slices/profileSlice';
import Header from '../Header';
import Footer from '../Footer';

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  const [profileData, setProfileData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();
  const { status, loading, error, upgradeLoading, upgradeSuccess } = useSelector((state) => state.subscription);
  const { profile: reduxProfile, loading: profileLoading, error: profileError } = useSelector((state) => state.profile);
  const plan = useSelector((state) => state.subscription.plan);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('token');

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Show success message if coming from registration or update
    if (location.state?.registrationSuccess || location.state?.updateSuccess) {
      setShowSuccess(true);
      // Clear the success state after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    // Fetch profile data from server
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getProfile(token))
        .then((result) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('UserProfile: Redux result', result);
            console.log('UserProfile: Payload data', result.payload?.data);
          }
          
          if (result.meta.requestStatus === 'fulfilled' && result.payload.data?.profile) {
            setProfileData(result.payload.data.profile);
          } else if (result.meta.requestStatus === 'fulfilled' && result.payload.data) {
            // If no nested profile object, use the data directly
            setProfileData(result.payload.data);
          } else if (result.meta.requestStatus === 'rejected') {
            // If profile fetch fails, check if user needs to complete registration
            const registrationComplete = localStorage.getItem('registrationComplete');
            if (!registrationComplete) {
              navigate('/matrimony-registration');
            } else {
              // Profile exists but fetch failed, try again or show error
              console.error('Failed to fetch profile:', result.payload);
            }
          }
        });

      dispatch(getSubscriptionStatus(token));
    }
  }, [dispatch, navigate, location.state]);

  // Reset upgrade success message after a few seconds
  useEffect(() => {
    if (upgradeSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetUpgradeSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [upgradeSuccess, dispatch]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleEditProfile = () => {
    navigate('/matrimony-registration', {
      state: { editMode: true }
    });
  };

  if (profileLoading || !profileData) {
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



  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'Not specified';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <Header showAllLinks={true} isLoggedIn={isLoggedIn} />

      {/* Success Message */}
      {showSuccess && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 
          ${darkMode ? 'bg-green-800' : 'bg-green-100'} 
          ${darkMode ? 'text-green-100' : 'text-green-800'} 
          px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{location.state?.updateSuccess ? 'Profile successfully updated!' : 'Profile successfully registered!'}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4 pt-20">
        {/* Subscription Status & Upgrade */}
        <div className={`max-w-4xl mx-auto mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        <div className="p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <span className="font-semibold text-lg">Subscription Status: </span>
            {loading ? (
              <span className="italic">Loading...</span>
            ) : (
              <span className={plan === 'premium' ? 'text-green-600 font-bold' : 'text-yellow-600 font-bold'}>
                {plan === 'premium' ? 'Premium' : 'Free'}
              </span>
            )}
          </div>
          {plan !== 'premium' && (
            <button
              onClick={() => {
                const token = localStorage.getItem('token');
                if (token) dispatch(upgradeToPremium(token));
              }}
              disabled={upgradeLoading}
              className={`mt-4 md:mt-0 px-6 py-2 rounded-lg shadow ${
                darkMode
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
                  : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
              } font-semibold transition-all duration-200`}
            >
              {upgradeLoading ? 'Upgrading...' : 'Upgrade to Premium'}
            </button>
          )}
          {upgradeSuccess && (
            <span className="ml-4 text-green-600 font-semibold">Upgrade successful!</span>
          )}
          {error && (
            <span className="ml-4 text-red-600 font-semibold">{error}</span>
          )}
        </div>
      </div>


        {/* Edit Button - Fixed Position */}
        <div className="fixed bottom-8 right-8 z-20">
          <button
            onClick={handleEditProfile}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg shadow-lg ${
              darkMode 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            } transition-all duration-200 hover:shadow-xl`}
          >
            <Pencil className="w-5 h-5" />
            <span className="text-lg font-medium">Edit Profile</span>
          </button>
        </div>

        <div className={`max-w-4xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          {/* Profile Image Section */}
          <div className="relative p-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className={`w-48 h-64 rounded-lg overflow-hidden shadow-2xl border-4 ${darkMode ? 'border-gray-600' : 'border-white'} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  {profileData.profilePicture ? (
                    <img 
                      src={profileData.profilePicture} 
                      alt={`${profileData.firstName} ${profileData.lastName}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${profileData.profilePicture ? 'hidden' : ''}`}>
                    <User className="w-16 h-16" />
                  </div>
                </div>
                {/* Passport-style border effect */}
                <div className={`absolute inset-0 rounded-lg border-2 ${darkMode ? 'border-gray-500' : 'border-gray-300'} pointer-events-none`}></div>
              </div>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="p-6">
            <h3 className={`text-2xl font-semibold ${
              darkMode ? 'text-red-400' : 'text-red-500'
            } mb-4`}>
              {`${profileData.firstName || 'Unknown'} ${profileData.middleName ? profileData.middleName + ' ' : ''}${profileData.lastName || ''}`}
            </h3>
            

            
            <div className={`space-y-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {/* Basic Information */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Date of Birth</span>
                      <span className="block">{formatDate(profileData.dateOfBirth)}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Age</span>
                      <span className="block">{calculateAge(profileData.dateOfBirth)}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Profile For</span>
                      <span className="block capitalize">{profileData.profileFor?.replace('_', ' ') || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Family Information */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Family Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Father's Name</span>
                      <span className="block">{profileData.fatherName || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Mother's Name</span>
                      <span className="block">{profileData.motherName || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Home className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Lives with Family</span>
                      <span className="block">{profileData.isLivesWithFamily || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Personal Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Mother Tongue</span>
                      <span className="block capitalize">{profileData.motherTongue || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Subcaste</span>
                      <span className="block capitalize">{profileData.subCaste || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Gotra</span>
                      <span className="block">{profileData.gotra || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Marital Status</span>
                      <span className="block capitalize">{profileData.maritalStatus?.replace('_', ' ') || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Food Habits</span>
                      <span className="block capitalize">{profileData.foodHabit?.replace('_', ' ') || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Details */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Education Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Highest Qualification</span>
                      <span className="block capitalize">{profileData.HighestQualification?.replace('_', ' ') || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Specialization</span>
                      <span className="block capitalize">{profileData.specialization?.replace('_', ' ') || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">University/College</span>
                      <span className="block">{profileData.universityCollege || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Year of Completion</span>
                      <span className="block">{profileData.yearOfCompletion || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Details */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Career Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Currently Working</span>
                      <span className="block">{profileData.currentWorking ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Occupation</span>
                      <span className="block capitalize">{profileData.occupation?.replace('_', ' ') || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Company</span>
                      <span className="block">{profileData.company || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Work Location</span>
                      <span className="block">{profileData.workLocation || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Annual Income</span>
                      <span className="block">{profileData.annualIncome ? `${profileData.annualIncome} LPA` : 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Profiles */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Social Media Profiles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profileData.instaUrl && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 mr-3" />
                      <div>
                        <span className="block text-sm opacity-70">Instagram</span>
                        <a href={profileData.instaUrl} target="_blank" rel="noopener noreferrer" 
                           className="block text-red-500 hover:text-red-600">
                          {profileData.instaUrl}
                        </a>
                      </div>
                    </div>
                  )}
                  {profileData.facebookUrl && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 mr-3" />
                      <div>
                        <span className="block text-sm opacity-70">Facebook</span>
                        <a href={profileData.facebookUrl} target="_blank" rel="noopener noreferrer"
                           className="block text-red-500 hover:text-red-600">
                          {profileData.facebookUrl}
                        </a>
                      </div>
                    </div>
                  )}
                  {profileData.linkedinUrl && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 mr-3" />
                      <div>
                        <span className="block text-sm opacity-70">LinkedIn</span>
                        <a href={profileData.linkedinUrl} target="_blank" rel="noopener noreferrer"
                           className="block text-red-500 hover:text-red-600">
                          {profileData.linkedinUrl}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ID Verification */}
              <div>
                <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>ID Verification</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">ID Type</span>
                      <span className="block capitalize">{profileData.idCardName?.replace('_', ' ') || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">ID Number</span>
                      <span className="block">{profileData.idCardNo ? '•'.repeat(8) : 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserProfile;