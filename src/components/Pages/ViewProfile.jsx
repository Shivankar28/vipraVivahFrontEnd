import React, { useEffect } from 'react';
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
  Shield
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileById } from '../../redux/slices/profileSlice';

const ViewProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const dispatch = useDispatch();

  // Get profile, loading, and error from Redux store
  const { selectedProfile, loading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');
    if (!isLoggedIn || !token) {
      navigate('/login');
      return;
    }

    // Fetch profile data
    dispatch(getProfileById({ id, token }));
  }, [id, navigate, dispatch]);

  const handleLogout = () => {
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
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format height (assuming cm)
  const formatHeight = (height) => {
    if (!height) return 'Not specified';
    return `${height} cm`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="p-4 bg-red-100 text-red-600 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!selectedProfile) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="p-4 bg-yellow-100 text-yellow-600 rounded">
          Profile not found
        </div>
      </div>
    );
  }
console.log("selected profile",selectedProfile)
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
      country: 'India' // Default
    },
    permanentAddress: {
      city: selectedProfile.permanentAddress?.city || 'Unknown',
      state: selectedProfile.permanentAddress?.state || 'Unknown',
      street: selectedProfile.permanentAddress?.street || 'Unknown',
      pincode: selectedProfile.permanentAddress?.pincode || 'Unknown'
    },
    isCurrentPermanentSame: selectedProfile.isCurrentPermanentSame ? 'Yes' : 'No',
    education: {
      degree: selectedProfile.HighestQualification || 'Not specified',
      field: selectedProfile.specialization || 'Not specified',
      university: selectedProfile.university || 'Not specified',
      graduationYear: selectedProfile.yearOfCompletion || 'Not specified'
    },
    occupation: {
      profession: selectedProfile.occupation || 'Not specified',
      company: selectedProfile.company || 'Not specified',
      experience: selectedProfile.currentWorking ? `Employed (${selectedProfile.currentWorking})` : 'Not specified',
      income: selectedProfile.annualIncome || 'Not specified',
      workLocation: selectedProfile.workLocation || 'Not specified'
    },
    family: {
      gotra: selectedProfile.gotra || 'Not specified',
      subcaste: selectedProfile.subcaste || 'Not specified',
      fatherName: selectedProfile.fatherName || 'Not specified',
      motherName: selectedProfile.motherName || 'Not specified',
      fatherOccupation: 'Not specified', // Not in schema
      motherOccupation: 'Not specified', // Not in schema
      siblings: 'Not specified', // Not in schema
      livesWithFamily: selectedProfile.isLivesWithFamily || 'Not specified'
    },
    contact: {
      email: selectedProfile.userId?.email || 'Not available',
      phone: selectedProfile.phoneNumber || 'Not available'
    },
    socialMedia: {
      facebook: selectedProfile.facebook || 'Not specified',
      instagram: selectedProfile.instagram || 'Not specified',
      linkedin: selectedProfile.linkedin || 'Not specified'
    },
    idVerification: {
      type: selectedProfile.idVerification?.type || 'Not specified',
      number: selectedProfile.idVerification?.number || 'Not specified'
    },
    about: selectedProfile.about || 'No description provided.',
    preferences: {
      ageRange: 'Not specified', // Not in schema
      height: 'Not specified', // Not in schema
      education: 'Not specified', // Not in schema
      occupation: 'Not specified', // Not in schema
      location: 'Not specified' // Not in schema
    },
    photos: selectedProfile.profilePicture ? [selectedProfile.profilePicture] : ['/api/placeholder/400/500'],
    createdAt: formatDate(selectedProfile.createdAt),
    updatedAt: formatDate(selectedProfile.updatedAt)
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
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

      {/* Main Content */}
      <div className="container mx-auto pt-20 px-4 pb-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
          {/* Profile Header */}
          <div className="relative h-64 bg-gradient-to-r from-red-500 to-red-600">
            <img 
              src={profile.photos[0]} 
              alt={profile.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profile.location.city}, {profile.location.state}
                </span>
                <span className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  {profile.occupation.profession}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg`}>
                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Basic Information
                </h2>
                <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex items-center">
                    <Cake className="w-5 h-5 mr-2" />
                    <span>{profile.age}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    <span>Gender: {profile.gender}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    <span>Height: {profile.height}</span>
                  </div>
                  <div className="flex items-center">
                    <Cake className="w-5 h-5 mr-2" />
                    <span>Date of Birth: {profile.birthDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>Marital Status: {profile.maritalStatus}</span>
                  </div>
                  <div className="flex items-center">
                    <Languages className="w-5 h-5 mr-2" />
                    <span>Mother Tongue: {profile.language}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    <span>Profile For: {profile.profileFor}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    <span>Looking For: {profile.lookingFor}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    <span>Food Habits: {profile.foodHabits}</span>
                  </div>
                </div>
              </div>

              {/* Education & Career */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg`}>
                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Education & Career
                </h2>
                <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex items-start">
                    <GraduationCap className="w-5 h-5 mr-2 mt-1" />
                    <div>
                      <p>{profile.education.degree} in {profile.education.field}</p>
                      <p className="text-sm">{profile.education.university}</p>
                      <p className="text-sm">Graduated: {profile.education.graduationYear}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Briefcase className="w-5 h-5 mr-2 mt-1" />
                    <div>
                      <p>{profile.occupation.profession}</p>
                      <p className="text-sm">Company: {profile.occupation.company}</p>
                      <p className="text-sm">Status: {profile.occupation.experience}</p>
                      <p className="text-sm">Income: {profile.occupation.income}</p>
                      <p className="text-sm">Location: {profile.occupation.workLocation}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Family Background */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg`}>
                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Family Background
                </h2>
                <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span>Gotra: {profile.family.gotra}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span>Subcaste: {profile.family.subcaste}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span>Father: {profile.family.fatherName}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span>Mother: {profile.family.motherName}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span>Lives with Family: {profile.family.livesWithFamily}</span>
                  </div>
                  <div>
                    <p>Father Occupation: {profile.family.fatherOccupation}</p>
                    <p>Mother Occupation: {profile.family.motherOccupation}</p>
                    <p>Siblings: {profile.family.siblings}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className={`mt-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Address Information
              </h2>
              <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div>
                  <p><strong>Current Address:</strong></p>
                  <p>{profile.location.street}</p>
                  <p>{profile.location.city}, {profile.location.state} - {profile.location.pincode}</p>
                </div>
                <div>
                  <p><strong>Permanent Address:</strong> {profile.isCurrentPermanentSame === 'Yes' ? 'Same as Current' : ''}</p>
                  {profile.isCurrentPermanentSame !== 'Yes' && (
                    <>
                      <p>{profile.permanentAddress.street}</p>
                      <p>{profile.permanentAddress.city}, {profile.permanentAddress.state} - {profile.permanentAddress.pincode}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className={`mt-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Social Media
              </h2>
              <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="flex items-center">
                  <Facebook className="w-5 h-5 mr-2" />
                  <a href={profile.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {profile.socialMedia.facebook}
                  </a>
                </div>
                <div className="flex items-center">
                  <Instagram className="w-5 h-5 mr-2" />
                  <a href={profile.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {profile.socialMedia.instagram}
                  </a>
                </div>
                <div className="flex items-center">
                  <Linkedin className="w-5 h-5 mr-2" />
                  <a href={profile.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {profile.socialMedia.linkedin}
                  </a>
                </div>
              </div>
            </div>

            {/* Verification */}
            <div className={`mt-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Verification
              </h2>
              <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  <span>ID Type: {profile.idVerification.type}</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  <span>ID Number: {profile.idVerification.number}</span>
                </div>
              </div>
            </div>

            {/* About Me */}
            <div className={`mt-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                About Me
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {profile.about}
              </p>
            </div>

            {/* Partner Preferences */}
            <div className={`mt-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Partner Preferences
              </h2>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div>
                  <p><strong>Age:</strong> {profile.preferences.ageRange}</p>
                  <p><strong>Height:</strong> {profile.preferences.height}</p>
                </div>
                <div>
                  <p><strong>Education:</strong> {profile.preferences.education}</p>
                  <p><strong>Location:</strong> {profile.preferences.location}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className={`mt-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Contact Information
              </h2>
              <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>{profile.contact.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>{profile.contact.phone}</span>
                </div>
              </div>
            </div>

            {/* Profile Metadata */}
            <div className={`mt-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Profile Metadata
              </h2>
              <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>Created: {profile.createdAt}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>Updated: {profile.updatedAt}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center space-x-4">
              <button className={`flex items-center px-6 py-3 rounded-lg ${
                darkMode 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-red-500 hover:bg-red-600'
              } text-white transition-colors`}>
                <HeartIcon className="w-5 h-5 mr-2" />
                Express Interest
              </button>
              <button className={`flex items-center px-6 py-3 rounded-lg ${
                darkMode 
                  ? 'bg-gray-600 hover:bg-gray-700' 
                  : 'bg-gray-100 hover:bg-gray-200'
              } ${darkMode ? 'text-white' : 'text-gray-800'} transition-colors`}>
                <MessageSquare className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;