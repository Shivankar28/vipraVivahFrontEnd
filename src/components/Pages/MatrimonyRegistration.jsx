import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { HeartHandshake, Moon, Sun, Save, ArrowLeft, Upload, Camera } from 'lucide-react';
import { createUpdateProfile, getProfile } from '../../redux/slices/profileSlice';
import { handleApiError } from '../../api/APIUtils';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

const isDev = process.env.NODE_ENV === 'development';

// Static subtitles for form sections
const getSubtitle = (section) => {
  switch (section) {
    case 'Profile For Section':
      return 'Specify who this profile is being created for';
    case 'Basic Information':
      return 'Enter your personal identification details';
    case 'Family Information':
      return 'Share details about your family background';
    case 'Personal Details':
      return 'Tell us more about yourself and your preferences';
    case 'Education Details':
      return 'Share your educational background and achievements';
    case 'Career Details':
      return 'Provide information about your professional life';
    case 'Social Media Profiles':
      return 'Add your social media handles (optional)';
    case 'ID Verification':
      return 'Help us verify your identity';
    default:
      return '';
  }
};

export default function MatrimonyRegistration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode, toggleDarkMode } = useTheme();
  const { profile, loading: reduxLoading, error: reduxError } = useSelector((state) => state.profile);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isProfileFlag, setIsProfileFlag] = useState(false);
  const [formData, setFormData] = useState({
    profileFor: '',
    gender: '',
    phoneNumber: '',
    firstName: '',
    middleName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    subCaste: '',
    gotra: '',
    motherTongue: '',
    lookingFor: '',
    height: '',
    currentAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
    permanentAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      sameAsTemporary: false,
    },
    isLivesWithFamily: null,
    maritalStatus: '',
    foodHabit: '',
    highestQualification: '',
    specialization: '',
    university: '',
    yearOfCompletion: '',
    currentWorking: null,
    occupation: '',
    company: '',
    workLocation: '',
    annualIncome: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    idVerificationType: '',
    idVerificationNumber: '',
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');
    if (isDev) console.log('MatrimonyRegistration: Token', token);

    if (!isLoggedIn || !token) {
      if (isDev) {
        console.group('MatrimonyRegistration: useEffect');
        console.log('No login or token found, redirecting to /login');
        console.groupEnd();
      }
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (isDev) console.log('Decoded Token:', decoded);
      setIsProfileFlag(decoded.isProfileFlag || false);
    } catch (err) {
      if (isDev) console.error('Token decode error:', err);
      setFormError('Invalid or expired token. Please log in again.');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (isProfileFlag) {
      const token = localStorage.getItem('token');
      if (isDev) console.group('MatrimonyRegistration: Fetch Profile');
      dispatch(getProfile(token)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled' && result.payload.data?.profile) {
          const profileData = result.payload.data.profile;
          if (isDev) console.log('Profile fetched:', profileData);
          setFormData((prev) => ({
            ...prev,
            profileFor: profileData.profileFor || '',
            gender: profileData.gender || '',
            phoneNumber: profileData.phoneNumber || '',
            firstName: profileData.firstName || '',
            middleName: profileData.middleName || '',
            lastName: profileData.lastName || '',
            fatherName: profileData.fatherName || '',
            motherName: profileData.motherName || '',
            dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : '',
            subCaste: profileData.subcaste || '',
            gotra: profileData.gotra || '',
            motherTongue: profileData.motherTongue || '',
            lookingFor: profileData.lookingFor || '',
            height: profileData.height || '',
            currentAddress: {
              street: profileData.currentAddress?.street || '',
              city: profileData.currentAddress?.city || '',
              state: profileData.currentAddress?.state || '',
              pincode: profileData.currentAddress?.pincode || '',
            },
            permanentAddress: {
              street: profileData.permanentAddress?.street || '',
              city: profileData.permanentAddress?.city || '',
              state: profileData.permanentAddress?.state || '',
              pincode: profileData.permanentAddress?.pincode || '',
              sameAsTemporary: profileData.isCurrentPermanentSame || false,
            },
            isLivesWithFamily: profileData.isLivesWithFamily || null,
            maritalStatus: profileData.maritalStatus || '',
            foodHabit: profileData.foodHabits || '',
            highestQualification: profileData.HighestQualification || '',
            specialization: profileData.specialization || '',
            university: profileData.university || '',
            yearOfCompletion: profileData.yearOfCompletion || '',
            currentWorking: profileData.currentWorking || null,
            occupation: profileData.occupation || '',
            company: profileData.company || '',
            workLocation: profileData.workLocation || '',
            annualIncome: profileData.annualIncome || '',
            instagram: profileData.instagram || '',
            facebook: profileData.facebook || '',
            linkedin: profileData.linkedin || '',
            idVerificationType: profileData.idVerification?.type || '',
            idVerificationNumber: profileData.idVerification?.number || '',
          }));
          if (profileData.profilePicture) {
            setProfileImagePreview(profileData.profilePicture);
          }
        } else if (result.meta.requestStatus === 'rejected') {
          if (isDev) console.error('Fetch Profile Error:', result.payload);
          setFormError(handleApiError(result.payload));
          if (result.payload?.statusCode === 401) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('token');
            navigate('/login');
          }
        }
      });
      if (isDev) console.groupEnd();
    }
  }, [isProfileFlag, dispatch, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isDev) console.group('MatrimonyRegistration: handleInputChange');
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setFormError('');
    if (isDev) {
      console.log('Input:', { name, value });
      console.groupEnd();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (isDev) console.group('MatrimonyRegistration: handleImageChange');
    if (file) {
      const filetypes = /jpeg|jpg|png/;
      const isValidType = filetypes.test(file.type) && filetypes.test(file.name.split('.').pop().toLowerCase());
      if (!isValidType) {
        setFormError('Only JPEG or PNG images are allowed');
        if (isDev) console.error('Invalid file type:', file.type);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image size should be less than 5MB');
        if (isDev) console.error('Image size exceeds 5MB');
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
        if (isDev) console.log('Image preview set');
      };
      reader.readAsDataURL(file);
    }
    setFormError('');
    if (isDev) {
      console.log('Selected file:', file?.name);
      console.groupEnd();
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return '';
    const today = new Date();
    const birthDate = new Date(dob);
    if (isNaN(birthDate)) return '';
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handleDateOfBirthChange = (e) => {
    const dob = e.target.value;
    if (isDev) {
      console.group('MatrimonyRegistration: handleDateOfBirthChange');
      console.log('DOB:', dob);
      console.groupEnd();
    }
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: dob,
    }));
    setFormError('');
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (isDev) console.group('MatrimonyRegistration: handleCheckboxChange');
    if (name === 'permanentAddress.sameAsTemporary') {
      setFormData((prev) => ({
        ...prev,
        permanentAddress: {
          ...prev.permanentAddress,
          sameAsTemporary: checked,
          ...(checked && {
            street: prev.currentAddress.street,
            city: prev.currentAddress.city,
            state: prev.currentAddress.state,
            pincode: prev.currentAddress.pincode,
          }),
        },
      }));
    }
    setFormError('');
    if (isDev) {
      console.log('Checkbox:', { name, checked });
      console.groupEnd();
    }
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    if (isDev) console.group('MatrimonyRegistration: handleRadioChange');
    setFormData((prev) => ({
      ...prev,
      [name]: value === 'Yes' ? 'Yes' : value === 'No' ? 'No' : null,
    }));
    setFormError('');
    if (isDev) {
      console.log('Radio:', { name, value });
      console.groupEnd();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    const token = localStorage.getItem('token');

    if (isDev) console.group('MatrimonyRegistration: handleSubmit');
    try {
      // Required fields validation
      const requiredFields = {
        profileFor: formData.profileFor,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        dateOfBirth: formData.dateOfBirth,
        subCaste: formData.subCaste,
        gotra: formData.gotra,
        motherTongue: formData.motherTongue,
        lookingFor: formData.lookingFor,
        height: formData.height,
        maritalStatus: formData.maritalStatus,
        foodHabit: formData.foodHabit,
        highestQualification: formData.highestQualification,
        specialization: formData.specialization,
        university: formData.university,
        yearOfCompletion: formData.yearOfCompletion,
        currentWorking: formData.currentWorking,
        occupation: formData.occupation,
        company: formData.company,
        workLocation: formData.workLocation,
        annualIncome: formData.annualIncome,
        ...(isProfileFlag ? {} : { // Conditionally include ID verification fields
          idVerificationType: formData.idVerificationType,
          idVerificationNumber: formData.idVerificationNumber,
        }),
      };

      // Validate currentAddress (at least one field required)
      const hasCurrentAddress = ['street', 'city', 'state', 'pincode'].some(
        (field) => formData.currentAddress[field]
      );

      // Validate permanentAddress if sameAsTemporary is false
      const hasPermanentAddress = formData.permanentAddress.sameAsTemporary
        ? true
        : ['street', 'city', 'state', 'pincode'].some((field) => formData.permanentAddress[field]);

      // Check for missing required fields
      const missingFields = Object.keys(requiredFields).filter((key) => !requiredFields[key]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in required fields: ${missingFields.join(', ')}`);
      }
      if (!/^\d{10}$/.test(formData.phoneNumber)) {
        throw new Error('Phone number must be 10 digits');
      }
      if (!hasCurrentAddress) {
        throw new Error('At least one current address field is required');
      }
      if (!hasPermanentAddress) {
        throw new Error('At least one permanent address field is required when not same as current address');
      }
      if (!profileImage && !profileImagePreview) {
        throw new Error('Profile photo is required');
      }
      if (formData.isLivesWithFamily === null) {
        throw new Error('Please specify if you live with family');
      }

      const result = await dispatch(
        createUpdateProfile({ token, profileData: formData, profilePhoto: profileImage })
      ).unwrap();
      if (result.data?.profile) {
        if (isDev) console.log('Profile saved successfully:', result);
        localStorage.setItem('registrationComplete', 'true');
        localStorage.setItem('isProfileFlag', 'true');
        localStorage.removeItem('isNewUser');
        navigate('/explore', { replace: true });
      } else {
        throw new Error(result.message || 'Failed to save profile');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      setFormError(errorMessage);
      if (isDev) {
        console.error('Submit Error:', error);
        if (error?.statusCode === 401) {
          console.log('Unauthorized, redirecting to /login');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    } finally {
      setFormLoading(false);
      if (isDev) console.groupEnd();
    }
  };

  if (reduxLoading && isProfileFlag) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-12`}>
      <header className="w-full fixed top-0 left-0 z-10 bg-opacity-95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center relative">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center space-x-2 ${
                darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'
              } transition-colors duration-200`}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
              <HeartHandshake className={`w-8 h-8 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              <span className="flex items-baseline">
                <span
                  className={`text-3xl font-extrabold tracking-tight ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  } mr-1`}
                >
                  विप्रVivah
                </span>
              </span>
            </Link>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all duration-200 ${
                darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400 hover:text-yellow-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
              }`}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 pt-24 pb-12">
        <div
          className={`max-w-5xl mx-auto ${
            darkMode ? 'bg-gray-800/50' : 'bg-white'
          } rounded-xl shadow-xl backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
        >
          <div
            className={`px-10 py-8 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {isProfileFlag ? 'Edit My Profile' : 'Create My Profile'}
            </h1>
            <p className={`mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Fill in your details to {isProfileFlag ? 'update' : 'create'} your matrimony profile. Fields
              marked with <span className="text-red-500">*</span> are required.
            </p>
          </div>
          {(formError || reduxError) && (
            <div className="px-10 pt-6">
              <div className="p-4 rounded-lg bg-red-100 text-red-600 text-sm" role="alert">
                {formError || handleApiError(reduxError)}
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="p-10 space-y-12" aria-label="Profile registration form">
            <section
              className={`flex flex-col items-center space-y-6 pb-12 border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
              aria-label="Profile photo upload"
            >
              <div
                className={`w-48 h-48 rounded-full overflow-hidden border-4 ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                } shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <Camera
                      className={`w-20 h-20 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
              <label
                className={`inline-flex items-center px-8 py-4 rounded-lg cursor-pointer ${
                  darkMode
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } transition-all duration-200 shadow-md hover:shadow-lg`}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageChange}
                  className="hidden"
                  aria-label="Upload profile photo"
                  required={!profileImagePreview} // Required if no image is already set
                />
                <Upload className="w-5 h-5 mr-3" aria-hidden="true" />
                <span className="text-lg">Upload Profile Photo <span className="text-red-200">*</span></span>
              </label>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Maximum file size: 5MB. Only JPEG/PNG allowed. <span className="text-red-500">*Required</span>
              </p>
            </section>
            {[
              'Profile For Section',
              'Basic Information',
              'Family Information',
              'Personal Details',
              'Education Details',
              'Career Details',
              'Social Media Profiles',
              ...(isProfileFlag ? [] : ['ID Verification']), // Conditionally include ID Verification
            ].map((section, index) => (
              <section
                key={index}
                className={`space-y-8 pb-12 ${
                  index < (isProfileFlag ? 6 : 7) ? (darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200') : ''
                } ${darkMode ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'} rounded-lg transition-colors duration-200 p-6`}
                aria-label={section}
              >
                <div className="space-y-2">
                  <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {section}
                  </h2>
                  <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getSubtitle(section)}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section === 'Profile For Section' && (
                    <>
                      <div className="col-span-full">
                        <label
                          htmlFor="profileFor"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Profile For <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <select
                          id="profileFor"
                          name="profileFor"
                          value={formData.profileFor}
                          onChange={handleInputChange}
                          className={`mt-1 px-[0.3vw] block w-full rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        >
                          <option value="">Select</option>
                          <option value="self">Self</option>
                          <option value="son">Son</option>
                          <option value="daughter">Daughter</option>
                          <option value="brother">Brother</option>
                          <option value="sister">Sister</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="gender"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Gender <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className={`mt-1 px-[0.3vw] block w-full rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="lookingFor"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Looking For <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <select
                          id="lookingFor"
                          name="lookingFor"
                          value={formData.lookingFor}
                          onChange={handleInputChange}
                          className={`mt-1 px-[0.3vw] block w-full rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </>
                  )}
                  {section === 'Basic Information' && (
                    <>
                      <div>
                        <label
                          htmlFor="firstName"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          First Name <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`mt-1 px-[0.3vw] block w-full rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="middleName"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Middle Name
                        </label>
                        <input
                          type="text"
                          id="middleName"
                          name="middleName"
                          value={formData.middleName}
                          onChange={handleInputChange}
                          className={`mt-1 px-[0.3vw] block w-full rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Last Name <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Phone Number <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                          pattern="\d{10}"
                        />
                      </div>
                    </>
                  )}
                  {section === 'Family Information' && (
                    <>
                      <div>
                        <label
                          htmlFor="fatherName"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Father's Name <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="text"
                          id="fatherName"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="motherName"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Mother's Name <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="text"
                          id="motherName"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <fieldset>
                          <legend
                            className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            Lives with Family <span className="text-red-500" aria-hidden="true">*</span>
                          </legend>
                          <div className="mt-2 space-x-4">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name="isLivesWithFamily"
                                value="Yes"
                                checked={formData.isLivesWithFamily === 'Yes'}
                                onChange={handleRadioChange}
                                className="form-radio text-red-500"
                                aria-label="Lives with family: Yes"
                                required
                              />
                              <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Yes
                              </span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name="isLivesWithFamily"
                                value="No"
                                checked={formData.isLivesWithFamily === 'No'}
                                onChange={handleRadioChange}
                                className="form-radio text-red-500"
                                aria-label="Lives with family: No"
                                required
                              />
                              <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                No
                              </span>
                            </label>
                          </div>
                        </fieldset>
                      </div>
                    </>
                  )}
                  {section === 'Personal Details' && (
                    <>
                      <div>
                        <label
                          htmlFor="dateOfBirth"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Date of Birth <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleDateOfBirthChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="height"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Height (cm) <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="number"
                          id="height"
                          name="height"
                          value={formData.height}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                          placeholder="e.g., 170"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="subCaste"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Subcaste <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <select
                          id="subCaste"
                          name="subCaste"
                          value={formData.subCaste}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        >
                          <option value="">Select Subcaste</option>
                          <option value="chitpavan">Chitpavan</option>
                          <option value="deshastha">Deshastha</option>
                          <option value="karhade">Karhade</option>
                          <option value="kokanastha">Kokanastha</option>
                          <option value="saraswat">Saraswat</option>
                          <option value="gaud_saraswat">Gaud Saraswat</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="gotra"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Gotra <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="text"
                          id="gotra"
                          name="gotra"
                          value={formData.gotra}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="motherTongue"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Mother Tongue <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <select
                          id="motherTongue"
                          name="motherTongue"
                          value={formData.motherTongue}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        >
                          <option value="">Select Mother Tongue</option>
                          <option value="marathi">Marathi</option>
                          <option value="hindi">Hindi</option>
                          <option value="gujarati">Gujarati</option>
                          <option value="konkani">Konkani</option>
                          <option value="bengali">Bengali</option>
                          <option value="tamil">Tamil</option>
                          <option value="telugu">Telugu</option>
                          <option value="kannada">Kannada</option>
                          <option value="malayalam">Malayalam</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="maritalStatus"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Marital Status <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <select
                          id="maritalStatus"
                          name="maritalStatus"
                          value={formData.maritalStatus}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        >
                          <option value="">Select</option>
                          <option value="never_married">Never Married</option>
                          <option value="divorced">Divorced</option>
                          <option value="widowed">Widowed</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="foodHabit"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Food Habits <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <select
                          id="foodHabit"
                          name="foodHabit"
                          value={formData.foodHabit}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        >
                          <option value="">Select</option>
                          <option value="vegetarian">Vegetarian</option>
                          <option value="non_vegetarian">Non-vegetarian</option>
                          <option value="eggetarian">Eggetarian</option>
                        </select>
                      </div>
                      <div className="col-span-full">
                        <fieldset>
                          <legend
                            className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            Current Address <span className="text-red-500" aria-hidden="true">*</span>
                          </legend>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                            <input
                              type="text"
                              name="currentAddress.street"
                              value={formData.currentAddress.street}
                              onChange={handleInputChange}
                              placeholder="Street"
                              className={`block w-full rounded-md ${
                                darkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              } shadow-sm focus:border-red-500 focus:ring-red-500`}
                              aria-label="Current address: Street"
                            />
                            <input
                              type="text"
                              name="currentAddress.city"
                              value={formData.currentAddress.city}
                              onChange={handleInputChange}
                              placeholder="City"
                              className={`block w-full rounded-md ${
                                darkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              } shadow-sm focus:border-red-500 focus:ring-red-500`}
                              aria-label="Current address: City"
                            />
                            <input
                              type="text"
                              name="currentAddress.state"
                              value={formData.currentAddress.state}
                              onChange={handleInputChange}
                              placeholder="State"
                              className={`block w-full rounded-md ${
                                darkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              } shadow-sm focus:border-red-500 focus:ring-red-500`}
                              aria-label="Current address: State"
                            />
                            <input
                              type="text"
                              name="currentAddress.pincode"
                              value={formData.currentAddress.pincode}
                              onChange={handleInputChange}
                              placeholder="Pincode"
                              className={`block w-full rounded-md ${
                                darkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              } shadow-sm focus:border-red-500 focus:ring-red-500`}
                              aria-label="Current address: Pincode"
                            />
                          </div>
                          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            At least one field (Street, City, State, or Pincode) is required.
                          </p>
                        </fieldset>
                      </div>
                      <div className="col-span-full">
                        <fieldset>
                          <legend
                            className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            Permanent Address
                          </legend>
                          <div className="mt-2">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                name="permanentAddress.sameAsTemporary"
                                checked={formData.permanentAddress.sameAsTemporary}
                                onChange={handleCheckboxChange}
                                className="form-checkbox text-red-500"
                                aria-label="Permanent address same as current address"
                              />
                              <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Same as Current Address
                              </span>
                            </label>
                          </div>
                          {!formData.permanentAddress.sameAsTemporary && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                              <input
                                type="text"
                                name="permanentAddress.street"
                                value={formData.permanentAddress.street}
                                onChange={handleInputChange}
                                placeholder="Street"
                                className={`block w-full rounded-md ${
                                  darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                } shadow-sm focus:border-red-500 focus:ring-red-500`}
                                aria-label="Permanent address: Street"
                              />
                              <input
                                type="text"
                                name="permanentAddress.city"
                                value={formData.permanentAddress.city}
                                onChange={handleInputChange}
                                placeholder="City"
                                className={`block w-full rounded-md ${
                                  darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                } shadow-sm focus:border-red-500 focus:ring-red-500`}
                                aria-label="Permanent address: City"
                              />
                              <input
                                type="text"
                                name="permanentAddress.state"
                                value={formData.permanentAddress.state}
                                onChange={handleInputChange}
                                placeholder="State"
                                className={`block w-full rounded-md ${
                                  darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                } shadow-sm focus:border-red-500 focus:ring-red-500`}
                                aria-label="Permanent address: State"
                              />
                              <input
                                type="text"
                                name="permanentAddress.pincode"
                                value={formData.permanentAddress.pincode}
                                onChange={handleInputChange}
                                placeholder="Pincode"
                                className={`block w-full rounded-md ${
                                  darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                } shadow-sm focus:border-red-500 focus:ring-red-500`}
                                aria-label="Permanent address: Pincode"
                              />
                            </div>
                          )}
                          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formData.permanentAddress.sameAsTemporary
                              ? 'Permanent address will be same as current address.'
                              : 'At least one field (Street, City, State, or Pincode) is required.'}
                          </p>
                        </fieldset>
                      </div>
                    </>
                  )}
                  {section === 'Education Details' && (
                    <>
                      <div>
                        <label
                          htmlFor="highestQualification"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Highest Qualification <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <select
                          id="highestQualification"
                          name="highestQualification"
                          value={formData.highestQualification}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        >
                          <option value="">Select Qualification</option>
                          <option value="high_school">High School</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="diploma">Diploma</option>
                          <option value="bachelors">Bachelor's Degree</option>
                          <option value="masters">Master's Degree</option>
                          <option value="phd">Ph.D.</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="specialization"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Specialization <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <select
                          id="specialization"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        >
                          <option value="">Select Specialization</option>
                          <option value="computer_science">Computer Science</option>
                          <option value="information_technology">Information Technology</option>
                          <option value="mechanical">Mechanical Engineering</option>
                          <option value="electrical">Electrical Engineering</option>
                          <option value="civil">Civil Engineering</option>
                          <option value="medicine">Medicine</option>
                          <option value="commerce">Commerce</option>
                          <option value="arts">Arts</option>
                          <option value="science">Science</option>
                          <option value="management">Management</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="university"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          University/College <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="text"
                          id="university"
                          name="university"
                          value={formData.university}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="yearOfCompletion"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Year of Completion <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="text"
                          id="yearOfCompletion"
                          name="yearOfCompletion"
                          value={formData.yearOfCompletion}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        />
                      </div>
                    </>
                  )}
                  {section === 'Career Details' && (
                    <>
                      <div>
                        <fieldset>
                          <legend
                            className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            Currently Working <span className="text-red-500" aria-hidden="true">*</span>
                          </legend>
                          <div className="mt-2 space-x-4">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name="currentWorking"
                                value="Yes"
                                checked={formData.currentWorking === 'Yes'}
                                onChange={handleRadioChange}
                                className="form-radio text-red-500"
                                aria-label="Currently working: Yes"
                                required
                              />
                              <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Yes
                              </span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name="currentWorking"
                                value="No"
                                checked={formData.currentWorking === 'No'}
                                onChange={handleRadioChange}
                                className="form-radio text-red-500"
                                aria-label="Currently working: No"
                                required
                              />
                              <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                No
                              </span>
                            </label>
                          </div>
                        </fieldset>
                      </div>
                      <div>
                        <label
                          htmlFor="occupation"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Occupation <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <select
                          id="occupation"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        >
                          <option value="">Select Occupation</option>
                          <option value="software_engineer">Software Engineer</option>
                          <option value="doctor">Doctor</option>
                          <option value="engineer">Engineer</option>
                          <option value="teacher">Teacher</option>
                          <option value="business_owner">Business Owner</option>
                          <option value="chartered_accountant">Chartered Accountant</option>
                          <option value="lawyer">Lawyer</option>
                          <option value="banker">Banker</option>
                          <option value="government_employee">Government Employee</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="company"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Company <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="workLocation"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Work Location <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="text"
                          id="workLocation"
                          name="workLocation"
                          value={formData.workLocation}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="annualIncome"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Annual Income <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <select
                          id="annualIncome"
                          name="annualIncome"
                          value={formData.annualIncome}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        >
                          <option value="">Select Annual Income</option>
                          <option value="0-3">Below 3 LPA</option>
                          <option value="3-5">3-5 LPA</option>
                          <option value="5-7">5-7 LPA</option>
                          <option value="7-10">7-10 LPA</option>
                          <option value="10-15">10-15 LPA</option>
                          <option value="15-20">15-20 LPA</option>
                          <option value="20-30">20-30 LPA</option>
                          <option value="30-50">30-50 LPA</option>
                          <option value="50+">Above 50 LPA</option>
                        </select>
                      </div>
                    </>
                  )}
                  {section === 'Social Media Profiles' && (
                    <>
                      <div>
                        <label
                          htmlFor="instagram"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Instagram Profile
                        </label>
                        <input
                          type="text"
                          id="instagram"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="facebook"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          Facebook Profile
                        </label>
                        <input
                          type="text"
                          id="facebook"
                          name="facebook"
                          value={formData.facebook}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="linkedin"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          LinkedIn Profile
                        </label>
                        <input
                          type="text"
                          id="linkedin"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                        />
                      </div>
                    </>
                  )}
                  {section === 'ID Verification' && !isProfileFlag && (
                    <>
                      <div>
                        <label
                          htmlFor="idVerificationType"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          ID Type <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <select
                          id="idVerificationType"
                          name="idVerificationType"
                          value={formData.idVerificationType}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        >
                          <option value="">Select</option>
                          <option value="aadhar">Aadhar Card</option>
                          <option value="pan">PAN Card</option>
                          <option value="passport">Passport</option>
                          <option value="driving_license">Driving License</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="idVerificationNumber"
                          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          ID Number <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="text"
                          id="idVerificationNumber"
                          name="idVerificationNumber"
                          value={formData.idVerificationNumber}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-[0.3vw] rounded-md ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          required
                          aria-required="true"
                        />
                      </div>
                    </>
                  )}
                </div>
              </section>
            ))}
            <div
              className={`flex justify-end space-x-6 pt-8 mt-12 border-t ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`px-8 py-4 rounded-lg text-lg transition-all duration-200 ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } shadow-sm hover:shadow-md`}
                aria-label="Cancel and go back"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading || reduxLoading}
                className={`px-8 py-4 rounded-lg text-lg transition-all duration-200 flex items-center ${
                  formLoading || reduxLoading
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    : darkMode
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                } shadow-sm hover:shadow-md`}
                aria-label="Save profile"
              >
                <Save className="w-5 h-5 mr-2" aria-hidden="true" />
                {formLoading || reduxLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}