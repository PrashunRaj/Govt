import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  UserIcon,
  UsersIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const ProjectTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState(null);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (id && user) {
      fetchProposalData();
    }
  }, [id, user]);

  const fetchProposalData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      // Fetch specific proposal by ID
      const response = await axios.get(`${backendUrl}/api/user/proposals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const proposalData = response.data.data;
        
        // Check if user owns this proposal
        if (proposalData.author !== user.id) {
          setError('Access denied. You can only track your own proposals.');
          return;
        }

        setProposal(proposalData);
      } else {
        setError('Proposal not found');
      }
    } catch (error) {
      console.error('Error fetching proposal data:', error);
      setError('Failed to load proposal data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'under_review': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case 'in_progress': return <PlayIcon className="h-6 w-6 text-blue-600" />;
      case 'approved': return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case 'under_review': return <ClockIcon className="h-6 w-6 text-yellow-600" />;
      case 'pending': return <ClockIcon className="h-6 w-6 text-gray-400" />;
      case 'rejected': return <XCircleIcon className="h-6 w-6 text-red-600" />;
      default: return <ClockIcon className="h-6 w-6 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Animated Progress Bar Component
  const AnimatedProgressBar = ({ progress, color = 'bg-blue-600', height = 'h-3' }) => {
    const [animatedWidth, setAnimatedWidth] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimatedWidth(progress);
      }, 300);
      return () => clearTimeout(timer);
    }, [progress]);

    return (
      <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
    );
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
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/your-proposals')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Your Proposals
          </button>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Proposal Not Found</h2>
          <p className="text-gray-600">The requested proposal could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/your-proposals')}
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{proposal.title}</h1>
          <p className="text-gray-600 mt-1">
            Proposal Tracking • Submitted on {new Date(proposal.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}>
            {proposal.status?.charAt(0).toUpperCase() + proposal.status?.slice(1).replace('_', ' ')}
          </span>
          {proposal.priority && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(proposal.priority)}`}>
              {proposal.priority?.charAt(0).toUpperCase() + proposal.priority?.slice(1)} Priority
            </span>
          )}
        </div>
      </div>

      {/* Overall Progress Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Current Status</h2>
            <p className="text-blue-100">Proposal progress tracking</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{proposal.progress || 0}%</div>
            <div className="text-blue-100">Progress</div>
          </div>
        </div>
        <AnimatedProgressBar 
          progress={proposal.progress || 0} 
          color="bg-white" 
          height="h-4"
        />
        <div className="flex justify-between text-sm text-blue-100 mt-2">
          <span>Submitted: {new Date(proposal.createdAt).toLocaleDateString()}</span>
          <span>
            {proposal.estimatedDuration ? `Duration: ${proposal.estimatedDuration}` : 'Duration: TBD'}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Proposal Timeline</h3>
            
            <div className="space-y-6">
              {/* Submitted */}
              <div className="relative">
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-300"></div>
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">Proposal Submitted</h4>
                      <span className="px-3 py-1 rounded-full text-sm font-medium text-green-600 bg-green-100">
                        Completed
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">Your proposal has been successfully submitted to the system.</p>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Date:</span> {new Date(proposal.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Under Review */}
              <div className="relative">
                {proposal.status !== 'pending' && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-300"></div>
                )}
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                      ['under_review', 'approved', 'rejected', 'in_progress', 'completed'].includes(proposal.status)
                        ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-300'
                    }`}>
                      {getStatusIcon(['under_review', 'approved', 'rejected', 'in_progress', 'completed'].includes(proposal.status) ? 'completed' : 'pending')}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">Under Review</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        ['under_review', 'approved', 'rejected', 'in_progress', 'completed'].includes(proposal.status)
                          ? 'text-blue-600 bg-blue-100' : 'text-gray-600 bg-gray-100'
                      }`}>
                        {['under_review', 'approved', 'rejected', 'in_progress', 'completed'].includes(proposal.status) ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">Proposal is being reviewed by local representatives.</p>
                    {proposal.reviewDate && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Reviewed:</span> {new Date(proposal.reviewDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Decision Made */}
              <div className="relative">
                {['approved', 'in_progress', 'completed'].includes(proposal.status) && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-300"></div>
                )}
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                      ['approved', 'rejected', 'in_progress', 'completed'].includes(proposal.status)
                        ? proposal.status === 'rejected' 
                          ? 'bg-red-100 border-red-500' 
                          : 'bg-green-100 border-green-500'
                        : 'bg-gray-100 border-gray-300'
                    }`}>
                      {getStatusIcon(['approved', 'rejected', 'in_progress', 'completed'].includes(proposal.status) ? proposal.status : 'pending')}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">Decision Made</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        ['approved', 'rejected', 'in_progress', 'completed'].includes(proposal.status)
                          ? proposal.status === 'rejected'
                            ? 'text-red-600 bg-red-100'
                            : 'text-green-600 bg-green-100'
                          : 'text-gray-600 bg-gray-100'
                      }`}>
                        {['approved', 'rejected', 'in_progress', 'completed'].includes(proposal.status) 
                          ? proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1).replace('_', ' ')
                          : 'Pending'
                        }
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">
                      {proposal.status === 'approved' || proposal.status === 'in_progress' || proposal.status === 'completed'
                        ? 'Your proposal has been approved for implementation.'
                        : proposal.status === 'rejected'
                        ? 'Your proposal has been rejected.'
                        : 'Waiting for decision from local representatives.'
                      }
                    </p>
                    {proposal.approvalDate && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Decision Date:</span> {new Date(proposal.approvalDate).toLocaleDateString()}
                      </div>
                    )}
                    {proposal.reviewNotes && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-gray-900">Notes: </span>
                        <span className="text-gray-700">{proposal.reviewNotes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Implementation (only show if approved) */}
              {['approved', 'in_progress', 'completed'].includes(proposal.status) && (
                <div className="relative">
                  {proposal.status === 'completed' && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-300"></div>
                  )}
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                        ['in_progress', 'completed'].includes(proposal.status)
                          ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-300'
                      }`}>
                        {getStatusIcon(['in_progress', 'completed'].includes(proposal.status) ? 'in_progress' : 'pending')}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">Implementation</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          ['in_progress', 'completed'].includes(proposal.status)
                            ? 'text-blue-600 bg-blue-100' : 'text-gray-600 bg-gray-100'
                        }`}>
                          {['in_progress', 'completed'].includes(proposal.status) ? 'In Progress' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">Project implementation and construction phase.</p>
                      {(proposal.progress || 0) > 0 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{proposal.progress}%</span>
                          </div>
                          <AnimatedProgressBar 
                            progress={proposal.progress}
                            color="bg-blue-600"
                          />
                        </div>
                      )}
                      {proposal.startDate && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Started:</span> {new Date(proposal.startDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Completion (only show if completed) */}
              {proposal.status === 'completed' && (
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">Project Completed</h4>
                      <span className="px-3 py-1 rounded-full text-sm font-medium text-green-600 bg-green-100">
                        Completed
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">Your proposal has been successfully implemented and completed.</p>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Completed:</span> {new Date(proposal.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Info Sidebar */}
        <div className="space-y-6">
          {/* Proposal Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposal Details</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-semibold text-gray-900">₹{(proposal.budget / 100000).toFixed(1)} Lakhs</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">
                    {proposal.location || `${proposal.constituency}, ${proposal.district}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold text-gray-900">{proposal.category}</p>
                </div>
              </div>
              {proposal.beneficiaries && proposal.beneficiaries > 0 && (
                <div className="flex items-center space-x-3">
                  <UsersIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Beneficiaries</p>
                    <p className="font-semibold text-gray-900">{proposal.beneficiaries.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Proposal Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposal Info</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Submitted By</p>
                <p className="font-semibold text-gray-900">You</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Priority</p>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(proposal.priority)}`}>
                  {proposal.priority?.toUpperCase() || 'MEDIUM'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Status</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {proposal.status.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Community Votes</p>
                <p className="font-semibold text-gray-900">{proposal.votes || 0} votes</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Views</p>
                <p className="font-semibold text-gray-900">{proposal.viewCount || 0} views</p>
              </div>
            </div>
          </div>

          {/* Proposal Image */}
          {proposal.image && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposal Image</h3>
              <img
                src={proposal.image}
                alt={proposal.title}
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>
      </div>

      {/* Proposal Description */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Proposal Description</h3>
        <p className="text-gray-700">{proposal.description}</p>
      </div>
    </div>
  );
};

export default ProjectTrackingPage;
