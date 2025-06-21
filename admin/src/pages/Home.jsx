import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  UserCheck, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Activity,
  MapPin
} from 'lucide-react';

const Home = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getToken();
      console.log('🔑 Token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      console.log("feefverfer")
      const response = await axios.get(`${backendUrl}/api/admin/dashboard-stats`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
       console.log("feefverfer")
      
      console.log(' API Response: hey', response.data);
      
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        throw new Error(response.data.message || 'API call failed');
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers for real routes
  const handleNavigation = (route) => {
    navigate(route);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick }) => (
    <div 
      className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case 'user_registered': return <Users className="h-4 w-4 text-blue-500" />;
        case 'mla_verified': return <UserCheck className="h-4 w-4 text-green-500" />;
        case 'mla_pending': return <Clock className="h-4 w-4 text-yellow-500" />;
        case 'proposal_submitted': return <FileText className="h-4 w-4 text-purple-500" />;
        default: return <Activity className="h-4 w-4 text-gray-500" />;
      }
    };

    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
        <div className="flex-shrink-0 mt-1">
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">{activity.message}</p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Dashboard statistics are not available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName || 'Admin'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your platform today.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>System Overview</span>
          </div>
        </div>
      </div>

      {/* Stats Grid with Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers?.toLocaleString() || '0'}
          icon={Users}
          color="bg-blue-500"
          subtitle="Registered citizens"
          onClick={() => handleNavigation('/user-management')}
        />
        <StatCard
          title="Total MLAs"
          value={stats.totalMLAs || '0'}
          icon={UserCheck}
          color="bg-green-500"
          subtitle={`${stats.pendingMLAs || 0} pending verification`}
          onClick={() => handleNavigation('/mla-management')}
        />
        <StatCard
          title="Total Proposals"
          value={stats.totalProposals || '0'}
          icon={FileText}
          color="bg-purple-500"
          subtitle={`${stats.activeProposals || 0} currently active`}
          onClick={() => handleNavigation('/proposal-overview')}
        />
        <StatCard
          title="Verified MLAs"
          value={stats.verifiedMLAs || '0'}
          icon={TrendingUp}
          color="bg-indigo-500"
          subtitle="Successfully verified"
        />
      </div>

      {/* Proposal Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposal Status Overview</h3>
          <div className="space-y-4">
            <div 
              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => handleNavigation('/proposal-overview?status=active')}
            >
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-blue-900">Active Proposals</span>
              </div>
              <span className="text-xl font-bold text-blue-600">{stats.activeProposals || 0}</span>
            </div>
            
            <div 
              className="flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
              onClick={() => handleNavigation('/proposal-overview?status=completed')}
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium text-green-900">Completed</span>
              </div>
              <span className="text-xl font-bold text-green-600">{stats.completedProposals || 0}</span>
            </div>
            
            <div 
              className="flex items-center justify-between p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
              onClick={() => handleNavigation('/proposal-overview?status=rejected')}
            >
              <div className="flex items-center space-x-3">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="font-medium text-red-900">Rejected</span>
              </div>
              <span className="text-xl font-bold text-red-600">{stats.rejectedProposals || 0}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-2">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            ) : (
              <div className="text-center py-4">
                <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            onClick={() => handleNavigation('/mla-management?filter=pending')}
          >
            <div className="text-center">
              <UserCheck className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600">Review MLA Applications</span>
              {stats.pendingMLAs > 0 && (
                <span className="block text-xs text-indigo-600 font-semibold">
                  {stats.pendingMLAs} pending
                </span>
              )}
            </div>
          </button>
          
          <button 
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            onClick={() => handleNavigation('/user-management')}
          >
            <div className="text-center">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600">Manage User Accounts</span>
              <span className="block text-xs text-gray-500">
                {stats.totalUsers} total users
              </span>
            </div>
          </button>
          
          <button 
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            onClick={() => handleNavigation('/proposal-overview')}
          >
            <div className="text-center">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600">Monitor Proposals</span>
              <span className="block text-xs text-gray-500">
                {stats.totalProposals} total proposals
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
