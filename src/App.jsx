import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ViprVivahHomepage from './components/Pages/ViprVivahHomepage';
import Login from './components/Pages/Login';
import ContactPage from './components/Pages/ContactPage';
import ExploreProfiles from './components/Pages/ExploreProfiles';
import Interest from './components/Pages/Interest';
import UserProfile from './components/Pages/UserProfile';
import LogoutPage from './components/Pages/LogoutPage';
import MatrimonyRegistration from './components/Pages/MatrimonyRegistration';
import RegistrationSuccess from './components/Pages/RegistrationSuccess';
import ViewProfile from './components/Pages/ViewProfile';
import OTPVerification from './components/Pages/OTPVerification';
import SubscriptionPage from './components/Pages/SubscriptionPage';
import TermsOfService from './components/Pages/TermsOfService';
import PrivacyPolicy from './components/Pages/PrivacyPolicy';
import RequirePremium from './components/RequirePremium';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/Pages/AdminDashboard';
import AdminUsers from './components/Pages/AdminUsers';
import AdminProfiles from './components/Pages/AdminProfiles';
import AdminSubscriptions from './components/Pages/AdminSubscriptions';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import { setPlan } from './redux/slices/subscriptionSlice';
import { getPlanFromToken } from './utils/decodeToken';
import { WebSocketProvider } from './context/WebSocketContext';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const plan = getPlanFromToken(token);
      store.dispatch(setPlan(plan));
    }
  }, []);
  return (
    <Provider store={store}>
      <WebSocketProvider>
        <Routes>
          <Route path="/" element={<ViprVivahHomepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/explore" element={<ExploreProfiles />} />
          <Route path="/interest" element={<Interest />} />

          <Route path="/profile" element={
               <UserProfile />
           } />
           
          <Route path="/profile/:id" element={<ViewProfile />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/matrimony-registration" element={<MatrimonyRegistration />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          } />
          <Route path="/admin/users" element={
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          } />
          <Route path="/admin/profiles" element={
            <AdminLayout>
              <AdminProfiles />
            </AdminLayout>
          } />
          <Route path="/admin/subscriptions" element={
            <AdminLayout>
              <AdminSubscriptions />
            </AdminLayout>
          } />
        </Routes>
      </WebSocketProvider>
    </Provider>
  );
}

export default App;