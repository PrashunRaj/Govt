// import React, { useState, useEffect } from 'react';
// import { useAuth } from '@clerk/clerk-react';
// import axios from 'axios';
// import { 
//   UserCheck, 
//   Users, 
//   Search, 
//   Filter, 
//   Eye, 
//   CheckCircle, 
//   XCircle, 
//   Clock,
//   FileText,
//   MapPin,
//   Mail,
//   Phone,
//   Calendar,
//   AlertCircle
// } from 'lucide-react';

// const MlaManagement = () => {
//   const { getToken } = useAuth();
//   const [mlas, setMlas] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedMla, setSelectedMla] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [verificationAction, setVerificationAction] = useState(null);
//   const [remarks, setRemarks] = useState('');
//   const [filters, setFilters] = useState({
//     search: '',
//     state: '',
//     constituency: '',
//     status: ''
//   });
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0
//   });

//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   useEffect(() => {
//     fetchMLAs();
//   }, [filters, pagination.page]);

//   const fetchMLAs = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const token = await getToken();
//       const params = new URLSearchParams({
//         page: pagination.page,
//         limit: pagination.limit,
//         ...(filters.state && { state: filters.state }),
//         ...(filters.constituency && { constituency: filters.constituency }),
//         ...(filters.status && { status: filters.status })
//       });

//       const response = await axios.get(`${backendUrl}/api/admin/mlas?${params}`, {
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });

//       if (response.data.success) {
//         setMlas(response.data.data.mlas);
//         setPagination(prev => ({
//           ...prev,
//           total: response.data.data.pagination.total,
//           totalPages: response.data.data.pagination.totalPages
//         }));
//       }
//     } catch (error) {
//       console.error('Error fetching MLAs:', error);
//       setError(error.response?.data?.message || 'Failed to fetch MLAs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyMLA = async (mlaId, status, verificationRemarks) => {
//     try {
//       const token = await getToken();
//       const response = await axios.post(`${backendUrl}/api/admin/mlas/verify`, {
//         mlaId,
//         status,
//         remarks: verificationRemarks
//       }, {
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });

//       if (response.data.success) {
//         // Update MLA in the list
//         setMlas(prev => prev.map(mla => 
//           mla._id === mlaId 
//             ? { ...mla, verificationStatus: status, verificationRemarks }
//             : mla
//         ));
        
//         setShowModal(false);
//         setSelectedMla(null);
//         setRemarks('');
//         setVerificationAction(null);
        
//         alert(`MLA ${status} successfully!`);
//       }
//     } catch (error) {
//       console.error('Error verifying MLA:', error);
//       alert(error.response?.data?.message || 'Failed to verify MLA');
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
//       verified: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Verified' },
//       rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rejected' }
//     };

//     const config = statusConfig[status] || statusConfig.pending;
//     const Icon = config.icon;

