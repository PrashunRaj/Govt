// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   DocumentTextIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   ClockIcon,
//   EyeIcon,
//   MapPinIcon,
//   CalendarIcon,
//   CurrencyRupeeIcon,
//   UserIcon,
//   FunnelIcon,
//   MagnifyingGlassIcon
// } from '@heroicons/react/24/outline';

// const ProposalsPage = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState('newest');

//   // Mock proposals data - replace with API calls
//   const [proposals, setProposals] = useState([
//     {
//       id: 1,
//       title: 'School Renovation Project',
//       description: 'Complete renovation of Government Primary School including new classrooms, library, and playground facilities.',
//       category: 'Education',
//       budget: 2500000,
//       votes: 156,
//       status: 'pending',
//       submittedBy: 'Rajesh Kumar',
//       submittedDate: '2025-06-01',
//       location: 'Sector 15, Chandigarh',
//       priority: 'high',
//       estimatedDuration: '6 months',
//       beneficiaries: 450
//     },
//     {
//       id: 2,
//       title: 'Community Health Center',
//       description: 'Establishment of a new community health center with modern medical equipment and 24/7 emergency services.',
//       category: 'Healthcare',
//       budget: 4200000,
//       votes: 203,
//       status: 'approved',
//       submittedBy: 'Dr. Priya Sharma',
//       submittedDate: '2025-05-28',
//       location: 'Sector 22, Chandigarh',
//       priority: 'high',
//       estimatedDuration: '8 months',
//       beneficiaries: 2500
//     },
//     {
//       id: 3,
//       title: 'Park Development Initiative',
//       description: 'Development of a recreational park with jogging tracks, children\'s play area, and green spaces.',
//       category: 'Environment',
//       budget: 1800000,
//       votes: 89,
//       status: 'rejected',
//       submittedBy: 'Amit Singh',
//       submittedDate: '2025-05-25',
//       location: 'Sector 8, Chandigarh',
//       priority: 'medium',
//       estimatedDuration: '4 months',
//       beneficiaries: 800
//     },
//     {
//       id: 4,
//       title: 'Road Repair and Maintenance',
//       description: 'Comprehensive road repair including pothole filling, resurfacing, and improved drainage systems.',
//       category: 'Infrastructure',
//       budget: 3200000,
//       votes: 234,
//       status: 'pending',
//       submittedBy: 'Sunita Devi',
//       submittedDate: '2025-06-03',
//       location: 'Multiple Sectors',
//       priority: 'high',
//       estimatedDuration: '3 months',
//       beneficiaries: 5000
//     },
//     {
//       id: 5,
//       title: 'Street Light Installation',
//       description: 'Installation of LED street lights in residential areas to improve safety and visibility.',
//       category: 'Infrastructure',
//       budget: 950000,
//       votes: 112,
//       status: 'approved',
//       submittedBy: 'Mohan Lal',
//       submittedDate: '2025-05-30',
//       location: 'Sector 45, Chandigarh',
//       priority: 'medium',
//       estimatedDuration: '2 months',
//       beneficiaries: 1200
//     }
//   ]);

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 1000);
//   }, []);

//   const handleProposalClick = (proposalId) => {
//     navigate(`/proposals/${proposalId}`);
//   };

//   const handleStatusChange = (proposalId, newStatus) => {
//     setProposals(prev => 
//       prev.map(proposal => 
//         proposal.id === proposalId 
//           ? { ...proposal, status: newStatus }
//           : proposal
//       )
//     );
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'approved': return 'text-green-600 bg-green-100';
//       case 'rejected': return 'text-red-600 bg-red-100';
//       case 'pending': return 'text-yellow-600 bg-yellow-100';
//       default: return 'text-gray-600 bg-gray-100';
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high': return 'text-red-600 bg-red-100';
//       case 'medium': return 'text-yellow-600 bg-yellow-100';
//       case 'low': return 'text-green-600 bg-green-100';
//       default: return 'text-gray-600 bg-gray-100';
//     }
//   };

//   const filteredProposals = proposals
//     .filter(proposal => {
//       if (filter !== 'all' && proposal.status !== filter) return false;
//       if (searchTerm && !proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
//           !proposal.category.toLowerCase().includes(searchTerm.toLowerCase())) return false;
//       return true;
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case 'newest': return new Date(b.submittedDate) - new Date(a.submittedDate);
//         case 'oldest': return new Date(a.submittedDate) - new Date(b.submittedDate);
//         case 'votes': return b.votes - a.votes;
//         case 'budget': return b.budget - a.budget;
//         default: return 0;
//       }
//     });

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Proposals Management</h1>
//           <p className="text-gray-600 mt-1">Review and manage community development proposals</p>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {/* Search */}
//           <div className="relative">
//             <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search proposals..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             />
//           </div>

//           {/* Status Filter */}
//           <div className="relative">
//             <FunnelIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             >
//               <option value="all">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="approved">Approved</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>

//           {/* Sort By */}
//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//             className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           >
//             <option value="newest">Newest First</option>
//             <option value="oldest">Oldest First</option>
//             <option value="votes">Most Voted</option>
//             <option value="budget">Highest Budget</option>
//           </select>

//           {/* Results Count */}
//           <div className="flex items-center text-sm text-gray-600">
//             Showing {filteredProposals.length} of {proposals.length} proposals
//           </div>
//         </div>
//       </div>

