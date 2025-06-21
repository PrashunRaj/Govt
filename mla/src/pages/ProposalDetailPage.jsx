// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   ArrowLeftIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   ClockIcon,
//   MapPinIcon,
//   CalendarIcon,
//   CurrencyRupeeIcon,
//   UserIcon,
//   UsersIcon,
//   DocumentTextIcon,
//   PhotoIcon,
//   ChatBubbleLeftRightIcon,
//   HandThumbUpIcon,
//   ExclamationTriangleIcon
// } from '@heroicons/react/24/outline';

// const ProposalDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [actionType, setActionType] = useState('');
//   const [comment, setComment] = useState('');

//   // Mock proposal data - replace with API call
//   const [proposal, setProposal] = useState({
//     id: 1,
//     title: 'School Renovation Project',
//     description: 'Complete renovation of Government Primary School including new classrooms, library, and playground facilities. This project aims to improve the educational infrastructure and provide a better learning environment for students.',
//     detailedDescription: `This comprehensive renovation project will transform the Government Primary School into a modern educational facility. The project includes:

//     • Construction of 6 new classrooms with modern furniture and equipment
//     • Establishment of a well-equipped library with digital resources
//     • Development of a safe and engaging playground area
//     • Installation of proper sanitation facilities
//     • Upgrading electrical and water supply systems
//     • Creating computer lab with internet connectivity
//     • Painting and general maintenance of existing structures

//     The project will directly benefit 450 students and 25 teaching staff members. It will also serve as a model for other schools in the region.`,
//     category: 'Education',
//     budget: 2500000,
//     votes: 156,
//     status: 'pending',
//     submittedBy: 'Rajesh Kumar',
//     submittedDate: '2025-06-01',
//     location: 'Sector 15, Chandigarh',
//     priority: 'high',
//     estimatedDuration: '6 months',
//     beneficiaries: 450,
//     contactEmail: 'rajesh.kumar@email.com',
//     contactPhone: '+91 98765 43210',
//     documents: [
//       { name: 'Project Proposal.pdf', size: '2.4 MB', type: 'pdf' },
//       { name: 'Budget Breakdown.xlsx', size: '1.2 MB', type: 'excel' },
//       { name: 'Site Survey Report.pdf', size: '3.1 MB', type: 'pdf' }
//     ],
//     images: [
//       'https://via.placeholder.com/400x300?text=Current+School+Building',
//       'https://via.placeholder.com/400x300?text=Proposed+Design',
//       'https://via.placeholder.com/400x300?text=Site+Layout'
//     ],
//     timeline: [
//       { phase: 'Planning & Design', duration: '1 month', status: 'pending' },
//       { phase: 'Approval & Permits', duration: '2 weeks', status: 'pending' },
//       { phase: 'Construction Phase 1', duration: '2 months', status: 'pending' },
//       { phase: 'Construction Phase 2', duration: '2 months', status: 'pending' },
//       { phase: 'Final Inspection', duration: '2 weeks', status: 'pending' }
//     ],
//     comments: [
//       {
//         id: 1,
//         author: 'Priya Sharma',
//         role: 'Parent',
//         comment: 'This is exactly what our children need. The current facilities are inadequate.',
//         date: '2025-06-02',
//         likes: 12
//       },
//       {
//         id: 2,
//         author: 'Amit Singh',
//         role: 'Teacher',
//         comment: 'As a teacher at this school, I fully support this proposal. It will greatly improve our teaching capabilities.',
//         date: '2025-06-03',
//         likes: 8
//       }
//     ]
//   });

//   useEffect(() => {
//     // Simulate API call
//     setTimeout(() => setLoading(false), 1000);
//   }, [id]);

//   const handleStatusChange = (newStatus) => {
//     setActionType(newStatus);
//     setShowConfirmModal(true);
//   };

//   const confirmAction = () => {
//     setProposal(prev => ({ ...prev, status: actionType }));
//     setShowConfirmModal(false);
//     setActionType('');
//     setComment('');
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
//       <div className="flex items-center space-x-4">
//         <button
//           onClick={() => navigate('/proposals')}
//           className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
//         >
//           <ArrowLeftIcon className="h-5 w-5" />
//         </button>
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold text-gray-900">{proposal.title}</h1>
//           <p className="text-gray-600 mt-1">Proposal #{proposal.id} • Submitted by {proposal.submittedBy}</p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}>
//             {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
//           </span>
//           <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(proposal.priority)}`}>
//             {proposal.priority.charAt(0).toUpperCase() + proposal.priority.slice(1)} Priority
//           </span>
//         </div>
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Main Content */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Overview */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Overview</h2>
//             <p className="text-gray-700 mb-4">{proposal.description}</p>
//             <div className="prose max-w-none">
//               <pre className="whitespace-pre-wrap text-gray-700 font-sans">{proposal.detailedDescription}</pre>
//             </div>
//           </div>

