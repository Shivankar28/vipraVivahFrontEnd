import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Home,
  Settings,
  Search,
  User,
  LogOut,
  Camera,
  Moon,
  Sun,
  HeartHandshake,
  CheckCircle2,
  Pencil,
  MapPin,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Globe
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  const [profileData, setProfileData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Check if registration is complete
    const registrationComplete = localStorage.getItem('registrationComplete');
    if (!registrationComplete) {
      navigate('/matrimony-registration');
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

    // Load profile data from localStorage
    const loadProfileData = () => {
      const savedData = localStorage.getItem('profileData');
      if (savedData) {
        setProfileData(JSON.parse(savedData));
      } else {
        // If no profile data, redirect to registration
        navigate('/matrimony-registration');
      }
    };

    loadProfileData();
  }, [navigate, location.state]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleEditProfile = () => {
    navigate('/matrimony-registration', {
      state: { editMode: true }
    });
  };

  if (!profileData) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="flex justify-center items-center h-screen">
          Loading...
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

      {/* Navigation Bar */}
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-red-500'} text-white p-4 fixed w-full z-10`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <HeartHandshake className="w-8 h-8" />
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

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4 pt-20">
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
          <div className="relative">
            <div className="w-full h-64 bg-gray-300">
              {profileData.profileImage ? (
                <img 
                  src={profileData.profileImage} 
                  alt={profileData.fullName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <User className={`w-32 h-32 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
              )}
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="p-6">
            <h3 className={`text-2xl font-semibold ${
              darkMode ? 'text-red-400' : 'text-red-500'
            } mb-4`}>
              {`${profileData.firstName} ${profileData.middleName ? profileData.middleName + ' ' : ''}${profileData.lastName}`}
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
                      <span className="block">{profileData.fathersName || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Mother's Name</span>
                      <span className="block">{profileData.mothersName || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Home className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Lives with Family</span>
                      <span className="block">{profileData.livesWithFamily ? 'Yes' : 'No'}</span>
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
                      <span className="block capitalize">{profileData.subcaste || 'Not specified'}</span>
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
                      <span className="block capitalize">{profileData.foodHabits?.replace('_', ' ') || 'Not specified'}</span>
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
                      <span className="block capitalize">{profileData.education?.highestQualification?.replace('_', ' ') || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Specialization</span>
                      <span className="block capitalize">{profileData.education?.specialization?.replace('_', ' ') || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">University/College</span>
                      <span className="block">{profileData.education?.university || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Year of Completion</span>
                      <span className="block">{profileData.education?.yearOfCompletion || 'Not specified'}</span>
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
                      <span className="block">{profileData.career?.currentlyWorking ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Occupation</span>
                      <span className="block capitalize">{profileData.career?.occupation?.replace('_', ' ') || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Company</span>
                      <span className="block">{profileData.career?.company || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Work Location</span>
                      <span className="block">{profileData.career?.workLocation || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">Annual Income</span>
                      <span className="block">{profileData.career?.annualIncome ? `${profileData.career.annualIncome} LPA` : 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Profiles */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Social Media Profiles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profileData.socialMedia?.instagram && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 mr-3" />
                      <div>
                        <span className="block text-sm opacity-70">Instagram</span>
                        <a href={`https://instagram.com/${profileData.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer" 
                           className="block text-red-500 hover:text-red-600">
                          @{profileData.socialMedia.instagram}
                        </a>
                      </div>
                    </div>
                  )}
                  {profileData.socialMedia?.facebook && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 mr-3" />
                      <div>
                        <span className="block text-sm opacity-70">Facebook</span>
                        <a href={`https://facebook.com/${profileData.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer"
                           className="block text-red-500 hover:text-red-600">
                          {profileData.socialMedia.facebook}
                        </a>
                      </div>
                    </div>
                  )}
                  {profileData.socialMedia?.linkedin && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 mr-3" />
                      <div>
                        <span className="block text-sm opacity-70">LinkedIn</span>
                        <a href={`https://linkedin.com/in/${profileData.socialMedia.linkedin}`} target="_blank" rel="noopener noreferrer"
                           className="block text-red-500 hover:text-red-600">
                          {profileData.socialMedia.linkedin}
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
                      <span className="block capitalize">{profileData.idVerification?.type?.replace('_', ' ') || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3" />
                    <div>
                      <span className="block text-sm opacity-70">ID Number</span>
                      <span className="block">{'•'.repeat(8)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;