//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
//         <Icon className="w-3 h-3 mr-1" />
//         {config.text}
//       </span>
//     );
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handleSearch = (e) => {
//     if (e.key === 'Enter') {
//       fetchMLAs();
//     }
//   };

//   const openVerificationModal = (mla, action) => {
//     setSelectedMla(mla);
//     setVerificationAction(action);
//     setShowModal(true);
//   };

//   const MLACard = ({ mla }) => (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-center space-x-3">
//           <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
//             <UserCheck className="w-6 h-6 text-indigo-600" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">{mla.fullName}</h3>
//             <p className="text-sm text-gray-500">{mla.constituency}, {mla.state}</p>
//           </div>
//         </div>
//         {getStatusBadge(mla.verificationStatus)}
//       </div>

//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <div className="flex items-center space-x-2 text-sm text-gray-600">
//           <Mail className="w-4 h-4" />
//           <span>{mla.email}</span>
//         </div>
//         <div className="flex items-center space-x-2 text-sm text-gray-600">
//           <Phone className="w-4 h-4" />
//           <span>{mla.phoneNumber}</span>
//         </div>
//         <div className="flex items-center space-x-2 text-sm text-gray-600">
//           <Calendar className="w-4 h-4" />
//           <span>Applied: {new Date(mla.createdAt).toLocaleDateString()}</span>
//         </div>
//         <div className="flex items-center space-x-2 text-sm text-gray-600">
//           <FileText className="w-4 h-4" />
//           <span>Party: {mla.politicalParty}</span>
//         </div>
//       </div>

//       {mla.verificationRemarks && (
//         <div className="mb-4 p-3 bg-gray-50 rounded-lg">
//           <p className="text-sm text-gray-600">
//             <strong>Remarks:</strong> {mla.verificationRemarks}
//           </p>
//         </div>
//       )}

//       <div className="flex space-x-2">
//         <button
//           onClick={() => setSelectedMla(mla)}
//           className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
//         >
//           <Eye className="w-4 h-4" />
//           <span>View Details</span>
//         </button>
        
//         {mla.verificationStatus === 'pending' && (
//           <>
//             <button
//               onClick={() => openVerificationModal(mla, 'verified')}
//               className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
//             >
//               <CheckCircle className="w-4 h-4" />
//               <span>Verify</span>
//             </button>
//             <button
//               onClick={() => openVerificationModal(mla, 'rejected')}
//               className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
//             >
//               <XCircle className="w-4 h-4" />
//               <span>Reject</span>
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading MLAs</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={fetchMLAs}
//             className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">MLA Management</h1>
//           <p className="text-gray-600">Manage MLA verifications and accounts</p>
//         </div>
//         <div className="flex items-center space-x-2 text-sm text-gray-500">
//           <Users className="h-4 w-4" />
//           <span>{pagination.total} Total MLAs</span>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search MLAs..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               value={filters.search}
//               onChange={(e) => handleFilterChange('search', e.target.value)}
//               onKeyPress={handleSearch}
//             />
//           </div>
          
//           <select
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             value={filters.state}
//             onChange={(e) => handleFilterChange('state', e.target.value)}
//           >
//             <option value="">All States</option>
//             <option value="Maharashtra">Maharashtra</option>
//             <option value="Delhi">Delhi</option>
//             <option value="Karnataka">Karnataka</option>
//             <option value="Tamil Nadu">Tamil Nadu</option>
//           </select>
          
//           <select
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             value={filters.status}
//             onChange={(e) => handleFilterChange('status', e.target.value)}
//           >
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="verified">Verified</option>
//             <option value="rejected">Rejected</option>
//           </select>
          
//           <button
//             onClick={fetchMLAs}
//             className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
//           >
//             <Filter className="w-4 h-4" />
//             <span>Apply Filters</span>
//           </button>
//         </div>
//       </div>

//       {/* MLA Grid */}
//       {mlas.length === 0 ? (
//         <div className="text-center py-12">
//           <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No MLAs Found</h3>
//           <p className="text-gray-600">No MLAs match your current filters.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {mlas.map((mla) => (
//             <MLACard key={mla._id} mla={mla} />
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="flex items-center justify-between">
//           <p className="text-sm text-gray-700">
//             Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
//           </p>
//           <div className="flex space-x-2">
//             <button
//               onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
//               disabled={pagination.page === 1}
//               className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Previous
//             </button>
//             <span className="px-3 py-2 text-sm text-gray-700">
//               Page {pagination.page} of {pagination.totalPages}
//             </span>
//             <button
//               onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
//               disabled={pagination.page === pagination.totalPages}
//               className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Verification Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               {verificationAction === 'verified' ? 'Verify MLA' : 'Reject MLA'}
//             </h3>
            
//             <div className="mb-4">
//               <p className="text-sm text-gray-600 mb-2">
//                 Are you sure you want to {verificationAction === 'verified' ? 'verify' : 'reject'} <strong>{selectedMla?.fullName}</strong>?
//               </p>
              
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Remarks (Optional)
//               </label>
//               <textarea
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 rows={3}
//                 placeholder="Add verification remarks..."
//                 value={remarks}
//                 onChange={(e) => setRemarks(e.target.value)}
//               />
//             </div>
            
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => {
//                   setShowModal(false);
//                   setSelectedMla(null);
//                   setRemarks('');
//                   setVerificationAction(null);
//                 }}
//                 className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleVerifyMLA(selectedMla._id, verificationAction, remarks)}
//                 className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
//                   verificationAction === 'verified' 
//                     ? 'bg-green-600 hover:bg-green-700' 
//                     : 'bg-red-600 hover:bg-red-700'
//                 }`}
//               >
//                 {verificationAction === 'verified' ? 'Verify' : 'Reject'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MlaManagement;


import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { 
  UserCheck, 
  Users, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  MapPin,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Download,
  ExternalLink,
  User,
  Building,
  Shield,
  Activity
} from 'lucide-react';

const MlaManagement = () => {
  const { getToken } = useAuth();
  const [mlas, setMlas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMla, setSelectedMla] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [verificationAction, setVerificationAction] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    constituency: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchMLAs();
  }, [filters, pagination.page]);

  const fetchMLAs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getToken();
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.state && { state: filters.state }),
        ...(filters.constituency && { constituency: filters.constituency }),
        ...(filters.status && { status: filters.status })
      });

      const response = await axios.get(`${backendUrl}/api/admin/mlas?${params}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.data.success) {
        setMlas(response.data.data.mlas);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.pagination.total,
          totalPages: response.data.data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Error fetching MLAs:', error);
      setError(error.response?.data?.message || 'Failed to fetch MLAs');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMLA = async (mlaId, status, verificationRemarks) => {
  try {
    const token = await getToken();
    
    // ✅ FIXED: Include mlaId in URL path
    const response = await axios.post(`${backendUrl}/api/admin/mlas/${mlaId}/verify`, {
      status,
      remarks: verificationRemarks
      // ✅ Remove mlaId from body since it's now in URL
    }, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    if (response.data.success) {
      // Update MLA in the list
      setMlas(prev => prev.map(mla => 
        mla._id === mlaId 
          ? { ...mla, verificationStatus: status, verificationNotes: verificationRemarks }
          : mla
      ));
      
      setShowModal(false);
      setShowDetailsModal(false);
      setSelectedMla(null);
      setRemarks('');
      setVerificationAction(null);
      
      alert(`MLA ${status} successfully!`);
      fetchMLAs(); // Refresh the list
    }
  } catch (error) {
    console.error('Error verifying MLA:', error);
    alert(error.response?.data?.message || 'Failed to verify MLA');
  }
};

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
      verified: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Verified' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchMLAs();
    }
  };

  const openVerificationModal = (mla, action) => {
    setSelectedMla(mla);
    setVerificationAction(action);
    setShowModal(true);
  };

  const openDetailsModal = (mla) => {
    setSelectedMla(mla);
    setShowDetailsModal(true);
  };

  const DocumentViewer = ({ document, title }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h5 className="font-medium text-gray-900 mb-2">{title}</h5>
      {document ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Document uploaded</span>
            <div className="flex space-x-2">
              <button
                onClick={() => window.open(document, '_blank')}
                className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center space-x-1"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View</span>
              </button>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = document;
                  link.download = title;
                  link.click();
                }}
                className="text-green-600 hover:text-green-700 text-sm flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <img 
              src={document} 
              alt={title}
              className="w-full h-48 object-cover cursor-pointer hover:opacity-90"
              onClick={() => window.open(document, '_blank')}
            />
          </div>
        </div>
      ) : (
        <p className="text-sm text-red-600">No document uploaded</p>
      )}
    </div>
  );

  const MLACard = ({ mla }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{mla.fullName}</h3>
            <p className="text-sm text-gray-500">{mla.constituency}, {mla.state}</p>
          </div>
        </div>
        {getStatusBadge(mla.verificationStatus)}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{mla.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{mla.phoneNumber}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Applied: {new Date(mla.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FileText className="w-4 h-4" />
          <span>Party: {mla.politicalParty}</span>
        </div>
      </div>

      {mla.verificationNotes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Remarks:</strong> {mla.verificationNotes}
          </p>
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={() => openDetailsModal(mla)}
          className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
        
        {mla.verificationStatus === 'pending' && (
          <>
            <button
              onClick={() => openVerificationModal(mla, 'verified')}
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Verify</span>
            </button>
            <button
              onClick={() => openVerificationModal(mla, 'rejected')}
              className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading MLAs</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchMLAs}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MLA Management</h1>
          <p className="text-gray-600">Manage MLA verifications and accounts</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="h-4 w-4" />
          <span>{pagination.total} Total MLAs</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search MLAs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyPress={handleSearch}
            />
          </div>
          
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
          >
            <option value="">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
          </select>
          
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <button
            onClick={fetchMLAs}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>

      {/* MLA Grid */}
      {mlas.length === 0 ? (
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No MLAs Found</h3>
          <p className="text-gray-600">No MLAs match your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mlas.map((mla) => (
            <MLACard key={mla._id} mla={mla} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MLA Details Modal */}
      {showDetailsModal && selectedMla && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">MLA Verification Details</h3>
                  <p className="text-sm text-gray-600">Review all information and documents</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedMla(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Status Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedMla.fullName}</h4>
                    <p className="text-sm text-gray-600">{selectedMla.constituency}, {selectedMla.state}</p>
                  </div>
                </div>
                {getStatusBadge(selectedMla.verificationStatus)}
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900">{selectedMla.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedMla.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="text-gray-900">{selectedMla.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">First Name</label>
                      <p className="text-gray-900">{selectedMla.firstName || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Name</label>
                      <p className="text-gray-900">{selectedMla.lastName || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Political Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Political Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Constituency</label>
                      <p className="text-gray-900">{selectedMla.constituency}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">District</label>
                      <p className="text-gray-900">{selectedMla.district}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">State</label>
                      <p className="text-gray-900">{selectedMla.state}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Political Party</label>
                      <p className="text-gray-900">{selectedMla.politicalParty}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Term Start Date</label>
                      <p className="text-gray-900">
                        {selectedMla.termStartDate ? new Date(selectedMla.termStartDate).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Term End Date</label>
                      <p className="text-gray-900">
                        {selectedMla.termEndDate ? new Date(selectedMla.termEndDate).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Verification Documents
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DocumentViewer 
                    document={selectedMla.documents?.identityProof} 
                    title="Identity Proof"
                  />
                  <DocumentViewer 
                    document={selectedMla.documents?.electionCertificate} 
                    title="Election Certificate"
                  />
                </div>
                
                {/* Additional Documents */}
                {selectedMla.documents?.additionalDocuments && selectedMla.documents.additionalDocuments.length > 0 && (
                  <div className="mt-6">
                    <h5 className="font-medium text-gray-900 mb-3">Additional Documents</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedMla.documents.additionalDocuments.map((doc, index) => (
                        <DocumentViewer 
                          key={index}
                          document={doc.url} 
                          title={doc.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Account Status */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Account Status
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm font-medium text-gray-500">Verification Status</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedMla.verificationStatus)}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm font-medium text-gray-500">Profile Completed</label>
                    <p className="text-gray-900 mt-1">
                      {selectedMla.profileCompleted ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm font-medium text-gray-500">Account Active</label>
                    <p className="text-gray-900 mt-1">
                      {selectedMla.isActive ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification History */}
              {selectedMla.verificationNotes && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Verification Notes</h4>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-yellow-800">{selectedMla.verificationNotes}</p>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Timeline
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm font-medium text-gray-500">Account Created</label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedMla.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {selectedMla.verifiedAt && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="text-sm font-medium text-gray-500">Verified At</label>
                      <p className="text-gray-900 mt-1">
                        {new Date(selectedMla.verifiedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {selectedMla.lastLoginAt && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="text-sm font-medium text-gray-500">Last Login</label>
                      <p className="text-gray-900 mt-1">
                        {new Date(selectedMla.lastLoginAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm font-medium text-gray-500">Login Count</label>
                    <p className="text-gray-900 mt-1">
                      {selectedMla.loginCount || 0} times
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedMla(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                
                {selectedMla.verificationStatus === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        setVerificationAction('verified');
                        setShowModal(true);
                      }}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Verify MLA</span>
                    </button>
                    <button
                      onClick={() => {
                        setVerificationAction('rejected');
                        setShowModal(true);
                      }}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject MLA</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {verificationAction === 'verified' ? 'Verify MLA' : 'Reject MLA'}
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Are you sure you want to {verificationAction === 'verified' ? 'verify' : 'reject'} <strong>{selectedMla?.fullName}</strong>?
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                placeholder="Add verification remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedMla(null);
                  setRemarks('');
                  setVerificationAction(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerifyMLA(selectedMla._id, verificationAction, remarks)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                  verificationAction === 'verified' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {verificationAction === 'verified' ? 'Verify' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MlaManagement;