//       {/* Proposals List */}
//       <div className="space-y-4">
//         {filteredProposals.map((proposal) => (
//           <div key={proposal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
//             <div className="flex justify-between items-start">
//               <div className="flex-1">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">{proposal.title}</h3>
//                     <p className="text-gray-600 mb-4 line-clamp-2">{proposal.description}</p>
                    
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                       <div className="flex items-center space-x-2">
//                         <CurrencyRupeeIcon className="h-4 w-4 text-gray-400" />
//                         <span className="text-sm text-gray-600">₹{(proposal.budget / 100000).toFixed(1)}L</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <UserIcon className="h-4 w-4 text-gray-400" />
//                         <span className="text-sm text-gray-600">{proposal.votes} votes</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <MapPinIcon className="h-4 w-4 text-gray-400" />
//                         <span className="text-sm text-gray-600">{proposal.location}</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <CalendarIcon className="h-4 w-4 text-gray-400" />
//                         <span className="text-sm text-gray-600">{proposal.submittedDate}</span>
//                       </div>
//                     </div>

//                     <div className="flex items-center space-x-3">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
//                         {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
//                       </span>
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(proposal.priority)}`}>
//                         {proposal.priority.charAt(0).toUpperCase() + proposal.priority.slice(1)} Priority
//                       </span>
//                       <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-100">
//                         {proposal.category}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-col space-y-2 ml-6">
//                 <button
//                   onClick={() => handleProposalClick(proposal.id)}
//                   className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                 >
//                   <EyeIcon className="h-4 w-4" />
//                   <span>View Details</span>
//                 </button>

//                 {proposal.status === 'pending' && (
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => handleStatusChange(proposal.id, 'approved')}
//                       className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//                     >
//                       <CheckCircleIcon className="h-4 w-4" />
//                       <span>Approve</span>
//                     </button>
//                     <button
//                       onClick={() => handleStatusChange(proposal.id, 'rejected')}
//                       className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//                     >
//                       <XCircleIcon className="h-4 w-4" />
//                       <span>Reject</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredProposals.length === 0 && (
//         <div className="text-center py-12">
//           <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
//           <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProposalsPage;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  UserIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const ProposalsPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [proposals, setProposals] = useState([]);
  const [mlaProfile, setMlaProfile] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (user) {
      fetchMlaProfile();
      fetchProposals();
    }
  }, [user]);

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

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      // Get proposals from MLA's constituency
      const params = new URLSearchParams({
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (mlaProfile?.constituency) {
        params.append('constituency', mlaProfile.constituency);
      }

      const response = await axios.get(`${backendUrl}/api/mla/proposals?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setProposals(response.data.data.proposals);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProposalClick = (proposalId) => {
    navigate(`/mla/proposals/${proposalId}`);
  };

  const handleStatusChange = async (proposalId, newStatus, reason = '') => {
    try {
      const token = await getToken();
      const endpoint = newStatus === 'approved' ? 'approve' : 'reject';
      
      const response = await axios.post(
        `${backendUrl}/api/mla/proposals/${proposalId}/${endpoint}`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update local state
        setProposals(prev => 
          prev.map(proposal => 
            proposal.id === proposalId 
              ? { ...proposal, status: newStatus }
              : proposal
          )
        );
        alert(`Proposal ${newStatus} successfully!`);
      }
    } catch (error) {
      console.error('Error updating proposal status:', error);
      alert('Failed to update proposal status. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
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

  const filteredProposals = proposals
    .filter(proposal => {
      if (filter !== 'all' && proposal.status !== filter) return false;
      if (searchTerm && !proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !proposal.category.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.submittedDate || b.createdAt) - new Date(a.submittedDate || a.createdAt);
        case 'oldest': return new Date(a.submittedDate || a.createdAt) - new Date(b.submittedDate || b.createdAt);
        case 'votes': return (b.votes || 0) - (a.votes || 0);
        case 'budget': return (b.budget || 0) - (a.budget || 0);
        default: return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Proposals Management</h1>
          <p className="text-gray-600 mt-1">
            Review and manage community development proposals from {mlaProfile?.constituency || 'your constituency'}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FunnelIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="votes">Most Voted</option>
            <option value="budget">Highest Budget</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-600">
            Showing {filteredProposals.length} of {proposals.length} proposals
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.map((proposal) => (
          <div key={proposal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{proposal.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{proposal.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <CurrencyRupeeIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">₹{((proposal.budget || 0) / 100000).toFixed(1)}L</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{proposal.votes || 0} votes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{proposal.constituency}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{proposal.submittedDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1).replace('_', ' ')}
                      </span>
                      {proposal.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(proposal.priority)}`}>
                          {proposal.priority.charAt(0).toUpperCase() + proposal.priority.slice(1)} Priority
                        </span>
                      )}
                      <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-100">
                        {proposal.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2 ml-6">
                <button
                  onClick={() => handleProposalClick(proposal.id)}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>View Details</span>
                </button>

                {proposal.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(proposal.id, 'approved')}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(proposal.id, 'rejected')}
                      className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      <XCircleIcon className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}

                {(proposal.status === 'approved' || proposal.status === 'in_progress') && (
                  <button
                    onClick={() => navigate(`/mla/manage/${proposal.id}`)}
                    className="flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    <ClockIcon className="h-4 w-4" />
                    <span>Manage</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProposals.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
          <p className="text-gray-600">
            {proposals.length === 0 
              ? "No proposals have been submitted for your constituency yet." 
              : "Try adjusting your search or filter criteria."
            }
          </p>
        </div>
      )}
    </div>
  );
};
export default ProposalsPage;
