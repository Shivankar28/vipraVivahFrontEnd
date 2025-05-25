import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ViprVivahHomepage from './components/Pages/ViprVivahHomepage';
import Login from './components/Pages/Login';
import ContactPage from './components/Pages/ContactPage';
import ExploreProfiles from './components/Pages/ExploreProfiles';
import UserProfile from './components/Pages/UserProfile';
import LogoutPage from './components/Pages/LogoutPage';
import MatrimonyRegistration from './components/Pages/MatrimonyRegistration';
import RegistrationSuccess from './components/Pages/RegistrationSuccess';
import ViewProfile from './components/Pages/ViewProfile';
import OTPVerification from './components/Pages/OTPVerification';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<ViprVivahHomepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/explore" element={<ExploreProfiles />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/:id" element={<ViewProfile />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/matrimony-registration" element={<MatrimonyRegistration />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
      </Routes>
    </Provider>
  );
}

export default App;