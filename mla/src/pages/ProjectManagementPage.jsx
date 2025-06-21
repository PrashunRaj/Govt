import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import {
  ArrowLeftIcon,
  PencilIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  CurrencyRupeeIcon,
  MapPinIcon,
  UsersIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const ProjectManagementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState(null);
  const [mlaProfile, setMlaProfile] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    progress: 0,
    status: '',
    notes: ''
  });
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (user && id) {
      fetchProposalData();
      fetchMlaProfile();
    }
  }, [id, user]);

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

  const fetchProposalData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await axios.get(`${backendUrl}/api/mla/proposals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const proposalData = response.data.data;
        
        // Check if proposal can be managed
        if (!['approved', 'in_progress', 'completed'].includes(proposalData.status)) {
          setError('This proposal is not approved yet and cannot be managed as a project.');
          return;
        }
        
        setProposal(proposalData);
        setUpdateData({
          progress: proposalData.progress || 0,
          status: proposalData.status,
          notes: proposalData.reviewNotes || ''
        });
      } else {
        setError('Proposal not found');
      }
    } catch (error) {
      console.error('Error fetching proposal:', error);
      setError('Failed to load proposal data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async () => {
    try {
      const token = await getToken();
      
      const response = await axios.post(
        `${backendUrl}/api/mla/proposals/${id}/update-status`,
        {
          status: updateData.status,
          progress: parseInt(updateData.progress),
          notes: updateData.notes
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        await fetchProposalData(); // Refresh data
        setShowUpdateModal(false);
        alert('Project updated successfully!');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'approved': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case 'in_progress': return <PlayIcon className="h-6 w-6 text-blue-600" />;
      case 'approved': return <ClockIcon className="h-6 w-6 text-yellow-600" />;
      default: return <ClockIcon className="h-6 w-6 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Proposal not found'}</p>
          <button
            onClick={() => navigate('/mla/proposals')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Proposals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/mla/proposals')}
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-1">{proposal.title} • Track and update project progress</p>
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

      {/* Project Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{proposal.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-medium">₹{(proposal.budget / 100000).toFixed(1)} Lakhs</p>
                </div>
              </div>
              {proposal.beneficiaries > 0 && (
                <div className="flex items-center space-x-3">
                  <UsersIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Beneficiaries</p>
                    <p className="font-medium">{proposal.beneficiaries} people</p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">
                    {proposal.location || `${proposal.constituency}, ${proposal.district}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Submitted By</p>
                  <p className="font-medium">{proposal.authorName || proposal.authorEmail || 'Anonymous'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Submitted Date</p>
                  <p className="font-medium">{new Date(proposal.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {proposal.approvalDate && (
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Approved Date</p>
                    <p className="font-medium">{new Date(proposal.approvalDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              {proposal.estimatedDuration && (
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Estimated Duration</p>
                    <p className="font-medium">{proposal.estimatedDuration}</p>
                  </div>
                </div>
              )}
              {proposal.reviewedBy && (
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Reviewed By</p>
                    <p className="font-medium">{proposal.reviewedBy}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Progress Overview</h2>
          <button
            onClick={() => setShowUpdateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PencilIcon className="h-4 w-4" />
            <span>Update Progress</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">{proposal.progress || 0}%</div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">{proposal.votes || 0}</div>
            <div className="text-sm text-gray-600">Community Votes</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600">{proposal.viewCount || 0}</div>
            <div className="text-sm text-gray-600">Views</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Project Progress</span>
            <span>{proposal.progress || 0}%</span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                proposal.status === 'completed' ? 'bg-green-600' :
                proposal.status === 'in_progress' ? 'bg-blue-600' :
                'bg-yellow-600'
              }`}
              style={{ width: `${proposal.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Status Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className={`p-4 rounded-lg border-2 ${
            proposal.status === 'approved' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircleIcon className={`h-5 w-5 ${
                proposal.status === 'approved' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <span className="font-medium">Approved</span>
            </div>
            {proposal.approvalDate && (
              <p className="text-xs text-gray-600">
                {new Date(proposal.approvalDate).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className={`p-4 rounded-lg border-2 ${
            proposal.status === 'in_progress' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <PlayIcon className={`h-5 w-5 ${
                proposal.status === 'in_progress' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <span className="font-medium">In Progress</span>
            </div>
            {proposal.startDate && (
              <p className="text-xs text-gray-600">
                {new Date(proposal.startDate).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className={`p-4 rounded-lg border-2 ${
            proposal.progress >= 90 ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircleIcon className={`h-5 w-5 ${
                proposal.progress >= 90 ? 'text-green-600' : 'text-gray-400'
              }`} />
              <span className="font-medium">Near Completion</span>
            </div>
            <p className="text-xs text-gray-600">90%+ Progress</p>
          </div>

          <div className={`p-4 rounded-lg border-2 ${
            proposal.status === 'completed' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircleIcon className={`h-5 w-5 ${
                proposal.status === 'completed' ? 'text-green-600' : 'text-gray-400'
              }`} />
              <span className="font-medium">Completed</span>
            </div>
            {proposal.status === 'completed' && (
              <p className="text-xs text-gray-600">
                {new Date(proposal.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Project Description */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Description</h2>
        <p className="text-gray-700 mb-4">{proposal.description}</p>
        
        {proposal.image && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Project Image</h3>
            <img
              src={proposal.image}
              alt={proposal.title}
              className="w-full max-w-md h-64 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}

        {proposal.reviewNotes && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Review Notes</h3>
            <p className="text-blue-800">{proposal.reviewNotes}</p>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Project Progress</h3>
            
            <div className="space-y-4">
              {/* Progress Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress: {updateData.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={updateData.progress}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, progress: e.target.value }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="approved">Approved</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Update Notes</label>
                <textarea
                  value={updateData.notes}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add progress update notes..."
                  className="w-full p-3 border border-gray-300 rounded-md"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProgress}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectManagementPage;
