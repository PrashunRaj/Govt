import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  PlayCircle,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Calendar,
  MapPin,
  IndianRupee
} from 'lucide-react';
import axios from 'axios';

const YourProposals = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Under Review' },
    approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
    rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' },
    in_progress: { color: 'bg-blue-100 text-blue-800', icon: PlayCircle, label: 'In Progress' },
    completed: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle, label: 'Completed' }
  };

  useEffect(() => {
    if (user) {
      getUserProfile();
    }
  }, [user]);

  useEffect(() => {
    if (userProfile) {
      fetchUserProposals();
    }
  }, [userProfile, filter, searchTerm, sortBy, sortOrder]);

  const getUserProfile = async () => {
    try {
      const cached = localStorage.getItem('userProfile');
      if (cached){
        const profile = JSON.parse(cached);
        if (profile.clerkId === user.id && profile.onboardingCompleted){
          setUserProfile(profile);
          return;
        }
      }
      const token = await getToken();
      const response = await axios.get(`${backendUrl}/api/user/profile/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUserProfile(response.data.data);
        localStorage.setItem('userProfile', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
    }
  };

  const fetchUserProposals = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        sortBy: sortBy,
        sortOrder: sortOrder,
        limit: 50 // Get more proposals for user's own list
      });

      if (filter !== 'all') params.append('status', filter);
      if (searchTerm) params.append('search', searchTerm);
       const token = await getToken();
      const response = await axios.get(`${backendUrl}/api/user/all-proposals?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        // Filter to only show user's proposals
        const userProposals = response.data.data.proposals.filter(
          proposal => proposal.authorId === user.id
        );
        setProposals(userProposals);
      }
    } catch (error) {
      console.error('Error fetching user proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackProgress = (proposal) => {
    if (proposal.status === 'approved' || proposal.status === 'in_progress' || proposal.status === 'completed') {
      navigate(`/project-tracking/${proposal.id}`);
    } else {
      alert('Project tracking is available only for approved proposals.');
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  if (!userProfile || !userProfile.onboardingCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Required</h2>
          <p className="text-gray-600">Please complete your profile to view your proposals.</p>
          <button
            onClick={() => navigate('/user-dashboard')}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Complete Profile
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Proposals</h1>
              <p className="text-gray-600">
                Track and manage your community proposals • {proposals.length} proposals submitted
              </p>
            </div>
            <button
              onClick={() => navigate('/add-proposals')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>New Proposal</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = proposals.filter(p => p.status === status).length;
            const Icon = config.icon;
            return (
              <div key={status} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${config.color}`}>
                    <Icon size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600">{config.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your proposals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Under Review</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="votes-desc">Most Votes</option>
              <option value="budget-desc">Highest Budget</option>
            </select>
          </div>
        </div>

        {/* Proposals List */}
        {proposals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No proposals yet</h3>
            <p className="text-gray-600 mb-6">Start making a difference in your community by submitting your first proposal.</p>
            <button
              onClick={() => navigate('/add-proposals')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Submit Your First Proposal
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {proposals.map((proposal) => {
              const statusInfo = statusConfig[proposal.status];
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={proposal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{proposal.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} flex items-center space-x-1`}>
                            <StatusIcon size={16} />
                            <span>{statusInfo.label}</span>
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{proposal.description}</p>
                      </div>
                    </div>

                    {/* Proposal Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <IndianRupee size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Budget</p>
                          <p className="font-semibold">₹{proposal.budget?.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Votes</p>
                          <p className="font-semibold">{proposal.votes || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Submitted</p>
                          <p className="font-semibold">{proposal.submittedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Category</p>
                          <p className="font-semibold">{proposal.category}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar for Approved/In Progress/Completed */}
                    {(proposal.status === 'approved' || proposal.status === 'in_progress' || proposal.status === 'completed') && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Project Progress</span>
                          <span>{proposal.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(proposal.progress || 0)}`}
                            style={{ width: `${proposal.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => navigate(`/proposal-detail/${proposal.id}`)}
                          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
                        >
                          <Eye size={16} />
                          <span>View Details</span>
                        </button>
                        
                        {(proposal.status === 'approved' || proposal.status === 'in_progress' || proposal.status === 'completed') && (
                          <button
                            onClick={() => handleTrackProgress(proposal)}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                          >
                            <TrendingUp size={16} />
                            <span>Track Progress</span>
                          </button>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        {proposal.estimatedDuration && (
                          <span>Duration: {proposal.estimatedDuration}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default YourProposals;
