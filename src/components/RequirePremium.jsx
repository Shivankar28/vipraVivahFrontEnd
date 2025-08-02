import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getSubscriptionStatus } from '../redux/slices/subscriptionSlice';

const RequirePremium = ({ children }) => {
  const dispatch = useDispatch();
  const { status, loading } = useSelector((state) => state.subscription);

  useEffect(() => {
    if (!status) {
      const token = localStorage.getItem('token');
      if (token) dispatch(getSubscriptionStatus(token));
    }
  }, [status, dispatch]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Checking subscription...</div>;
  }

  if (!status?.isPremium) {
    return <Navigate to="/subscription" replace />;
  }

  return children;
};

export default RequirePremium; 