import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search,
  Filter,
  User
} from 'lucide-react';
import { getAllProfiles } from '../../redux/slices/adminSlice';

const AdminProfiles = () => {
  const dispatch = useDispatch();
  const [darkMode] = useState(false); // Static dark mode or integrate with theme
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const { profiles, loading, error } = useSelector((state) => state.admin);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Load profiles
    if (token) {
      dispatch(getAllProfiles({ token, page: currentPage, limit: 10 }));
    }
  }, [dispatch, token, currentPage]);

  // Helper to get full name
  const getFullName = (profile) => {
    const firstName = profile.firstName || '';
    const middleName = profile.middleName || '';
    const lastName = profile.lastName || '';
    return `${firstName} ${middleName} ${lastName}`.trim() || 'No Name';
  };

  // Filter profiles based on search term
  const profilesList = profiles?.list || [];
  const filteredProfiles = profilesList.filter(profile => {
    const fullName = getFullName(profile).toLowerCase();
    const email = profile.userId?.email?.toLowerCase() || '';
    const city = profile.currentAddress?.city?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) ||
           email.includes(searchLower) ||
           city.includes(searchLower);
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Profile Management
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          View and manage all user profiles
        </p>
        <div className="mt-4">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {profiles?.pagination?.totalProfiles || 0} total profiles
          </span>
        </div>
      </div>
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search profiles by name, email, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">Filter</span>
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        {filteredProfiles.length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
              No profiles found
            </h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchTerm ? 'Try adjusting your search criteria.' : 'No profiles have been created yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
            <div
              key={profile._id}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}
            >
              <div className="flex items-center space-x-4 mb-4">
                {profile.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt={getFullName(profile)}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getFullName(profile)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {profile.userId?.email || 'No Email'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Age:</span>
                  <span className="text-sm font-medium">{profile.age || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Gender:</span>
                  <span className="text-sm font-medium">{profile.gender || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Location:</span>
                  <span className="text-sm font-medium">
                    {profile.currentAddress?.city && profile.currentAddress?.state 
                      ? `${profile.currentAddress.city}, ${profile.currentAddress.state}` 
                      : profile.currentAddress?.city || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Created:</span>
                  <span className="text-sm font-medium">{formatDate(profile.createdAt)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">User Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    profile.userId?.isVerified 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {profile.userId?.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {profiles?.pagination && profiles.pagination.totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, profiles.pagination.totalProfiles)} of {profiles.pagination.totalProfiles} profiles
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={!profiles.pagination.hasPrevPage}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  profiles.pagination.hasPrevPage
                    ? darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-500 px-4">
                Page {currentPage} of {profiles.pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!profiles.pagination.hasNextPage}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  profiles.pagination.hasNextPage
                    ? darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
    </div>
  );
};

export default AdminProfiles;
