import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {toast} from 'react-toastify';
import axios from 'axios';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Ban, 
  UserX,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  MapPin,
  AlertCircle,
  Activity,
  Shield,
  Clock
} from 'lucide-react';

const UserManagement = () => {
  const { getToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionType, setActionType] = useState(null);
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
    fetchUsers();
  }, [filters, pagination.page]);

  const fetchUsers = async () => {
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

      const response = await axios.get(`${backendUrl}/api/admin/users?${params}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.data.success) {
        setUsers(response.data.data.users);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.pagination.total,
          totalPages: response.data.data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, action) => {
    try {
      const token = await getToken();
      const response = await axios.post(`${backendUrl}/api/admin/users/${userId}/toggle-status`, {
        action
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.data.success) {
        // Update user in the list
        setUsers(prev => prev.map(user => 
          user._id === userId 
            ? { ...user, isActive: action === 'unban' }
            : user
        ));
        
        setShowModal(false);
        setShowDetailsModal(false);
        setSelectedUser(null);
        setActionType(null);
        
        toast.success(`User ${action === 'ban' ? 'banned' : 'unbanned'} successfully`);
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? (
          <>
            <UserCheck className="w-3 h-3 mr-1" />
            Active
          </>
        ) : (
          <>
            <UserX className="w-3 h-3 mr-1" />
            Banned
          </>
        )}
      </span>
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchUsers();
    }
  };

  const openActionModal = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setShowModal(true);
  };

  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const UserCard = ({ user }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{user.fullName}</h3>
          <p className="text-sm text-gray-500">{user.constituency}, {user.state}</p>
        </div>
      </div>
      {getStatusBadge(user.isActive)}
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Mail className="w-4 h-4" />
        <span>{user.email}</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Phone className="w-4 h-4" />
        <span>{user.phoneNumber || 'Not provided'}</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <MapPin className="w-4 h-4" />
        <span>Status: {user.isActive ? 'Active' : 'Banned'}</span>
      </div>
    </div>

    <div className="flex space-x-2">
      <button
        onClick={() => openDetailsModal(user)}
        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
      >
        <Eye className="w-4 h-4" />
        <span>View Details</span>
      </button>
      
      {user.isActive ? (
        <button
          onClick={() => openActionModal(user, 'ban')}
          className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
        >
          <Ban className="w-4 h-4" />
          <span>Ban User</span>
        </button>
      ) : (
        <button
          onClick={() => openActionModal(user, 'unban')}
          className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
        >
          <UserCheck className="w-4 h-4" />
          <span>Unban User</span>
        </button>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Users</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage citizen user accounts and activity</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="h-4 w-4" />
          <span>{pagination.total} Total Users</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
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
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
          
          <button
            onClick={fetchUsers}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>

      {/* User Grid */}
      {users.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
          <p className="text-gray-600">No users match your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
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

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
                  <p className="text-sm text-gray-600">Complete user profile information</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <AlertCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedUser.fullName}</h4>
                    <p className="text-sm text-gray-600">{selectedUser.constituency}, {selectedUser.state}</p>
                  </div>
                </div>
                {getStatusBadge(selectedUser.isActive)}
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900">{selectedUser.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="text-gray-900">{selectedUser.phoneNumber || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Constituency</label>
                      <p className="text-gray-900">{selectedUser.constituency}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">State</label>
                      <p className="text-gray-900">{selectedUser.state}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Age</label>
                      <p className="text-gray-900">{selectedUser.age || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Information */}
              
<div>
  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
    <Shield className="w-5 h-5 mr-2" />
    Account Information
  </h4>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="bg-gray-50 p-4 rounded-lg">
      <label className="text-sm font-medium text-gray-500">Account Status</label>
      <div className="mt-1">
        {getStatusBadge(selectedUser.isActive)}
      </div>
    </div>
    <div className="bg-gray-50 p-4 rounded-lg">
      <label className="text-sm font-medium text-gray-500">Member Since</label>
      <p className="text-gray-900 mt-1">
        {new Date(selectedUser.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>
</div>


              
              
              
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Timeline
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm font-medium text-gray-500">Account Created</label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedUser.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedUser.updatedAt).toLocaleString()}
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
                    setSelectedUser(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                
                {selectedUser.isActive ? (
                  <button
                    onClick={() => {
                      setActionType('ban');
                      setShowModal(true);
                    }}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Ban User</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActionType('unban');
                      setShowModal(true);
                    }}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Unban User</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {actionType === 'ban' ? 'Ban User' : 'Unban User'}
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Are you sure you want to {actionType} <strong>{selectedUser?.fullName}</strong>?
              </p>
              
              {actionType === 'ban' && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    This will prevent the user from accessing the platform and participating in discussions.
                  </p>
                </div>
              )}
              
              {actionType === 'unban' && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    This will restore the user's access to the platform.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedUser(null);
                  setActionType(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleUserStatus(selectedUser._id, actionType)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                  actionType === 'ban' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {actionType === 'ban' ? 'Ban User' : 'Unban User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
