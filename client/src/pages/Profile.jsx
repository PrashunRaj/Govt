// pages/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { User, MapPin, Edit, Save, X, AlertCircle, Calendar, Shield } from 'lucide-react';
import axios from 'axios';
import {toast} from 'react-toastify';

const Profile = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    constituency: '',
    district: '',
    state: '',
    pincode: ''
  });
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const constituencies = [
    'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi',
    'Central Delhi', 'New Delhi', 'Chandni Chowk', 'Karol Bagh',
    'Patel Nagar', 'Moti Nagar', 'Madipur', 'Rajouri Garden','Kanke'
  ];

  const states = [
    'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat',
    'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'West Bengal','Jharkhand', 'Punjab', 'Haryana', 'Bihar', 'Odisha', 'Kerala', 'Telangana', 'Andhra Pradesh', 'Assam', 'Uttarakhand', 'Himachal Pradesh', 'Chhattisgarh'
  ];

  useEffect(() => {
    if (isLoaded && user) {
      checkUserProfile();
    }
  }, [user, isLoaded]);

  const checkUserProfile = async () => {
    try {
      setLoading(true);
      
      const cached = localStorage.getItem('userProfile');
      if (cached) {
        const profile = JSON.parse(cached);
        if (profile.clerkId === user.id) {
          setUserProfile(profile);
          setFormData({
            fullName: profile.fullName || '',
            constituency: profile.constituency || '',
            district: profile.district || '',
            state: profile.state || '',
            pincode: profile.pincode || ''
          });
          setLoading(false);
          return;
        }
      }

      const token = await getToken();
      const response = await axios.get(backendUrl+`/api/user/profile/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success){
        const profile = response.data.data;
        setUserProfile(profile);
        console.log(userProfile.isActive)
        localStorage.setItem('userProfile', JSON.stringify(profile));
        setFormData({
          fullName: profile.fullName || '',
          constituency: profile.constituency || '',
          district: profile.district || '',
          state: profile.state || '',
          pincode: profile.pincode || ''
        });
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setUserProfile(null);
      setFormData({
        fullName: user?.fullName || '',
        constituency: '',
        district: '',
        state: '',
        pincode: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
  try {
    setSaveLoading(true);
    
    if (!formData.fullName || !formData.constituency || !formData.district || !formData.state) {
      toast.error('Please fill in all required fields.');
      setSaveLoading(false);
      return;
    }

    const profileData = {
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      fullName: formData.fullName,
      constituency: formData.constituency,
      district: formData.district,
      state: formData.state,
      pincode: formData.pincode
    };

    // Always use POST - backend will handle create vs update logic
    const response = await axios.post(backendUrl+'/api/user/register', profileData);

    if (response.data.success) {
      const updatedProfile = response.data.data;
      setUserProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setEditMode(false);
      
      toast.success('Profile saved successfully!');
      window.location.reload();
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    if (error.response && error.response.data) {
      toast.error(error.response.data.message || 'Failed to save profile. Please try again.');
    }
    else {
      toast.error('An unexpected error occurred while saving your profile.');
    }
    
  } finally {
    setSaveLoading(false);
  }
};


  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please sign in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  const isProfileIncomplete = !userProfile || !userProfile.onboardingCompleted;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Profile
          </h1>
          <p className="text-gray-600">
            {isProfileIncomplete 
              ? 'Complete your profile to access all features.'
              : 'Manage your account information and preferences.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!editMode && userProfile?.onboardingCompleted && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-indigo-600 hover:text-indigo-700 flex items-center space-x-2"
                  >
                    <Edit size={20} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {/* Profile Incomplete Warning */}
              {isProfileIncomplete && !editMode && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="text-yellow-600 mr-3" size={20} />
                    <div>
                      <p className="text-yellow-800 text-sm font-medium mb-2">
                        Profile Incomplete
                      </p>
                      <p className="text-yellow-700 text-sm mb-3">
                        Complete your profile to access all features.
                      </p>
                      <button
                        onClick={() => setEditMode(true)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 transition-colors"
                      >
                        Complete Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Mode */}
              {editMode ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <select
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select state</option>
                        {states.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        District *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.district}
                        onChange={(e) => setFormData({...formData, district: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter district"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Constituency *
                      </label>
                      <select
                        required
                        value={formData.constituency}
                        onChange={(e) => setFormData({...formData, constituency: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select constituency</option>
                        {constituencies.map(constituency => (
                          <option key={constituency} value={constituency}>{constituency}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="110001"
                        pattern="[0-9]{6}"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saveLoading}
                      className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                    >
                      {saveLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save size={16} className="mr-2" />
                      )}
                      Save Profile
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Display Mode */
                <div className="space-y-6">
                  {userProfile ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <User className="text-gray-400" size={20} />
                            <div>
                              <p className="text-sm text-gray-500">Full Name</p>
                              <p className="font-medium">{userProfile.fullName}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 flex items-center justify-center">
                              <span className="text-gray-400">@</span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">{userProfile.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <MapPin className="text-gray-400" size={20} />
                            <div>
                              <p className="text-sm text-gray-500">Location</p>
                              <p className="font-medium">
                                {userProfile.constituency}
                              </p>
                              <p className="text-sm text-gray-500">
                                {userProfile.district}, {userProfile.state}
                              </p>
                              {userProfile.pincode && (
                                <p className="text-sm text-gray-500">PIN: {userProfile.pincode}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">No profile information available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Account Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h3>
              
              <div className="space-y-4">
                {userProfile && (
                  <>
                    <div className="flex items-center space-x-3">
                      <Shield className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          userProfile.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {userProfile.role === 'admin' ? '👑 Admin' : '👤 Citizen'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium">
                          {new Date(userProfile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          userProfile.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm text-gray-600">
                          Account {userProfile.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