//           {/* Project Images */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Images</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {proposal.images.map((image, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={image}
//                     alt={`Project image ${index + 1}`}
//                     className="w-full h-48 object-cover rounded-lg border border-gray-200"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Timeline */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Timeline</h2>
//             <div className="space-y-4">
//               {proposal.timeline.map((phase, index) => (
//                 <div key={index} className="flex items-center space-x-4">
//                   <div className="flex-shrink-0">
//                     <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
//                       <span className="text-sm font-medium text-gray-600">{index + 1}</span>
//                     </div>
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-sm font-medium text-gray-900">{phase.phase}</h3>
//                     <p className="text-sm text-gray-600">{phase.duration}</p>
//                   </div>
//                   <div className="flex-shrink-0">
//                     <span className="px-2 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
//                       {phase.status}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Comments */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Community Comments</h2>
//             <div className="space-y-4">
//               {proposal.comments.map((comment) => (
//                 <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
//                   <div className="flex items-start space-x-3">
//                     <div className="flex-shrink-0">
//                       <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
//                         <UserIcon className="h-4 w-4 text-blue-600" />
//                       </div>
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-2">
//                         <span className="font-medium text-gray-900">{comment.author}</span>
//                         <span className="text-sm text-gray-500">({comment.role})</span>
//                         <span className="text-sm text-gray-500">• {comment.date}</span>
//                       </div>
//                       <p className="text-gray-700 mt-1">{comment.comment}</p>
//                       <div className="flex items-center space-x-2 mt-2">
//                         <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600">
//                           <HandThumbUpIcon className="h-4 w-4" />
//                           <span>{comment.likes}</span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right Column - Sidebar */}
//         <div className="space-y-6">
//           {/* Action Buttons */}
//           {proposal.status === 'pending' && (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
//               <div className="space-y-3">
//                 <button
//                   onClick={() => handleStatusChange('approved')}
//                   className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//                 >
//                   <CheckCircleIcon className="h-5 w-5" />
//                   <span>Approve Proposal</span>
//                 </button>
//                 <button
//                   onClick={() => handleStatusChange('rejected')}
//                   className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//                 >
//                   <XCircleIcon className="h-5 w-5" />
//                   <span>Reject Proposal</span>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Key Details */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Details</h3>
//             <div className="space-y-4">
//               <div className="flex items-center space-x-3">
//                 <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
//                 <div>
//                   <p className="text-sm text-gray-600">Budget</p>
//                   <p className="font-semibold text-gray-900">₹{(proposal.budget / 100000).toFixed(1)} Lakhs</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <UsersIcon className="h-5 w-5 text-gray-400" />
//                 <div>
//                   <p className="text-sm text-gray-600">Beneficiaries</p>
//                   <p className="font-semibold text-gray-900">{proposal.beneficiaries} people</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <ClockIcon className="h-5 w-5 text-gray-400" />
//                 <div>
//                   <p className="text-sm text-gray-600">Duration</p>
//                   <p className="font-semibold text-gray-900">{proposal.estimatedDuration}</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <MapPinIcon className="h-5 w-5 text-gray-400" />
//                 <div>
//                   <p className="text-sm text-gray-600">Location</p>
//                   <p className="font-semibold text-gray-900">{proposal.location}</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <HandThumbUpIcon className="h-5 w-5 text-gray-400" />
//                 <div>
//                   <p className="text-sm text-gray-600">Community Votes</p>
//                   <p className="font-semibold text-gray-900">{proposal.votes} votes</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Contact Information */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
//             <div className="space-y-3">
//               <div>
//                 <p className="text-sm text-gray-600">Submitted by</p>
//                 <p className="font-semibold text-gray-900">{proposal.submittedBy}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Email</p>
//                 <p className="text-blue-600">{proposal.contactEmail}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Phone</p>
//                 <p className="text-gray-900">{proposal.contactPhone}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Submitted on</p>
//                 <p className="text-gray-900">{proposal.submittedDate}</p>
//               </div>
//             </div>
//           </div>

