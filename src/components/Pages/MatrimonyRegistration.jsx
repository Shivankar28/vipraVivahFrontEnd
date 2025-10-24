import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { HeartHandshake, Moon, Sun, Save, ArrowLeft, Upload, Camera, UserPlus, Sparkles, GraduationCap, Briefcase, Globe, Shield, Heart, Settings } from 'lucide-react';
import { createUpdateProfile, getProfile } from '../../redux/slices/profileSlice';
import { handleApiError } from '../../api/APIUtils';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import { notifyProfileCreated, notifyProfileUpdated } from '../../utils/notificationUtils';
import Header from '../Header';
import Footer from '../Footer';

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
    case 'Preferences':
      return 'Set your partner preferences for better matches';
    default:
      return '';
  }
};

export default function MatrimonyRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { darkMode, toggleDarkMode } = useTheme();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('token');
  const { profile, loading: reduxLoading, error: reduxError } = useSelector((state) => state.profile);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isProfileFlag, setIsProfileFlag] = useState(false);
  const [preferencesLoading, setPreferencesLoading] = useState(false);
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
    profileForOther: '',
    genderOther: '',
    lookingForOther: '',
    subCasteOther: '',
    motherTongueOther: '',
    
    // Preferences Section
    preferences: {
      preferredAgeRange: { min: 18, max: 80 },
      preferredHeight: { min: '', max: '' },
      preferredEducation: [],
      preferredOccupation: [],
      preferredIncome: { min: '', max: '' },
      preferredCities: [],
      preferredStates: [],
      preferredCountries: [],
      preferredCaste: [],
      preferredSubCaste: [],
      preferredGotra: [],
      preferredMotherTongue: [],
      preferredMaritalStatus: [],
      preferredFoodHabit: [],
      preferredFamilyType: [],
      preferredQualification: [],
      preferredWorkLocation: [],
      preferredCompanyType: [],
      enableMatchNotifications: true,
      notificationFrequency: 'immediate',
      criteriaWeights: {
        age: 20,
        education: 15,
        occupation: 15,
        location: 20,
        cultural: 20,
        lifestyle: 10
      },
      matchThreshold: 70
    },
    highestQualificationOther: '',
    specializationOther: '',
    occupationOther: '',
  });

  useEffect(() => {
    console.log('MatrimonyRegistration: First useEffect - Checking auth');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');
    console.log('MatrimonyRegistration: Auth check', { isLoggedIn, hasToken: !!token });

    if (!isLoggedIn || !token) {
      console.log('MatrimonyRegistration: No login or token found, redirecting to /login');
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
      console.log('MatrimonyRegistration: Decoded Token:', decoded);
      console.log('MatrimonyRegistration: isProfileFlag from token:', decoded.isProfileFlag);
      
      // Check if we're in edit mode from location state
      const isEditMode = location.state?.editMode || false;
      console.log('MatrimonyRegistration: Edit mode from location state:', isEditMode);
      
      // Set isProfileFlag to true if either token says profile exists OR we're in edit mode
      const shouldLoadProfile = decoded.isProfileFlag || isEditMode;
      setIsProfileFlag(shouldLoadProfile);
      console.log('MatrimonyRegistration: Set isProfileFlag state to:', shouldLoadProfile);
    } catch (err) {
      console.error('MatrimonyRegistration: Token decode error:', err);
      if (isDev) console.error('Token decode error:', err);
      setFormError('Invalid or expired token. Please log in again.');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate, location.state]);

  useEffect(() => {
    console.log('MatrimonyRegistration: useEffect triggered', { isProfileFlag });
    if (isProfileFlag) {
      const token = localStorage.getItem('token');
      const isEditMode = location.state?.editMode || false;
      console.log('MatrimonyRegistration: Fetching profile with token', { hasToken: !!token });
      if (isDev) console.group('MatrimonyRegistration: Fetch Profile');
      dispatch(getProfile(token)).then(async (result) => {
        console.log('MatrimonyRegistration: getProfile result', { 
          status: result.meta.requestStatus,
          hasPayload: !!result.payload,
          hasData: !!result.payload?.data,
          hasProfile: !!result.payload?.data?.profile
        });
        
        if (result.meta.requestStatus === 'fulfilled' && result.payload.data?.profile) {
          const profileData = result.payload.data.profile;
          console.log('MatrimonyRegistration: Profile fetched successfully');
          console.log('Profile data keys:', Object.keys(profileData));
          console.log('Profile data:', profileData);
          
          const mappedData = {
            profileFor: profileData.profileFor || '',
            gender: profileData.gender || '',
            phoneNumber: profileData.phoneNumber || '',
            firstName: profileData.firstName || '',
            middleName: profileData.middleName || '',
            lastName: profileData.lastName || '',
            fatherName: profileData.fatherName || '',
            motherName: profileData.motherName || '',
            dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : '',
            subCaste: profileData.subCaste || '',
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
            foodHabit: profileData.foodHabit || '',
            highestQualification: profileData.HighestQualification || '',
            specialization: profileData.specialization || '',
            university: profileData.universityCollege || '',
            yearOfCompletion: profileData.yearOfCompletion || '',
            currentWorking: profileData.currentWorking || null,
            occupation: profileData.occupation || '',
            company: profileData.company || '',
            workLocation: profileData.workLocation || '',
            annualIncome: profileData.annualIncome || '',
            instagram: profileData.instaUrl || '',
            facebook: profileData.facebookUrl || '',
            linkedin: profileData.linkedinUrl || '',
            idVerificationType: profileData.idCardName || '',
            idVerificationNumber: profileData.idCardNo || '',
          };
          
          console.log('MatrimonyRegistration: Mapped data for form:', mappedData);
          console.log('MatrimonyRegistration: Key fields check:', {
            highestQualification: mappedData.highestQualification,
            university: mappedData.university,
            instagram: mappedData.instagram,
            facebook: mappedData.facebook,
            linkedin: mappedData.linkedin,
            idVerificationType: mappedData.idVerificationType,
            idVerificationNumber: mappedData.idVerificationNumber
          });
          
          setFormData((prev) => ({
            ...prev,
            ...mappedData
          }));
          
          if (profileData.profilePicture) {
            console.log('MatrimonyRegistration: Setting profile image preview', profileData.profilePicture);
            setProfileImagePreview(profileData.profilePicture);
          }
          
          // Fetch user preferences if in edit mode
          if (isEditMode) {
            setPreferencesLoading(true);
            try {
              console.log('MatrimonyRegistration: Fetching preferences from:', `${import.meta.env.VITE_API_URL || "https://api.vipravivah.in"}/api/preferences`);
              const preferencesResponse = await fetch(
                `${import.meta.env.VITE_API_URL || "https://api.vipravivah.in"}/api/preferences`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              
              if (preferencesResponse.ok) {
                const preferencesData = await preferencesResponse.json();
                console.log('MatrimonyRegistration: Preferences fetched successfully', preferencesData);
                
                // Handle different response structures
                let preferencesToUse = null;
                if (preferencesData.data?.preferences) {
                  // If data is nested under preferences key
                  preferencesToUse = preferencesData.data.preferences;
                } else if (preferencesData.data) {
                  // If data is directly in data key
                  preferencesToUse = preferencesData.data;
                } else if (preferencesData.preferences) {
                  // If preferences is at root level
                  preferencesToUse = preferencesData.preferences;
                }
                
                if (preferencesToUse) {
                  console.log('MatrimonyRegistration: Using preferences data:', preferencesToUse);
                  setFormData((prev) => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      ...preferencesToUse
                    }
                  }));
                } else {
                  console.warn('MatrimonyRegistration: No valid preferences data found in response');
                }
              } else {
                console.warn('MatrimonyRegistration: Failed to fetch preferences, using defaults');
              }
            } catch (prefError) {
              console.warn('MatrimonyRegistration: Error fetching preferences:', prefError);
            } finally {
              setPreferencesLoading(false);
            }
          }
        } else if (result.meta.requestStatus === 'rejected') {
          console.error('MatrimonyRegistration: Fetch Profile REJECTED', result.payload);
          if (isDev) console.error('Fetch Profile Error:', result.payload);
          setFormError(handleApiError(result.payload));
          if (result.payload?.statusCode === 401) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('token');
            navigate('/login');
          }
        }
      }).catch((error) => {
        console.error('MatrimonyRegistration: getProfile promise error', error);
      });
      if (isDev) console.groupEnd();
    }
  }, [isProfileFlag, dispatch, navigate, location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isDev) console.group('MatrimonyRegistration: handleInputChange');
    if (name.endsWith('Other')) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (name.includes('.')) {
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
        // Only require occupation details if currently working
        ...(formData.currentWorking === 'Yes' ? {
          occupation: formData.occupation,
          company: formData.company,
          workLocation: formData.workLocation,
          annualIncome: formData.annualIncome,
        } : {}),
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

      const submitData = { ...formData };
      if (submitData.profileFor === 'other') submitData.profileFor = submitData.profileForOther;
      if (submitData.gender === 'other') submitData.gender = submitData.genderOther;
      if (submitData.lookingFor === 'other') submitData.lookingFor = submitData.lookingForOther;
      if (submitData.subCaste === 'other') submitData.subCaste = submitData.subCasteOther;
      if (submitData.motherTongue === 'other') submitData.motherTongue = submitData.motherTongueOther;
      if (submitData.highestQualification === 'other') submitData.highestQualification = submitData.highestQualificationOther;
      if (submitData.specialization === 'other') submitData.specialization = submitData.specializationOther;
      if (submitData.occupation === 'other') submitData.occupation = submitData.occupationOther;
      
      // Map form fields to backend field names
      const backendData = {
        ...submitData,
        HighestQualification: submitData.highestQualification, // Map to capital H and Q
        universityCollege: submitData.university, // Map university to universityCollege
        isCurrentPermanentSame: submitData.permanentAddress.sameAsTemporary, // Map to isCurrentPermanentSame
        instaUrl: submitData.instagram, // Map instagram to instaUrl
        facebookUrl: submitData.facebook, // Map facebook to facebookUrl
        linkedinUrl: submitData.linkedin, // Map linkedin to linkedinUrl
        idCardName: submitData.idVerificationType, // Map idVerificationType to idCardName
        idCardNo: submitData.idVerificationNumber, // Map idVerificationNumber to idCardNo
      };
      
      // Remove the old field names to avoid confusion
      delete backendData.highestQualification;
      delete backendData.university;
      delete backendData.instagram;
      delete backendData.facebook;
      delete backendData.linkedin;
      delete backendData.idVerificationType;
      delete backendData.idVerificationNumber;
      delete backendData.preferences; // Preferences are saved separately

      if (isDev) {
        console.log('Submitting backend data:', backendData);
        console.log('Backend data keys:', Object.keys(backendData));
      }

      const result = await dispatch(
        createUpdateProfile({ token, profileData: backendData, profilePhoto: profileImage })
      ).unwrap();
      if (result.data?.profile) {
        if (isDev) console.log('Profile saved successfully:', result);
        localStorage.setItem('registrationComplete', 'true');
        localStorage.setItem('isProfileFlag', 'true');
        localStorage.removeItem('isNewUser');
        
        console.log('MatrimonyRegistration: Profile saved, now checking preferences...');
        console.log('MatrimonyRegistration: Current formData.preferences:', formData.preferences);
        
        // Save preferences if they exist
        console.log('MatrimonyRegistration: Checking preferences data:', {
          hasPreferences: !!formData.preferences,
          preferencesKeys: formData.preferences ? Object.keys(formData.preferences) : [],
          preferencesData: formData.preferences
        });
        
        console.log('MatrimonyRegistration: About to check if preferences exist...');
        console.log('MatrimonyRegistration: formData.preferences value:', formData.preferences);
        console.log('MatrimonyRegistration: typeof formData.preferences:', typeof formData.preferences);
        console.log('MatrimonyRegistration: formData.preferences is truthy:', !!formData.preferences);
        
        if (formData.preferences) {
          console.log('MatrimonyRegistration: Preferences exist, proceeding to save...');
          try {
            console.log('MatrimonyRegistration: Saving preferences:', formData.preferences);
            console.log('MatrimonyRegistration: API URL:', import.meta.env.VITE_API_URL || "https://api.vipravivah.in");
            console.log('MatrimonyRegistration: Token exists:', !!token);
            
            // First test the endpoint
            console.log('MatrimonyRegistration: Testing preferences endpoint...');
            const testResponse = await fetch(
              `${
                import.meta.env.VITE_API_URL || "https://api.vipravivah.in"
              }/api/preferences/test`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ test: 'data' }),
              }
            );
            console.log('MatrimonyRegistration: Test response status:', testResponse.status);
            
            const preferencesResponse = await fetch(
              `${
                import.meta.env.VITE_API_URL || "https://api.vipravivah.in"
              }/api/preferences`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData.preferences),
              }
            );
            
            console.log('MatrimonyRegistration: Preferences response status:', preferencesResponse.status);
            console.log('MatrimonyRegistration: Preferences response ok:', preferencesResponse.ok);
            
            if (preferencesResponse.ok) {
              const preferencesResult = await preferencesResponse.json();
              console.log('MatrimonyRegistration: Preferences saved successfully:', preferencesResult);
            } else {
              const errorData = await preferencesResponse.json();
              console.warn('MatrimonyRegistration: Failed to save preferences:', errorData);
              // Don't throw error here as profile was saved successfully
            }
            } catch (prefError) {
              console.warn('MatrimonyRegistration: Error saving preferences:', prefError);
              // Don't throw error here as profile was saved successfully
            }
          } else {
            console.log('MatrimonyRegistration: No preferences found, skipping preferences save');
          }
        
        // Trigger appropriate notification based on whether it's a new profile or update
        if (isProfileFlag) {
          notifyProfileUpdated();
        } else {
          notifyProfileCreated();
        }
        
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

  console.log('MatrimonyRegistration: Render', { 
    isProfileFlag, 
    reduxLoading, 
    hasFormData: !!formData,
    formDataKeys: Object.keys(formData),
    sampleFields: {
      firstName: formData.firstName,
      highestQualification: formData.highestQualification,
      university: formData.university,
      instagram: formData.instagram
    }
  });

  if (reduxLoading && isProfileFlag) {
    console.log('MatrimonyRegistration: Showing loading spinner');
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <Header showAllLinks={true} isLoggedIn={isLoggedIn} />

      {/* Hero Section */}
      <section className={`relative overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-red-50 via-pink-50 to-orange-50'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
        <div className="container mx-auto px-4 py-6 sm:py-12 md:py-16 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-3 sm:mb-6">
              <div className={`p-3 sm:p-4 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-500/10'} shadow-lg`}>
                <UserPlus className={`w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              </div>
            </div>
            <h1 className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
              {isProfileFlag ? 'Edit My Profile' : 'Create My Profile'}
            </h1>
            <p className={`text-sm sm:text-lg md:text-xl lg:text-2xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed px-2`}>
              Fill in your details to {isProfileFlag ? 'update' : 'create'} your matrimony profile. 
              <br className="hidden sm:block" />
              Fields marked with <span className="text-red-500 font-semibold">*</span> are required.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4 sm:py-12 md:py-16 px-3 sm:px-4">
                  <div
            className={`max-w-5xl mx-auto ${
              darkMode ? 'bg-gray-800/50' : 'bg-white'
            } rounded-xl sm:rounded-3xl shadow-2xl backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'} overflow-hidden`}
          >
            {(formError || reduxError) && (
              <div className="p-4 sm:p-4 md:p-6">
                <div className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-3xl ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} ${darkMode ? 'text-red-400' : 'text-red-600'} border ${darkMode ? 'border-red-500/30' : 'border-red-200'} text-sm sm:text-base`} role="alert">
                  {formError || handleApiError(reduxError)}
                </div>
              </div>
            )}
                      <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-10 md:space-y-12" aria-label="Profile registration form">
            <section
              className={`flex flex-col items-center space-y-4 sm:space-y-6 md:space-y-8 pb-6 sm:pb-10 md:pb-12 border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
              aria-label="Profile photo upload"
            >
              <div className="text-center mb-2 sm:mb-4 md:mb-6">
                <div className={`p-3 sm:p-4 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} inline-block mb-2 sm:mb-4`}>
                  <Camera className={`w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                </div>
                <h3 className={`text-lg sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Profile Photo
                </h3>
                <p className={`text-sm sm:text-base md:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                  Upload a clear, professional photo
                </p>
              </div>
              
              <div
                className={`w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                } shadow-xl sm:shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105`}
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
                      className={`w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
              
              <label
                className={`inline-flex items-center justify-center px-6 sm:px-6 md:px-8 py-3 sm:py-3 md:py-4 rounded-lg sm:rounded-2xl cursor-pointer ${
                  darkMode
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageChange}
                  className="hidden"
                  aria-label="Upload profile photo"
                  required={!profileImagePreview}
                />
                <Upload className="w-5 h-5 sm:w-5 sm:h-5 mr-2 sm:mr-3" aria-hidden="true" />
                <span className="text-base sm:text-base md:text-lg font-semibold">Upload Photo <span className="text-red-200">*</span></span>
              </label>
              
              <p className={`text-xs sm:text-sm text-center px-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'} leading-relaxed`}>
                Max 5MB • JPEG/PNG only • <span className="text-red-500 font-semibold">Required</span>
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
              'Preferences',
            ].map((section, index) => (
              <section
                key={index}
                className={`space-y-4 sm:space-y-6 md:space-y-8 pb-6 sm:pb-10 md:pb-12 ${
                  index < (isProfileFlag ? 6 : 7) ? (darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200') : ''
                } ${darkMode ? 'sm:hover:bg-gray-800/30' : 'sm:hover:bg-gray-50'} rounded-lg transition-colors duration-200 p-0 sm:p-4 md:p-6`}
                aria-label={section}
              >
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className={`p-2 sm:p-3 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} flex-shrink-0`}>
                      {section === 'Profile For Section' && <UserPlus className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />}
                      {section === 'Basic Information' && <UserPlus className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />}
                      {section === 'Family Information' && <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />}
                      {section === 'Personal Details' && <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />}
                      {section === 'Education Details' && <GraduationCap className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />}
                      {section === 'Career Details' && <Briefcase className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />}
                      {section === 'Social Media Profiles' && <Globe className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />}
                      {section === 'ID Verification' && <Shield className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />}
      {section === 'Preferences' && <Settings className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />}
                    </div>
                    <div className="flex-1">
                      <h2 className={`text-lg sm:text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
                        {section}
                      </h2>
                      <p className={`text-xs sm:text-base md:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-0.5 leading-snug`}>
                        {getSubtitle(section)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mt-4">
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
                        {formData.profileFor === 'other' && (
                          <input
                            type="text"
                            name="profileForOther"
                            value={formData.profileForOther}
                            onChange={handleInputChange}
                            placeholder="Please specify"
                            className={`mt-2 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:border-red-500 focus:ring-red-500`}
                            required
                          />
                        )}
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
                        {formData.gender === 'other' && (
                          <input
                            type="text"
                            name="genderOther"
                            value={formData.genderOther}
                            onChange={handleInputChange}
                            placeholder="Please specify"
                            className={`mt-2 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:border-red-500 focus:ring-red-500`}
                            required
                          />
                        )}
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
                        {formData.lookingFor === 'other' && (
                          <input
                            type="text"
                            name="lookingForOther"
                            value={formData.lookingForOther}
                            onChange={handleInputChange}
                            placeholder="Please specify"
                            className={`mt-2 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:border-red-500 focus:ring-red-500`}
                            required
                          />
                        )}
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
                        {formData.subCaste === 'other' && (
                          <input
                            type="text"
                            name="subCasteOther"
                            value={formData.subCasteOther}
                            onChange={handleInputChange}
                            placeholder="Please specify"
                            className={`mt-2 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:border-red-500 focus:ring-red-500`}
                            required
                          />
                        )}
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
                        {formData.motherTongue === 'other' && (
                          <input
                            type="text"
                            name="motherTongueOther"
                            value={formData.motherTongueOther}
                            onChange={handleInputChange}
                            placeholder="Please specify"
                            className={`mt-2 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:border-red-500 focus:ring-red-500`}
                            required
                          />
                        )}
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
                        {formData.highestQualification === 'other' && (
                          <input
                            type="text"
                            name="highestQualificationOther"
                            value={formData.highestQualificationOther}
                            onChange={handleInputChange}
                            placeholder="Please specify"
                            className={`mt-2 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:border-red-500 focus:ring-red-500`}
                            required
                          />
                        )}
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
                        {formData.specialization === 'other' && (
                          <input
                            type="text"
                            name="specializationOther"
                            value={formData.specializationOther}
                            onChange={handleInputChange}
                            placeholder="Please specify"
                            className={`mt-2 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:border-red-500 focus:ring-red-500`}
                            required
                          />
                        )}
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
                      {formData.currentWorking === 'Yes' && (
                        <>
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
                        {formData.occupation === 'other' && (
                          <input
                            type="text"
                            name="occupationOther"
                            value={formData.occupationOther}
                            onChange={handleInputChange}
                            placeholder="Please specify"
                            className={`mt-2 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:border-red-500 focus:ring-red-500`}
                            required
                          />
                        )}
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
                      {formData.currentWorking === 'No' && (
                        <div className="col-span-full">
                          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} text-center`}>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              Employment details are not required since you are not currently working.
                            </p>
                          </div>
                        </div>
                      )}
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
                  {section === 'Preferences' && (
                    <>
                      <div className="col-span-full">
                        <h3 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Partner Preferences
                        </h3>
                        <p className={`text-xs sm:text-sm mb-4 sm:mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                          Set your preferences to receive notifications when matching profiles are created.
                        </p>
                      </div>
                      
                      {/* Age Range */}
                      <div className="col-span-full">
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Preferred Age Range
                        </label>
                        <div className="flex space-x-3 sm:space-x-4">
                          <div className="flex-1">
                            <input
                              type="number"
                              placeholder="Min"
                              value={formData.preferences.preferredAgeRange.min || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                console.log('MatrimonyRegistration: Age range min changed to:', value);
                                setFormData({
                                  ...formData,
                                  preferences: {
                                    ...formData.preferences,
                                    preferredAgeRange: {
                                      ...formData.preferences.preferredAgeRange,
                                      min: value === '' ? '' : parseInt(value) || 18
                                    }
                                  }
                                });
                              }}
                              className={`block w-full px-3 sm:px-3 py-2.5 sm:py-2 text-base sm:text-base rounded-md border ${
                                darkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              } shadow-sm focus:border-red-500 focus:ring-red-500`}
                              min="18"
                              max="80"
                            />
                          </div>
                          <span className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>to</span>
                          <div className="flex-1">
                            <input
                              type="number"
                              placeholder="Max"
                              value={formData.preferences.preferredAgeRange.max || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                  ...formData,
                                  preferences: {
                                    ...formData.preferences,
                                    preferredAgeRange: {
                                      ...formData.preferences.preferredAgeRange,
                                      max: value === '' ? '' : parseInt(value) || 80
                                    }
                                  }
                                });
                              }}
                              className={`block w-full px-3 sm:px-3 py-2.5 sm:py-2 text-base sm:text-base rounded-md border ${
                                darkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              } shadow-sm focus:border-red-500 focus:ring-red-500`}
                              min="18"
                              max="80"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Education Preferences */}
                      <div className="col-span-full">
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Preferred Education
                        </label>
                        <select
                          multiple
                          value={formData.preferences.preferredEducation}
                          onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions, option => option.value);
                            console.log('MatrimonyRegistration: Education preferences changed to:', selected);
                            setFormData({
                              ...formData,
                              preferences: {
                                ...formData.preferences,
                                preferredEducation: selected
                              }
                            });
                          }}
                          className={`block w-full px-3 py-2.5 sm:py-2 text-base sm:text-base rounded-md border ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                          size="4"
                        >
                          <option value="High School">High School</option>
                          <option value="Bachelor's Degree">Bachelor's Degree</option>
                          <option value="Master's Degree">Master's Degree</option>
                          <option value="PhD">PhD</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Other">Other</option>
                        </select>
                        <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Hold Ctrl/Cmd to select multiple
                        </p>
                      </div>

                      {/* Location Preferences */}
                      <div className="col-span-full">
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Preferred Cities
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Mumbai, Delhi, Pune"
                          value={formData.preferences.preferredCities.join(', ')}
                          onChange={(e) => {
                            const cities = e.target.value.split(',').map(city => city.trim()).filter(city => city);
                            setFormData({
                              ...formData,
                              preferences: {
                                ...formData.preferences,
                                preferredCities: cities
                              }
                            });
                          }}
                          className={`block w-full px-3 py-2.5 sm:py-2 text-base sm:text-base rounded-md border ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          } shadow-sm focus:border-red-500 focus:ring-red-500`}
                        />
                        <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Separate cities with commas
                        </p>
                      </div>

                      {/* Match Threshold */}
                      <div className="col-span-full">
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Minimum Match Percentage
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.preferences.matchThreshold}
                            onChange={(e) => setFormData({
                              ...formData,
                              preferences: {
                                ...formData.preferences,
                                matchThreshold: parseInt(e.target.value)
                              }
                            })}
                            className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}
                            style={{
                              background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${formData.preferences.matchThreshold}%, ${darkMode ? '#374151' : '#e5e7eb'} ${formData.preferences.matchThreshold}%, ${darkMode ? '#374151' : '#e5e7eb'} 100%)`
                            }}
                          />
                          <span className={`text-base sm:text-sm font-semibold min-w-[3rem] text-center px-2 py-1 rounded ${
                            darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                          }`}>
                            {formData.preferences.matchThreshold}%
                          </span>
                        </div>
                      </div>

                      {/* Notification Settings */}
                      <div className="col-span-full">
                        <div className={`flex items-start space-x-3 p-4 rounded-lg ${
                          darkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                        }`}>
                          <input
                            type="checkbox"
                            id="enableMatchNotifications"
                            checked={formData.preferences.enableMatchNotifications}
                            onChange={(e) => setFormData({
                              ...formData,
                              preferences: {
                                ...formData.preferences,
                                enableMatchNotifications: e.target.checked
                              }
                            })}
                            className="mt-0.5 h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <div className="flex-1">
                            <label htmlFor="enableMatchNotifications" className={`text-sm sm:text-sm font-medium cursor-pointer ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              Enable match notifications
                            </label>
                            <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Get notified when new profiles match your preferences
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </section>
            ))}
            <div
              className={`flex flex-col-reverse sm:flex-row justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-4 md:space-x-6 pt-5 sm:pt-8 mt-6 sm:mt-10 md:mt-12 border-t ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg sm:rounded-2xl text-base sm:text-lg font-semibold transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } shadow-lg hover:shadow-xl transform hover:scale-105`}
                aria-label="Cancel and go back"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading || reduxLoading}
                className={`w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg sm:rounded-2xl text-base sm:text-lg font-bold transition-all duration-300 flex items-center justify-center mb-3 sm:mb-0 ${
                  formLoading || reduxLoading
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    : darkMode
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                } shadow-lg hover:shadow-xl transform hover:scale-105`}
                aria-label="Save profile"
              >
                <Save className="w-5 h-5 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
                {formLoading || reduxLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}