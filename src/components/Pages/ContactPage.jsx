import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, User, MessageSquare, Heart, Globe, Clock, Shield, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Header from '../Header';
import Footer from '../Footer';

const ContactPage = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <Header showAllLinks={true} isLoggedIn={isLoggedIn} />

      {/* Hero Section */}
      <section className={`relative overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-red-50 via-pink-50 to-orange-50'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className={`p-6 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-500/10'} shadow-lg`}>
                <MessageSquare className={`w-16 h-16 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              </div>
            </div>
            <h1 className={`text-6xl md:text-7xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
              Get in Touch
            </h1>
            <p className={`text-xl md:text-2xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed mb-12`}>
              We're here to help you find your perfect match. Reach out to us anytime for personalized assistance.
            </p>
            <div className="flex justify-center">
              <div className={`inline-flex items-center px-6 py-3 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-500/10'} ${darkMode ? 'text-red-400' : 'text-red-600'} font-medium`}>
                <Clock className="w-5 h-5 mr-2" />
                <span>24/7 Support Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className={`text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Contact Information
                </h2>
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-12 leading-relaxed`}>
                  Connect with us through any of these channels. Our dedicated team is here to assist you with your matrimony journey.
                </p>
              </div>

              <div className="space-y-8">
                {/* Email */}
                <div className={`group p-8 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-500 border ${darkMode ? 'border-gray-700' : 'border-gray-100'} hover:scale-105`}>
                  <div className="flex items-start">
                    <div className={`p-4 rounded-2xl ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} mr-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Mail className={`w-8 h-8 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Support</h3>
                      <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 font-medium`}>support@vipravivah.in</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>We'll respond within 24 hours</p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className={`group p-8 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-500 border ${darkMode ? 'border-gray-700' : 'border-gray-100'} hover:scale-105`}>
                  <div className="flex items-start">
                    <div className={`p-4 rounded-2xl ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} mr-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Phone className={`w-8 h-8 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Phone Support</h3>
                      <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 font-medium`}>+91 9366535263</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Available 9 AM - 8 PM IST</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className={`group p-8 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-500 border ${darkMode ? 'border-gray-700' : 'border-gray-100'} hover:scale-105`}>
                  <div className="flex items-start">
                    <div className={`p-4 rounded-2xl ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} mr-6 group-hover:scale-110 transition-transform duration-300`}>
                      <MapPin className={`w-8 h-8 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Office Address</h3>
                      <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 leading-relaxed`}>
                        Mandi-1/226, Sector D, Pocket-1<br />
                        Sushant Golf Nagar, Amar Saheed Path<br />
                        Lucknow 226030, Uttar Pradesh
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Visit us during business hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* About Us */}
            <div className="space-y-8">
              <div className={`p-10 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex items-center mb-8">
                  <div className={`p-4 rounded-2xl ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} mr-6`}>
                    <Heart className={`w-8 h-8 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                  </div>
                  <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>About विप्रVivah</h2>
                </div>
                
                <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
                  Welcome to <span className="font-bold text-red-500">विप्रVivah</span>, a dedicated matchmaking platform for the Brahmin community. Our mission is to connect like-minded individuals and families, helping them find compatible partners while preserving cultural values and traditions.
                </p>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className={`flex items-center p-4 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-all duration-300 hover:scale-105`}>
                    <Shield className={`w-6 h-6 mr-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                    <div>
                      <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Verified Profiles</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>All profiles are manually verified</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center p-4 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-all duration-300 hover:scale-105`}>
                    <Clock className={`w-6 h-6 mr-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                    <div>
                      <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>24/7 Support</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Round-the-clock assistance</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center p-4 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-all duration-300 hover:scale-105`}>
                    <Globe className={`w-6 h-6 mr-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                    <div>
                      <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Global Reach</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Connecting families worldwide</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className={`p-12 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-100'} max-w-4xl mx-auto text-center`}>
            <h3 className={`text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Ready to Start Your Journey?
            </h3>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-10 leading-relaxed`}>
              Join thousands of families who have found their perfect match through विप्रVivah. Begin your matrimony journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigate('/matrimony-registration')}
                className={`group flex items-center justify-center px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                  darkMode 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } shadow-xl hover:shadow-2xl transform hover:scale-105`}
              >
                <span>Create Profile</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/explore')}
                className={`group flex items-center justify-center px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                  darkMode 
                    ? 'bg-transparent border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white' 
                    : 'bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                } shadow-xl hover:shadow-2xl transform hover:scale-105`}
              >
                <span>Explore Profiles</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactPage;

     

