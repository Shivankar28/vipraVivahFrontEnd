import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cake,
  Languages,
  MapPin,
  Users,
  Heart,
  Eye,
  ArrowRight,
  Sparkles,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { getUsersWhoLikedMe, getUsersILiked } from '../../redux/slices/interestSlice';
import Header from '../Header';
import Footer from '../Footer';

const isDev = process.env.NODE_ENV === 'development';

const Interest = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const dispatch = useDispatch();

  const { likedMe, iLiked, likedMeLoading, iLikedLoading, error } = useSelector((state) => state.interest);
  const plan = useSelector((state) => state.subscription.plan);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');
    if (!isLoggedIn || !token) {
      if (isDev) console.log('Interest: User not logged in, redirecting to login');
      navigate('/login');
      return;
    }
    if (plan !== 'premium') {
      if (isDev) console.log('Interest: Non-premium user, redirecting to subscription');
      navigate('/subscription');
      return;
    }
    dispatch(getUsersWhoLikedMe(token));
    dispatch(getUsersILiked(token));
    // Optionally, fetch subscription status
    dispatch({ type: 'subscription/getSubscriptionStatus/pending' });
  }, [navigate, dispatch, plan]);

  const handleLogout = () => {
    if (isDev) console.log('Interest: Logging out');
    localStorage.clear();
    navigate('/login');
  };

  const renderProfileCard = (profileObj) => {
    const profile = profileObj.profile || {};
    return (
      <div
        key={profileObj._id}
        className={`group ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-100'} hover:scale-105`}
      >
        <div className="relative">
          <img
            src={profile.profilePicture || '/api/placeholder/400/320'}
            alt={`${profile.firstName || ''} ${profile.lastName || ''}`}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4">
            <div className={`p-3 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} shadow-lg`}>
              <Heart className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {`${profile.firstName || ''} ${profile.lastName || ''}`}
          </div>
          
          <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mr-3`}>
                <Cake className="w-4 h-4" />
              </div>
              <span className="font-medium">{profile.age ? `${profile.age} years` : 'Age N/A'}</span>
            </div>
            
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mr-3`}>
                <Languages className="w-4 h-4" />
              </div>
              <span className="font-medium">{profile.motherTongue || 'N/A'}</span>
            </div>
            
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mr-3`}>
                <MapPin className="w-4 h-4" />
              </div>
              <span className="font-medium">{profile.currentAddress?.city || 'Unknown'}</span>
            </div>
            
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mr-3`}>
                <Users className="w-4 h-4" />
              </div>
              <span className="font-medium">{profile.gotra || 'N/A'}</span>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => navigate(`/profile/${profile._id}`)}
              className={`group flex items-center justify-center w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                darkMode 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              } shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              <Eye className="w-5 h-5 mr-2" />
              <span>View Profile</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <Header showAllLinks={true} isLoggedIn={true} />

      {/* Hero Section */}
      <section className={`relative overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-red-50 via-pink-50 to-orange-50'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-500/10'} shadow-lg`}>
                <Heart className={`w-12 h-12 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              </div>
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
              Your Interests
            </h1>
            <p className={`text-xl md:text-2xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed`}>
              Discover who's interested in you and manage your connections
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Error Messages */}
          {error && (
            <div className={`p-6 rounded-3xl ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} ${darkMode ? 'text-red-400' : 'text-red-600'} border ${darkMode ? 'border-red-500/30' : 'border-red-200'} mb-8`}>
              {error}
            </div>
          )}

          {/* Users Who Liked Me */}
          <div className="mb-16">
            <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-100'} mb-8`}>
              <div className="flex items-center mb-8">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} mr-4`}>
                  <UserCheck className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                </div>
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Users Who Liked Me
                </h2>
              </div>

              {likedMeLoading ? (
                <div className={`text-center py-16 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex justify-center mb-4">
                    <div className={`w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin`}></div>
                  </div>
                  <p className="text-lg font-medium">Loading profiles...</p>
                </div>
              ) : likedMe.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {likedMe.map(renderProfileCard)}
                </div>
              ) : (
                <div className={`text-center py-16 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <Heart className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No likes yet</h3>
                  <p>When someone likes your profile, they'll appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Users I Liked */}
          <div>
            <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex items-center mb-8">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} mr-4`}>
                  <UserPlus className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                </div>
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Users I Liked
                </h2>
              </div>

              {iLikedLoading ? (
                <div className={`text-center py-16 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex justify-center mb-4">
                    <div className={`w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin`}></div>
                  </div>
                  <p className="text-lg font-medium">Loading profiles...</p>
                </div>
              ) : iLiked.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {iLiked.map(renderProfileCard)}
                </div>
              ) : (
                <div className={`text-center py-16 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <Sparkles className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Start exploring</h3>
                  <p>Like profiles to see them appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Interest;
