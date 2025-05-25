// apiUtils.js
export const createProfileFormData = (profileData, profilePhoto) => {
  const formData = new FormData();

  // Append profile photo if provided
  if (profilePhoto) {
    formData.append('profilePhoto', profilePhoto);
  }

  // Field mapping from frontend to backend
  const fieldMap = {
    profileFor: 'profileFor',
    gender: 'gender',
    phoneNumber: 'phoneNumber',
    firstName: 'firstName',
    middleName: 'middleName',
    lastName: 'lastName',
    fatherName: 'fatherName',
    motherName: 'motherName',
    dateOfBirth: 'dateOfBirth',
    subCaste: 'subCaste',
    gotra: 'gotra',
    motherTongue: 'motherTongue',
    lookingFor: 'lookingFor',
    height: 'height',
    maritalStatus: 'maritalStatus',
    foodHabit: 'foodHabit',
    highestQualification: 'HighestQualification',
    specialization: 'specialization',
    university: 'universityCollege',
    yearOfCompletion: 'yearOfCompletion',
    currentlyWorking: 'currentWorking',
    occupation: 'occupation',
    company: 'company',
    workLocation: 'workLocation',
    annualIncome: 'annualIncome',
    instagram: 'instaUrl',
    facebook: 'facebookUrl',
    linkedin: 'linkedinUrl',
    idVerificationType: 'idCardName',
    idVerificationNumber: 'idCardNo',
    isLivesWithFamily: 'isLivesWithFamily',
    currentAddress: 'currentAddress',
    permanentAddress: 'permanentAddress',
    isCurrentPermanentSame: 'isCurrentPermanentSame',
  };

  // Append fields to FormData
  Object.entries(profileData).forEach(([key, value]) => {
    if (key === 'currentAddress' || key === 'permanentAddress') {
      formData.append(fieldMap[key], JSON.stringify(value || {}));
    } else if (key === 'isCurrentPermanentSame') {
      formData.append(fieldMap[key], value.toString()); // Convert to string ('true'/'false')
    } else if (fieldMap[key] && value !== undefined && value !== null) {
      formData.append(fieldMap[key], value.toString());
    }
  });

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