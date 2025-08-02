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
      url: `${BASE_URL}/api/auth/profile`,
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

  // Interest Endpoints
  createLike: (token, likedId) =>
    APIConnector.request({
      method: 'POST',
      url: `${BASE_URL}/api/interest/likes`,
      data: { likedId },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }),

  unlike: (token, targetUserId) =>
    APIConnector.request({
      method: 'DELETE',
      url: `${BASE_URL}/api/interest/likes`,
      data: { targetUserId },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getUsersWhoLikedMe: (token) =>
    APIConnector.request({
      method: 'GET',
      url: `${BASE_URL}/api/interest/likes/received`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getUsersILiked: (token) =>
    APIConnector.request({
      method: 'GET',
      url: `${BASE_URL}/api/interest/likes/sent`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Subscription Endpoints
  upgradeToPremium: (token) =>
    APIConnector.request({
      method: 'POST',
      url: `${BASE_URL}/api/subscription/upgrade`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getSubscriptionStatus: (token) =>
    APIConnector.request({
      method: 'GET',
      url: `${BASE_URL}/api/subscription/status`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Notification Endpoints
  getNotifications: (token, params = {}) =>
    APIConnector.request({
      method: 'GET',
      url: `${BASE_URL}/api/notifications`,
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getUnreadCount: (token) =>
    APIConnector.request({
      method: 'GET',
      url: `${BASE_URL}/api/notifications/unread-count`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  markNotificationsAsRead: (token, notificationIds = null) =>
    APIConnector.request({
      method: 'PATCH',
      url: `${BASE_URL}/api/notifications/mark-read`,
      data: { notificationIds },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }),

  deleteNotification: (token, notificationId) =>
    APIConnector.request({
      method: 'DELETE',
      url: `${BASE_URL}/api/notifications/${notificationId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  clearAllNotifications: (token) =>
    APIConnector.request({
      method: 'DELETE',
      url: `${BASE_URL}/api/notifications`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default APIConnector;