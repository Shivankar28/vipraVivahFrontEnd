// apiConnector.js
import axios from 'axios';
import { BASE_URL } from '../constants/config';

const APIConnector = {
  async request(config) {
    try {
      const response = await axios(config);
      console.log("response in api connector",response)
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        const err = error.response.data;
        err.statusCode = error.response.status; // Match backend's ApiResponse
        throw err;
      }
      throw {
        statusCode: error.response?.status || 500,
        message: error.message || 'An unexpected error occurred',
        error: error.message,
      };
    }
  },

  // Auth Endpoints
  signup: (data) =>
    APIConnector.request({
      method: 'POST',
      url: `${BASE_URL}/api/auth/signup`,
      data,
      headers: { 'Content-Type': 'application/json' },
    }),

  verifyOtp: (data) =>
    APIConnector.request({
      method: 'POST',
      url: `${BASE_URL}/api/auth/verify-otp`,
      data,
      headers: { 'Content-Type': 'application/json' },
    }),

  login: (data) =>
    APIConnector.request({
      method: 'POST',
      url: `${BASE_URL}/api/auth/login`,
      data,
      headers: { 'Content-Type': 'application/json' },
    }),

  forgotPassword: (data) =>
    APIConnector.request({
      method: 'POST',
      url: `${BASE_URL}/api/auth/forgot-password`,
      data,
      headers: { 'Content-Type': 'application/json' },
    }),

  resetPassword: (data) =>
    APIConnector.request({
      method: 'POST',
      url: `${BASE_URL}/api/auth/reset-password`,
      data,
      headers: { 'Content-Type': 'application/json' },
    }),

  resendOtp: (data) =>
    APIConnector.request({
      method: 'POST',
      url: `${BASE_URL}/api/auth/resend-otp`,
      data,
      headers: { 'Content-Type': 'application/json' },
    }),

  getAuthProfile: (token) =>
    APIConnector.request({
      method: 'GET',
      url: `${BASE_URL}/api/auth/profile`,
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Profile Endpoints
  createUpdateProfile: (token, formData) =>
    APIConnector.request({
      method: 'POST',
      url: `${BASE_URL}/api/profile`,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: Content-Type is automatically set to multipart/form-data by FormData
      },
    }),

  getProfile: (token) =>
    APIConnector.request({
      method: 'GET',
      url: `${BASE_URL}/api/profile`,
      headers: { Authorization: `Bearer ${token}` },
    }),

  exploreProfiles: (params, token) =>
    APIConnector.request({
      method: 'GET',
      url: `${BASE_URL}/api/profile/explore`,
      params,
      headers: { Authorization: `Bearer ${token}` },
    }),

  getProfileById: (id, token) =>
    APIConnector.request({
      method: 'GET',
      url: `${BASE_URL}/api/profile/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default APIConnector;