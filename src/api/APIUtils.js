// apiUtils.js
export const createProfileFormData = (profileData, profilePhoto) => {
  const formData = new FormData();

  // Append profile photo if provided
  if (profilePhoto) {
    formData.append('profilePhoto', profilePhoto);
  }

  console.log('createProfileFormData: profileData received:', profileData);
  console.log('createProfileFormData: profileData keys:', Object.keys(profileData));

  // Append fields to FormData directly (fields are already mapped in MatrimonyRegistration.jsx)
  Object.entries(profileData).forEach(([key, value]) => {
    // Skip fields that should not be sent
    if (key === 'profileForOther' || key === 'genderOther' || key === 'lookingForOther' || 
        key === 'subCasteOther' || key === 'motherTongueOther' || key === 'highestQualificationOther' ||
        key === 'specializationOther' || key === 'occupationOther') {
      return;
    }

    if (key === 'currentAddress' || key === 'permanentAddress') {
      formData.append(key, JSON.stringify(value || {}));
      console.log(`createProfileFormData: Appended ${key}:`, JSON.stringify(value || {}));
    } else if (key === 'isCurrentPermanentSame') {
      formData.append(key, value.toString());
      console.log(`createProfileFormData: Appended ${key}:`, value.toString());
    } else if (value !== undefined && value !== null && value !== '') {
      formData.append(key, value.toString());
      console.log(`createProfileFormData: Appended ${key}:`, value.toString());
    }
  });

  console.log('createProfileFormData: FormData created with fields:', Array.from(formData.keys()));
  return formData;
};

export const handleApiError = (error) => {
  if (error?.statusCode && error?.message) {
    if (error.statusCode === 400 && error.message.includes('Required fields')) {
      return `Failed to save profile: ${error.message}`;
    }
    return `Error ${error.statusCode}: ${error.message}`;
  }
  return error?.message || 'An unexpected error occurred';
};