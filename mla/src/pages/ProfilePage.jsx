import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { 
  User, 
  Upload, 
  Save, 
  Edit, 
  X, 
  CheckCircle, 
  Clock, 
  XCircle,
  FileText,
  Shield,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building
} from 'lucide-react';
import axios from 'axios';

const ProfilePage = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [mlaProfile, setMlaProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    constituency: '',
    district: '',
    state: '',
    politicalParty: '',
    termStartDate: '',
    termEndDate: ''
  });
  const [documents, setDocuments] = useState({
    identityProof: null,
    electionCertificate: null,
    additionalDocuments: []
  });
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // States dropdown list - All Indian states
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
    'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal', 'Jammu and Kashmir', 'Ladakh'
  ];

  // Political parties list
  const politicalParties = [
    'Bharatiya Janata Party (BJP)',
    'Indian National Congress (INC)',
    'Aam Aadmi Party (AAP)',
    'Trinamool Congress (TMC)',
    'Samajwadi Party (SP)',
    'Bahujan Samaj Party (BSP)',
    'Dravida Munnetra Kazhagam (DMK)',
    'All India Anna Dravida Munnetra Kazhagam (AIADMK)',
    'Shiv Sena',
    'Nationalist Congress Party (NCP)',
    'Communist Party of India (Marxist)',
    'Janata Dal (United)',
    'Biju Janata Dal (BJD)',
    'Yuvajana Sramika Rythu Congress Party (YSRCP)',
    'Telangana Rashtra Samithi (TRS)',
    'Independent',
    'Other'
  ];

  useEffect(() => {
    if (user) {
      fetchMLAProfile();
    }
  }, [user]);

  const fetchMLAProfile = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get(`${backendUrl}/api/mla/profile/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const profile = response.data.data;
        setMlaProfile(profile);
        setFormData({
          fullName: profile.fullName || '',
          phoneNumber: profile.phoneNumber || '',
          constituency: profile.constituency || '',
          district: profile.district || '',
          state: profile.state || '',
          politicalParty: profile.politicalParty || '',
          termStartDate: profile.termStartDate ? profile.termStartDate.split('T')[0] : '',
          termEndDate: profile.termEndDate ? profile.termEndDate.split('T')[0] : ''
        });
        setDocuments({
          identityProof: profile.documents?.identityProof || null,
          electionCertificate: profile.documents?.electionCertificate || null,
          additionalDocuments: profile.documents?.additionalDocuments || []
        });
      }
    } catch (error) {
      console.error('Error fetching MLA profile:', error);
      if (error.response?.status === 404) {
        // Profile doesn't exist, enable edit mode for creation
        setEditMode(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaveLoading(true);
      
      // Validate required fields
      if (!formData.fullName || !formData.phoneNumber || !formData.constituency || 
          !formData.district || !formData.state || !formData.politicalParty ||
          !formData.termStartDate || !formData.termEndDate) {
        alert('Please fill all required fields');
        return;
      }

      // Validate documents
      if (!documents.identityProof || !documents.electionCertificate) {
        alert('Please upload both Identity Proof and Election Certificate');
        return;
      }

      const profileData = {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        fullName: formData.fullName,
        firstName: user.firstName || formData.fullName.split(' ')[0],
        lastName: user.lastName || formData.fullName.split(' ').slice(1).join(' '),
        phoneNumber: formData.phoneNumber,
        constituency: formData.constituency,
        district: formData.district,
        state: formData.state,
        politicalParty: formData.politicalParty,
        termStartDate: formData.termStartDate,
        termEndDate: formData.termEndDate,
        documents: documents
      };

      const token = await getToken();
      let response;
      
      if (mlaProfile) {
        // Update existing profile
        response = await axios.post(`${backendUrl}/api/mla/profile/update/${user.id}`, profileData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create new profile
        response = await axios.post(`${backendUrl}/api/mla/register`, profileData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (response.data.success) {
        setMlaProfile(response.data.data);
        setEditMode(false);
        alert('Profile saved successfully! Your account is now pending admin verification.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(error.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDocumentUpload = async (docType, file) => {
    try {
      setUploadingDoc(docType);
      
      const formData = new FormData();
      formData.append('document', file);
      formData.append('docType', docType);
      
      const token = await getToken();
      const response = await axios.post(`${backendUrl}/api/mla/upload-document`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setDocuments(prev => ({
          ...prev,
          [docType]: response.data.data.url
        }));
        alert('Document uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploadingDoc(null);
    }
  };

  const getVerificationStatusInfo = () => {
    if (!mlaProfile) return null;
    
    switch (mlaProfile.verificationStatus) {
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          title: 'Verification Pending',
          message: 'Your profile is under admin review. This typically takes 24-48 hours.'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-800 border-red-200',
          title: 'Verification Rejected',
          message: mlaProfile.verificationNotes || 'Please update your profile and documents as requested.'
        };
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800 border-green-200',
          title: 'Account Verified',
          message: 'Your account has been verified. You now have full access to all features.'
        };
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const statusInfo = getVerificationStatusInfo();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MLA Profile</h1>
          <p className="text-gray-600">
            Complete your profile and upload required documents for admin verification
          </p>
        </div>

        {/* Verification Status */}
        {statusInfo && (
          <div className={`mb-8 p-6 rounded-lg border ${statusInfo.color}`}>
            <div className="flex items-center">
              <statusInfo.icon size={24} className="mr-3" />
              <div>
                <h3 className="font-semibold text-lg">{statusInfo.title}</h3>
                <p className="mt-1">{statusInfo.message}</p>
                {mlaProfile?.verifiedAt && (
                  <p className="text-sm mt-2">
                    Reviewed on: {new Date(mlaProfile.verifiedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!editMode && mlaProfile && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-indigo-600 hover:text-indigo-700 flex items-center space-x-2"
                    disabled={mlaProfile.verificationStatus === 'verified'}
                  >
                    <Edit size={20} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {editMode ? (
                <div className="space-y-6">
                  {/* Basic Information */}
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
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="+91 9876543210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email (Read-only)
                      </label>
                      <input
                        type="email"
                        value={user?.emailAddresses[0]?.emailAddress || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Political Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <input
                        type="text"
                        required
                        value={formData.constituency}
                        onChange={(e) => setFormData({...formData, constituency: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter your constituency name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Political Party *
                      </label>
                      <select
                        required
                        value={formData.politicalParty}
                        onChange={(e) => setFormData({...formData, politicalParty: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select party</option>
                        {politicalParties.map(party => (
                          <option key={party} value={party}>{party}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Term Start Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.termStartDate}
                        onChange={(e) => setFormData({...formData, termStartDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Term End Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.termEndDate}
                        onChange={(e) => setFormData({...formData, termEndDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
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
                    {mlaProfile && (
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Display Mode */
                <div className="space-y-6">
                  {mlaProfile ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <User className="text-gray-400" size={20} />
                            <div>
                              <p className="text-sm text-gray-500">Full Name</p>
                              <p className="font-medium">{mlaProfile.fullName}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Phone className="text-gray-400" size={20} />
                            <div>
                              <p className="text-sm text-gray-500">Phone Number</p>
                              <p className="font-medium">{mlaProfile.phoneNumber}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Mail className="text-gray-400" size={20} />
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">{mlaProfile.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <MapPin className="text-gray-400" size={20} />
                            <div>
                              <p className="text-sm text-gray-500">Constituency</p>
                              <p className="font-medium">{mlaProfile.constituency}</p>
                              <p className="text-sm text-gray-500">
                                {mlaProfile.district}, {mlaProfile.state}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Building className="text-gray-400" size={20} />
                            <div>
                              <p className="text-sm text-gray-500">Political Party</p>
                              <p className="font-medium">{mlaProfile.politicalParty}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Calendar className="text-gray-400" size={20} />
                            <div>
                              <p className="text-sm text-gray-500">Term Period</p>
                              <p className="font-medium">
                                {new Date(mlaProfile.termStartDate).toLocaleDateString()} - {new Date(mlaProfile.termEndDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">No profile information available</p>
                      <button
                        onClick={() => setEditMode(true)}
                        className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                      >
                        Create Profile
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Documents Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
              
              <div className="space-y-6">
                {/* Identity Proof */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Identity Proof * (Aadhar/PAN/Passport)
                  </label>
                  {documents.identityProof ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="text-green-600 mr-2" size={16} />
                        <span className="text-sm text-green-800">Uploaded</span>
                      </div>
                      <a 
                        href={documents.identityProof} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        View
                      </a>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleDocumentUpload('identityProof', e.target.files[0])}
                        className="hidden"
                        id="identityProof"
                        disabled={uploadingDoc === 'identityProof'}
                      />
                      <label
                        htmlFor="identityProof"
                        className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50"
                      >
                        {uploadingDoc === 'identityProof' ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                        ) : (
                          <>
                            <Upload className="mr-2" size={16} />
                            <span className="text-sm">Upload Identity Proof</span>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>

                {/* Election Certificate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Election Certificate *
                  </label>
                  {documents.electionCertificate ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="text-green-600 mr-2" size={16} />
                        <span className="text-sm text-green-800">Uploaded</span>
                      </div>
                      <a 
                        href={documents.electionCertificate} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        View
                      </a>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleDocumentUpload('electionCertificate', e.target.files[0])}
                        className="hidden"
                        id="electionCertificate"
                        disabled={uploadingDoc === 'electionCertificate'}
                      />
                      <label
                        htmlFor="electionCertificate"
                        className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50"
                      >
                        {uploadingDoc === 'electionCertificate' ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                        ) : (
                          <>
                            <Upload className="mr-2" size={16} />
                            <span className="text-sm">Upload Election Certificate</span>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>

                {/* Profile Completion Status */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Completion</span>
                    <span className={`text-sm font-medium ${
                      mlaProfile?.profileCompleted ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {mlaProfile?.profileCompleted ? 'Complete' : 'Incomplete'}
                    </span>
                  </div>
                  
                  {mlaProfile?.profileCompleted && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center">
                        <Shield className="text-blue-600 mr-2" size={16} />
                        <span className="text-sm text-blue-800">
                          Profile submitted for admin verification
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
