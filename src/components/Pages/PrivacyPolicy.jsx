import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Footer from '../Footer';

const PrivacyPolicy = () => {
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
              Privacy Policy
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
                  1. Introduction
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  विप्रVivah ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our matrimonial platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  2. Information We Collect
                </h2>
                <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <h3 className={`text-xl font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Personal Information
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Name, email address, phone number</li>
                    <li>Date of birth, gender, marital status</li>
                    <li>Family information (parents' names, gotra, sub-caste)</li>
                    <li>Educational and professional details</li>
                    <li>Address and location information</li>
                    <li>Profile photographs and documents</li>
                    <li>ID verification documents</li>
                  </ul>

                  <h3 className={`text-xl font-medium mb-2 mt-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Usage Information
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Profile views and interactions</li>
                    <li>Likes and interests expressed</li>
                    <li>Search preferences and filters used</li>
                    <li>Communication history</li>
                    <li>Device and browser information</li>
                    <li>IP address and location data</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  3. How We Use Your Information
                </h2>
                <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p>We use the collected information for:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Creating and managing your profile</li>
                    <li>Providing matchmaking services</li>
                    <li>Facilitating communication between users</li>
                    <li>Improving our platform and services</li>
                    <li>Providing customer support</li>
                    <li>Sending important updates and notifications</li>
                    <li>Ensuring platform security and preventing fraud</li>
                    <li>Complying with legal obligations</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  4. Information Sharing and Disclosure
                </h2>
                <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p>We may share your information in the following circumstances:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>With other users:</strong> Your profile information is visible to other registered users as per your privacy settings</li>
                    <li><strong>Service providers:</strong> With trusted third-party service providers who assist in operating our platform</li>
                    <li><strong>Legal requirements:</strong> When required by law or to protect our rights and safety</li>
                    <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    <li><strong>With your consent:</strong> When you explicitly authorize us to share your information</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  5. Data Security
                </h2>
                <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p>We implement appropriate security measures to protect your information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption of sensitive data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication measures</li>
                    <li>Secure data storage and backup procedures</li>
                    <li>Employee training on data protection</li>
                  </ul>
                  <p className="mt-4">However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  6. Data Retention
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time. We may retain certain information for legal, security, or business purposes even after account deletion.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  7. Your Rights and Choices
                </h2>
                <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Access:</strong> Request a copy of your personal information</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                    <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                    <li><strong>Objection:</strong> Object to certain processing of your information</li>
                    <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  8. Cookies and Tracking Technologies
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences, though disabling cookies may affect platform functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  9. Third-Party Services
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Our platform may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these external services. We encourage you to review their privacy policies before providing any personal information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  10. Children's Privacy
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Our service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  11. International Data Transfers
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  12. Changes to This Privacy Policy
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of the service after such changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  13. Contact Us
                </h2>
                <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                  <p>Email: privacy@vipravivah.in</p>
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

export default PrivacyPolicy; 