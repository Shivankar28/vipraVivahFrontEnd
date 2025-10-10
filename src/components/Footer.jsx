import React from 'react';
import { Heart, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { darkMode } = useTheme();

  return (
    <footer className={`${darkMode ? 'bg-gray-800' : 'bg-gray-900'} text-white py-8 sm:py-10 md:py-12 transition-colors duration-200`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center">
              <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-red-400' : 'text-red-500'} mr-2`} />
              <h3 className="text-xl sm:text-2xl font-bold">विप्रVivah</h3>
            </div>
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-400'} leading-relaxed`}>
              Dedicated matchmaking platform for the Brahmin community. 
              Connecting like-minded individuals and families while preserving cultural values.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Information</h4>
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 mt-0.5 text-red-400 flex-shrink-0" />
                <div>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-400'} leading-relaxed`}>
                    Mandi-1/226, Sector D, Pocket-1<br />
                    Sushant Golf Nagar, Amar Saheed Path<br />
                    Lucknow 226030, Uttar Pradesh
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-red-400 flex-shrink-0" />
                <a 
                  href="tel:+919366535263" 
                  className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
                >
                  +91 9366535263
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-red-400 flex-shrink-0" />
                <a 
                  href="mailto:support@vipravivah.in" 
                  className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-white'} transition-colors break-all`}
                >
                  support@vipravivah.in
                </a>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-red-400 flex-shrink-0" />
                <a 
                  href="https://vipravivah.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
                >
                  www.vipravivah.in
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="/" className={`block text-xs sm:text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-white'} transition-colors`}>
                Home
              </a>
              <a href="/explore" className={`block text-xs sm:text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-white'} transition-colors`}>
                Explore Profiles
              </a>
              <a href="/contact" className={`block text-xs sm:text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-white'} transition-colors`}>
                Contact Us
              </a>
              <a href="/subscription" className={`block text-xs sm:text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-white'} transition-colors`}>
                Subscription
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Legal</h4>
            <div className="space-y-2">
              <a href="/privacy" className={`block text-xs sm:text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-white'} transition-colors`}>
                Privacy Policy
              </a>
              <a href="/terms" className={`block text-xs sm:text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-white'} transition-colors`}>
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-700'} mt-6 sm:mt-8 pt-6 sm:pt-8`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-400'} text-center md:text-left`}>
              © 2024 विप्रVivah. All rights reserved.
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center max-w-2xl leading-relaxed px-2`}>
              The information provided on this website is solely the responsibility of the individual submitting it. 
              We do not verify or guarantee the accuracy, completeness, or reliability of any data filled by users. 
              Users and interested parties should exercise due diligence and independently verify all information 
              before taking any action based on it.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 