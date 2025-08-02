import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Footer from '../Footer';

const TermsOfService = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navigation Bar */}
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-red-500'} text-white p-4 fixed w-full z-10`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8" />
            <span className="text-2xl font-bold">विप्रVivah</span>
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            to="/"
            className={`inline-flex items-center mb-8 ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
            } transition-colors`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Terms of Service
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Last updated: December 2024
            </p>
          </div>

          {/* Content */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
            <div className={`prose ${darkMode ? 'prose-invert' : ''} max-w-none`}>
              
              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  1. Acceptance of Terms
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  By accessing and using विप्रVivah ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  2. Description of Service
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  विप्रVivah is a matrimonial platform designed specifically for the Brahmin community. Our service allows users to create profiles, browse other profiles, and connect with potential matches for marriage purposes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  3. User Registration and Account
                </h2>
                <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p>To use our service, you must:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Be at least 18 years of age</li>
                    <li>Provide accurate, current, and complete information during registration</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Be responsible for maintaining the confidentiality of your account</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  4. User Conduct and Responsibilities
                </h2>
                <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p>You agree not to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide false, misleading, or inaccurate information</li>
                    <li>Use the service for any unlawful purpose</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Upload inappropriate, offensive, or illegal content</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Use automated systems to access the service</li>
                    <li>Share your account credentials with others</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  5. Profile Information and Verification
                </h2>
                <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p>While we strive to maintain accurate profiles, we cannot guarantee the authenticity of all information provided by users. You acknowledge that:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Profile information is provided by users and not verified by us</li>
                    <li>You should exercise due diligence before proceeding with any match</li>
                    <li>We are not responsible for any misrepresentation by users</li>
                    <li>You should independently verify all information before taking any action</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  6. Privacy and Data Protection
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding the collection and use of your personal information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  7. Subscription and Payment Terms
                </h2>
                <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p>Premium subscription features include:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Unlimited profile views</li>
                    <li>See who liked your profile</li>
                    <li>Unlimited likes and interests</li>
                    <li>Priority customer support</li>
                  </ul>
                  <p className="mt-4">Subscription fees are non-refundable unless otherwise specified. We reserve the right to modify pricing with 30 days notice.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  8. Intellectual Property Rights
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  The service and its original content, features, and functionality are owned by विप्रVivah and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  9. Limitation of Liability
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  विप्रVivah shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  10. Termination
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  11. Changes to Terms
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  12. Contact Information
                </h2>
                <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p>If you have any questions about these Terms of Service, please contact us at:</p>
                  <p>Email: legal@vipravivah.in</p>
                  <p>Phone: +91 9366535263</p>
                  <p>Address: Mandi-1/226, Sector D, Pocket-1 Sushant Golf Nagar, Amar Saheed Path, Lucknow 226030, Uttar Pradesh</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsOfService; 