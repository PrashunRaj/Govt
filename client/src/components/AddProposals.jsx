// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const AddProposal = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     author: ''
//   });
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
      
//       // Create preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError('');

//     try {
//       const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
//       // Create FormData for file upload
//       const submitData = new FormData();
//       submitData.append('title', formData.title);
//       submitData.append('description', formData.description);
//       submitData.append('author', formData.author);
      
//       if (selectedFile) {
//         submitData.append('image', selectedFile);
//       }

//       const response = await axios.post(`${backendUrl}/api/user/add-proposals`, submitData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
      
//       if (!response.data.success) {
//         toast.error(response.data.message);
//       } else {
//         toast.success(response.data.message);
//       }
      
//       setSuccess(true);
//       setFormData({
//         title: '',
//         description: '',
//         author: ''
//       });
//       setSelectedFile(null);
//       setImagePreview('');
      
//       // Redirect to the proposals list after 2 seconds
//       setTimeout(() => {
//         navigate('/add-proposals');
//       }, 2000);
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || 'Failed to submit proposal. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="bg-indigo-600 p-6">
//           <h2 className="text-2xl font-bold text-white">Submit a New Proposal</h2>
//           <p className="mt-2 text-indigo-100">
//             Share your ideas with the community and make a difference
//           </p>
//         </div>
        
//         <div className="p-6">
//           {success ? (
//             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
//               <strong className="font-bold">Success!</strong>
//               <span className="block sm:inline"> Your proposal has been submitted for review.</span>
//             </div>
//           ) : null}
          
//           {error ? (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
//               <strong className="font-bold">Error!</strong>
//               <span className="block sm:inline"> {error}</span>
//             </div>
//           ) : null}
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//                 Title <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="A concise title for your proposal"
//               />
//             </div>
            
//             <div>
//               <label htmlFor="author" className="block text-sm font-medium text-gray-700">
//                 Your Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="author"
//                 name="author"
//                 value={formData.author}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Your full name"
//               />
//             </div>
            
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                 Description <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 rows="6"
//                 value={formData.description}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Provide a detailed description of your proposal..."
//               ></textarea>
//             </div>
            
//             <div>
//               <label htmlFor="image" className="block text-sm font-medium text-gray-700">
//                 Image <span className="text-red-500">*</span>
//               </label>
//               <div className="mt-1 flex items-center">
//                 <input
//                   type="file"
//                   id="image"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                 />
//                 <label
//                   htmlFor="image"
//                   className="cursor-pointer py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                   Choose File
//                 </label>
//                 <span className="ml-3 text-sm text-gray-500">
//                   {selectedFile ? selectedFile.name : 'No file chosen'}
//                 </span>
//               </div>
              
//               {imagePreview && (
//                 <div className="mt-3">
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="h-40 w-auto object-cover rounded-md"
//                   />
//                 </div>
//               )}
//             </div>
            
//             <div className="flex items-center justify-end">
//               <button
//                 type="button"
//                 onClick={() => navigate(-1)}
//                 className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Submitting...
//                   </>
//                 ) : 'Submit Proposal'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProposal;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser, useAuth } from '@clerk/clerk-react';

const AddProposal = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    budget: '',
    beneficiaries: '',
    location: '',
    estimatedDuration: '',
    coordinates: {
      latitude: '',
      longitude: ''
    }
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = [
    'Infrastructure',
    'Healthcare', 
    'Education',
    'Environment',
    'Transportation',
    'Public Safety',
    'Other'
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const durations = [
    '1 month',
    '3 months',
    '6 months',
    '1 year',
    '2 years',
    '3+ years'
  ];

  // Get user profile for constituency info
  useEffect(() => {
    if (user) {
      getUserProfile();
    }
  }, [user]);

  const getUserProfile = async () => {
    try {
      const cached = localStorage.getItem('userProfile');
      if (cached) {
        const profile = JSON.parse(cached);
        if (profile.clerkId === user.id && profile.onboardingCompleted) {
          setUserProfile(profile);
          return;
        }
      }

      const token = await getToken();
      const response = await axios.get(`/api/users/profile/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUserProfile(response.data.data);
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'latitude' || name === 'longitude') {
      setFormData(prevState => ({
        ...prevState,
        coordinates: {
          ...prevState.coordinates,
          [name]: value
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Check if user profile is complete
    if (!userProfile || !userProfile.onboardingCompleted) {
      toast.error('Please complete your profile first');
      navigate('/user-dashboard');
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const token = await getToken();
      
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('priority', formData.priority);
      submitData.append('budget', formData.budget);
      submitData.append('beneficiaries', formData.beneficiaries || '0');
      submitData.append('location', formData.location);
      submitData.append('estimatedDuration', formData.estimatedDuration);
      
      // Add coordinates if provided
      if (formData.coordinates.latitude && formData.coordinates.longitude) {
        submitData.append('latitude', formData.coordinates.latitude);
        submitData.append('longitude', formData.coordinates.longitude);
      }
      
      // Add user location info from profile
      submitData.append('constituency', userProfile.constituency);
      submitData.append('district', userProfile.district);
      submitData.append('state', userProfile.state);
      
      if (selectedFile) {
        submitData.append('image', selectedFile);
      }

      const response = await axios.post(`${backendUrl}/api/user/add-proposals`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.data.success) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
        setSuccess(true);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          priority: 'medium',
          budget: '',
          beneficiaries: '',
          location: '',
          estimatedDuration: '',
          coordinates: {
            latitude: '',
            longitude: ''
          }
        });
        setSelectedFile(null);
        setImagePreview('');
        
        // Redirect after success
        setTimeout(() => {
          navigate('/all-proposals');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userProfile || !userProfile.onboardingCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Required</h2>
          <p className="text-gray-600 mb-6">
            Please complete your profile before submitting proposals.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Complete Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-indigo-600 p-6">
          <h2 className="text-2xl font-bold text-white">Submit a New Proposal</h2>
          <p className="mt-2 text-indigo-100">
            Share your ideas with the community and make a difference in {userProfile.constituency}
          </p>
        </div>
        
        <div className="p-6">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline"> Your proposal has been submitted for review.</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="A concise title for your proposal"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Estimated Budget (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="100000"
                />
              </div>

              <div>
                <label htmlFor="beneficiaries" className="block text-sm font-medium text-gray-700">
                  Expected Beneficiaries
                </label>
                <input
                  type="number"
                  id="beneficiaries"
                  name="beneficiaries"
                  value={formData.beneficiaries}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Number of people who will benefit"
                />
              </div>

              <div>
                <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700">
                  Estimated Duration
                </label>
                <select
                  id="estimatedDuration"
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select duration</option>
                  {durations.map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Location Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Your Area:</strong> {userProfile.constituency}, {userProfile.district}, {userProfile.state}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Specific Location/Address
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Specific address or landmark"
                  />
                </div>

                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                    Latitude (Optional)
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    value={formData.coordinates.latitude}
                    onChange={handleChange}
                    step="any"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="28.6139"
                  />
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                    Longitude (Optional)
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    name="longitude"
                    value={formData.coordinates.longitude}
                    onChange={handleChange}
                    step="any"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="77.2090"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="6"
                value={formData.description}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Provide a detailed description of your proposal, including the problem it solves and expected outcomes..."
              />
            </div>
            
            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Choose File
                </label>
                <span className="ml-3 text-sm text-gray-500">
                  {selectedFile ? selectedFile.name : 'No file chosen'}
                </span>
              </div>
              
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-40 w-auto object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            
            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Proposal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProposal;
