import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import {
  ChartBarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

const AnalyticsPage = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [timeRange, setTimeRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [mlaProfile, setMlaProfile] = useState(null);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (user) {
      fetchMlaProfile();
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const fetchMlaProfile = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${backendUrl}/api/mla/profile/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setMlaProfile(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching MLA profile:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      // Fetch analytics data
      const response = await axios.get(`${backendUrl}/api/mla/analytics/constituency?timeRange=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const data = response.data.data;
        setAnalytics(data.overview);
        setChartData(data.monthlyTrends);
        setCategoryData(data.categoryBreakdown);
        setRecentActivity(data.recentActivity);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Analytics data is not available at this time.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Proposals',
      value: analytics.totalProposals,
      icon: DocumentTextIcon,
      color: 'blue',
      change: analytics.proposalsChange,
      trend: analytics.proposalsChange >= 0 ? 'up' : 'down'
    },
    {
      title: 'Approved',
      value: analytics.approvedProposals,
      icon: CheckCircleIcon,
      color: 'green',
      change: analytics.approvedChange,
      trend: analytics.approvedChange >= 0 ? 'up' : 'down'
    },
    {
      title: 'Rejected',
      value: analytics.rejectedProposals,
      icon: XCircleIcon,
      color: 'red',
      change: analytics.rejectedChange,
      trend: analytics.rejectedChange >= 0 ? 'up' : 'down'
    },
    {
      title: 'Pending Review',
      value: analytics.pendingProposals,
      icon: ClockIcon,
      color: 'yellow',
      change: analytics.pendingChange,
      trend: analytics.pendingChange >= 0 ? 'up' : 'down'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track {mlaProfile?.constituency || 'your constituency'}'s proposal metrics and performance
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${
                stat.color === 'blue' ? 'bg-blue-100' :
                stat.color === 'green' ? 'bg-green-100' :
                stat.color === 'red' ? 'bg-red-100' : 'bg-yellow-100'
              }`}>
                <stat.icon className={`h-6 w-6 ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'red' ? 'text-red-600' : 'text-yellow-600'
                }`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.trend === 'up' ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
              )}
              <span className={`ml-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </span>
              <span className="ml-1 text-sm text-gray-500">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
     {/* Proposals Trend Chart - CORRECTED VERSION */}
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-semibold text-gray-900">Proposals Trend</h3>
    <ChartBarIcon className="h-5 w-5 text-gray-400" />
  </div>
  <div className="space-y-4">
    {chartData.map((data, index) => (
      <div key={index} className="flex items-center space-x-4">
        <div className="w-12 text-sm font-medium text-gray-600">{data.month}</div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (data.proposals / Math.max(...chartData.map(d => d.proposals))) * 100)}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900 w-8">{data.proposals}</span>
          </div>
          {/* ✅ CORRECTED: Updated status breakdown */}
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex space-x-1 text-xs text-gray-500">
              <span className="text-green-600">✓ {data.approved} approved</span>
              <span className="text-red-600">✗ {data.rejected} rejected</span>
              {data.pending > 0 && (
                <span className="text-yellow-600">⏳ {data.pending} pending</span>
              )}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Proposals by Category</h3>
            <UsersIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{category.category}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${category.percentage}%`,
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8">{category.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Votes</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalVotes?.toLocaleString() || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Citizens</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.activeCitizens?.toLocaleString() || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100">
              <UsersIcon className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Projects</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.completedProjects || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
<div>
  <p className="text-sm font-medium text-gray-600">Budget Allocated</p>
  <p className="text-2xl font-bold text-gray-900">
    {(() => {
      const budget = analytics.budgetAllocated || 0;
      if (budget >= 10000000) {
        return `₹${(budget / 10000000).toFixed(1)}Cr`;
      } else if (budget >= 100000) {
        return `₹${(budget / 100000).toFixed(1)}L`;
      } else if (budget >= 1000) {
        return `₹${(budget / 1000).toFixed(1)}K`;
      } else {
        return `₹${budget}`;
      }
    })()}
  </p>
</div>
            <div className="p-3 rounded-full bg-orange-100">
              <CurrencyRupeeIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default AnalyticsPage;
