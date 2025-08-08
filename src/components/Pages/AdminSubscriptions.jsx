import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CreditCard, 
  Search,
  Filter,
  Crown,
  Star,
  Info,
  X
} from 'lucide-react';
import { getAllSubscriptions } from '../../redux/slices/adminSlice';
import { useTheme } from '../../context/ThemeContext';

const AdminSubscriptions = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { subscriptions, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    // Load subscriptions
    dispatch(getAllSubscriptions({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const filteredSubscriptions = subscriptions.list.filter(subscription =>
    subscription.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.plan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'premium':
        return <Crown className="h-5 w-5 text-red-500" />;
      case 'vip':
        return <Star className="h-5 w-5 text-purple-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'premium':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'vip':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
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
          Subscription Management
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Manage all user subscriptions and payment information
        </p>
        <div className="mt-4">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {subscriptions.pagination.totalSubscriptions || 0} total subscriptions
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
                placeholder="Search subscriptions by email, plan, or status..."
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

        {/* Subscriptions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubscriptions.map((subscription) => (
            <div
              key={subscription._id}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getPlanIcon(subscription.plan)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {subscription.userId?.email || 'No Email'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      User ID: {subscription.userId?._id || 'N/A'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedSubscription(subscription);
                    setShowDetailsModal(true);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-blue-400' 
                      : 'hover:bg-gray-100 text-gray-500 hover:text-blue-600'
                  }`}
                  title="View complete details"
                >
                  <Info className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Plan:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(subscription.plan)}`}>
                    {subscription.plan?.toUpperCase() || 'FREE'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    subscription.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {subscription.status?.toUpperCase() || 'INACTIVE'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Started:</span>
                  <span className="text-sm font-medium">
                    {subscription.subscriptionStart ? formatDate(subscription.subscriptionStart) : 'N/A'}
                  </span>
                </div>

                {subscription.subscriptionEnd && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Ends:</span>
                    <span className="text-sm font-medium">
                      {formatDate(subscription.subscriptionEnd)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Created:</span>
                  <span className="text-sm font-medium">
                    {formatDate(subscription.createdAt)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">User Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    subscription.userId?.isVerified 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {subscription.userId?.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {subscriptions.pagination && subscriptions.pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, subscriptions.pagination.totalSubscriptions)} of {subscriptions.pagination.totalSubscriptions} subscriptions
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!subscriptions.pagination.hasPrevPage}
                className={`px-3 py-1 rounded-md text-sm ${
                  subscriptions.pagination.hasPrevPage
                    ? darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {subscriptions.pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!subscriptions.pagination.hasNextPage}
                className={`px-3 py-1 rounded-md text-sm ${
                  subscriptions.pagination.hasNextPage
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

      {/* Subscription Details Modal */}
      {showDetailsModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Subscription Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className={`p-2 rounded-full transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* User Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">User Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Email:</span>
                    <p className="font-medium">{selectedSubscription.userId?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">User ID:</span>
                    <p className="font-medium">{selectedSubscription.userId?._id || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Verified:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedSubscription.userId?.isVerified 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {selectedSubscription.userId?.isVerified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Profile Flag:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedSubscription.userId?.isProfileFlag 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {selectedSubscription.userId?.isProfileFlag ? 'Complete' : 'Incomplete'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subscription Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">Subscription Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Plan:</span>
                    <div className="flex items-center space-x-2">
                      {getPlanIcon(selectedSubscription.plan)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(selectedSubscription.plan)}`}>
                        {selectedSubscription.plan?.toUpperCase() || 'FREE'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedSubscription.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : selectedSubscription.status === 'inactive'
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {selectedSubscription.status?.toUpperCase() || 'INACTIVE'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Subscription Start:</span>
                    <p className="font-medium">
                      {selectedSubscription.subscriptionStart ? formatDate(selectedSubscription.subscriptionStart) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Subscription End:</span>
                    <p className="font-medium">
                      {selectedSubscription.subscriptionEnd ? formatDate(selectedSubscription.subscriptionEnd) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Created At:</span>
                    <p className="font-medium">{formatDate(selectedSubscription.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Updated At:</span>
                    <p className="font-medium">{formatDate(selectedSubscription.updatedAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Subscription ID:</span>
                    <p className="font-medium break-all">{selectedSubscription._id || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">User ID (Reference):</span>
                    <p className="font-medium break-all">{selectedSubscription.userId?._id || selectedSubscription.userId || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Razorpay Order ID:</span>
                    <p className="font-medium break-all">
                      {selectedSubscription.razorpayOrderId || 'Not Available'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Razorpay Payment ID:</span>
                    <p className="font-medium break-all">
                      {selectedSubscription.razorpayPaymentId || 'Not Available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Model Schema Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">Model Schema Details</h3>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} space-y-3`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">userId:</span>
                      <p className="text-gray-600 dark:text-gray-400">ObjectId (ref: "User"), required, unique</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">plan:</span>
                      <p className="text-gray-600 dark:text-gray-400">String enum ["free", "premium"], default: "free"</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">status:</span>
                      <p className="text-gray-600 dark:text-gray-400">String enum ["active", "inactive", "canceled"], default: "active"</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">createdAt:</span>
                      <p className="text-gray-600 dark:text-gray-400">Date, default: Date.now</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">updatedAt:</span>
                      <p className="text-gray-600 dark:text-gray-400">Date, default: Date.now</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">subscriptionStart:</span>
                      <p className="text-gray-600 dark:text-gray-400">Date (optional)</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">subscriptionEnd:</span>
                      <p className="text-gray-600 dark:text-gray-400">Date (optional)</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">razorpayOrderId:</span>
                      <p className="text-gray-600 dark:text-gray-400">String (optional)</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">razorpayPaymentId:</span>
                      <p className="text-gray-600 dark:text-gray-400">String (optional)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raw Data (for debugging) */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-600 dark:text-gray-400">Raw Data</h3>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} overflow-x-auto`}>
                  <pre className="text-xs">
                    {JSON.stringify(selectedSubscription, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptions;
