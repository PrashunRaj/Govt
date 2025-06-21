import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import Layout from '../components/shared/Layout';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  FileText,
  BarChart3,
  MapPin,
  Users
} from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [mlaProfile, setMlaProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProposals: 0,
    pendingProposals: 0,
    approvedProposals: 0,
    completedProjects: 0
  });
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (user) {
      checkMLAProfile();
    } else {
      navigate('/mla/login');
    }
  }, [user]);

  const checkMLAProfile = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get(`${backendUrl}/api/mla/profile/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setMlaProfile(response.data.data);
        
        // If profile not completed, show message but don't redirect
        if (!response.data.data.profileCompleted) {
          // Profile incomplete - user can still see dashboard but with limited access
        }
      }
    } catch (error) {
      console.error('Error checking MLA profile:', error);
      if (error.response?.status === 404) {
        // No profile exists - user can still see dashboard but needs to complete profile
        setMlaProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatusInfo = () => {
    if (!mlaProfile) return {
      icon: AlertCircle,
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      title: 'Profile Required',
      message: 'Please complete your profile to access all features'
    };
    
    switch (mlaProfile.verificationStatus) {
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          title: 'Verification Pending',
          message: 'Your account is under admin review'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-800 border-red-200',
          title: 'Verification Rejected',
          message: mlaProfile.verificationNotes || 'Please contact support'
        };
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800 border-green-200',
          title: 'Account Verified',
          message: 'Full access granted to all features'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          title: 'Status Unknown',
          message: 'Please contact support'
        };
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  const statusInfo = getVerificationStatusInfo();
  const isVerified = mlaProfile?.isVerified && !mlaProfile?.isBanned;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to MLA Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            {mlaProfile?.constituency ? 
              `Managing ${mlaProfile.constituency}, ${mlaProfile.district}` : 
              'Complete your profile to get started'
            }
          </p>
        </div>

        {/* Verification Status Alert */}
        <div className={`p-6 rounded-lg border ${statusInfo.color}`}>
          <div className="flex items-center">
            <statusInfo.icon size={24} className="mr-3" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{statusInfo.title}</h3>
              <p className="mt-1">{statusInfo.message}</p>
              {!mlaProfile && (
                <button
                  onClick={() => navigate('/mla/profile')}
                  className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Complete Profile Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalProposals}</p>
                <p className="text-sm text-gray-600">Total Proposals</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.pendingProposals}</p>
                <p className="text-sm text-gray-600">Pending Review</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.approvedProposals}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.completedProjects}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Proposals Management */}
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${
            !isVerified ? 'opacity-50' : 'hover:shadow-md cursor-pointer'
          }`}>
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Manage Proposals</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Review and approve citizen proposals from your constituency
            </p>
            {isVerified ? (
              <button 
                onClick={() => navigate('/mla/manage')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View Proposals →
              </button>
            ) : (
              <span className="text-gray-400">Requires verification</span>
            )}
          </div>

          {/* Analytics */}
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${
            !isVerified ? 'opacity-50' : 'hover:shadow-md cursor-pointer'
          }`}>
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Analytics</h3>
            </div>
            <p className="text-gray-600 mb-4">
              View constituency statistics and proposal insights
            </p>
            {isVerified ? (
              <button 
                onClick={() => navigate('/mla/analytics')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                View Analytics →
              </button>
            ) : (
              <span className="text-gray-400">Requires verification</span>
            )}
          </div>

          {/* Proposal Map */}
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${
            !isVerified ? 'opacity-50' : 'hover:shadow-md cursor-pointer'
          }`}>
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Proposal Map</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Geographic view of proposals across your constituency
            </p>
            {isVerified ? (
              <button 
                onClick={() => navigate('/mla/proposal-mapping')}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                View Map →
              </button>
            ) : (
              <span className="text-gray-400">Requires verification</span>
            )}
          </div>
        </div>

        {/* Profile Completion Reminder */}
        {!mlaProfile?.profileCompleted && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertCircle className="text-blue-600 mr-3" size={24} />
              <div>
                <h3 className="font-semibold text-blue-900">Complete Your Profile</h3>
                <p className="text-blue-800 mt-1">
                  Upload required documents and complete your profile information to access all MLA features.
                </p>
                <button
                  onClick={() => navigate('/mla/profile')}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Go to Profile
                </button>
              </div>
            </div>
          </div>
        )}

        
      </div>
    </Layout>
  );
};

export default Home;