//           {/* Documents */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
//             <div className="space-y-3">
//               {proposal.documents.map((doc, index) => (
//                 <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
//                   <DocumentTextIcon className="h-5 w-5 text-gray-400" />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-900">{doc.name}</p>
//                     <p className="text-xs text-gray-500">{doc.size}</p>
//                   </div>
//                   <button className="text-blue-600 hover:text-blue-700 text-sm">Download</button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       {showConfirmModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex items-center space-x-3 mb-4">
//               <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Confirm {actionType === 'approved' ? 'Approval' : 'Rejection'}
//               </h3>
//             </div>
//             <p className="text-gray-600 mb-4">
//               Are you sure you want to {actionType === 'approved' ? 'approve' : 'reject'} this proposal?
//               This action cannot be undone.
//             </p>
//             <textarea
//               placeholder="Add a comment (optional)"
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md mb-4"
//               rows="3"
//             />
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => setShowConfirmModal(false)}
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmAction}
//                 className={`flex-1 px-4 py-2 rounded-md text-white ${
//                   actionType === 'approved' 
//                     ? 'bg-green-600 hover:bg-green-700' 
//                     : 'bg-red-600 hover:bg-red-700'
//                 }`}
//               >
//                 {actionType === 'approved' ? 'Approve' : 'Reject'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProposalDetailPage;


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  UserIcon,
  UsersIcon,
  DocumentTextIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  HandThumbUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ProposalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (id && user) {
      fetchProposalDetails();
    }
  }, [id, user]);

  const fetchProposalDetails = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get(`${backendUrl}/api/mla/proposals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setProposal(response.data.data);
        console.log("hello");
        console.log(response.data.data);
       // console.log(proposal.status);
      } else {
        setError('Proposal not found');
      }
    } catch (error) {
      console.error('Error fetching proposal:', error);
      setError('Failed to load proposal details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    setActionType(newStatus);
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    try {
      const token = await getToken();
      const endpoint = actionType === 'approved' ? 'approve' : 'reject';
      
      const response = await axios.post(
        `${backendUrl}/api/mla/proposals/${id}/${endpoint}`,
        { reason: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setProposal(prev => ({ ...prev, status: actionType }));
        setShowConfirmModal(false);
        setActionType('');
        setComment('');
        alert(`Proposal ${actionType} successfully!`);
      }
    } catch (error) {
      console.error('Error updating proposal:', error);
      alert('Failed to update proposal. Please try again.');
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
          <h1 className="text-3xl font-bold text-gray-900">{proposal.title}</h1>
          <p className="text-gray-600 mt-1">Proposal #{proposal.id} • Submitted by {proposal.submittedBy}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}>
            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1).replace('_', ' ')}
          </span>
          {proposal.priority && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(proposal.priority)}`}>
              {proposal.priority.charAt(0).toUpperCase() + proposal.priority.slice(1)} Priority
            </span>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Overview</h2>
            <p className="text-gray-700 mb-4">{proposal.description}</p>
          </div>

          {/* Project Image */}
          {proposal.image && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Image</h2>
              <img
                src={proposal.image}
                alt={proposal.title}
                className="w-full h-64 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Action Buttons */}
          {proposal.status === 'pending' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleStatusChange('approved')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>Approve Proposal</span>
                </button>
                <button
                  onClick={() => handleStatusChange('rejected')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <XCircleIcon className="h-5 w-5" />
                  <span>Reject Proposal</span>
                </button>
              </div>
            </div>
          )}

          {/* Manage Project Button */}
          {(proposal.status === 'approved' || proposal.status === 'in_progress') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Management</h3>
              <button
                onClick={() => navigate(`/mla/manage/${proposal.id}`)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <ClockIcon className="h-5 w-5" />
                <span>Manage Project</span>
              </button>
            </div>
          )}

          {/* Key Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Details</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-semibold text-gray-900">₹{((proposal.budget || 0) / 100000).toFixed(1)} Lakhs</p>
                </div>
              </div>
              {proposal.beneficiaries && (
                <div className="flex items-center space-x-3">
                  <UsersIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Beneficiaries</p>
                    <p className="font-semibold text-gray-900">{proposal.beneficiaries} people</p>
                  </div>
                </div>
              )}
              {proposal.estimatedDuration && (
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">{proposal.estimatedDuration}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">{proposal.constituency}, {proposal.district}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <HandThumbUpIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Community Votes</p>
                  <p className="font-semibold text-gray-900">{proposal.votes || 0} votes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Submitted by</p>
                <p className="font-semibold text-gray-900">{proposal.submittedBy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="text-gray-900">{proposal.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submitted on</p>
                <p className="text-gray-900">{proposal.submittedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm {actionType === 'approved' ? 'Approval' : 'Rejection'}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to {actionType === 'approved' ? 'approve' : 'reject'} this proposal?
              This action cannot be undone.
            </p>
            <textarea
              placeholder="Add a comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
              rows="3"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 rounded-md text-white ${
                  actionType === 'approved' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType === 'approved' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalDetailPage;
