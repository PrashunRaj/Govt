// import React, { useState, useEffect } from 'react';
// import { useSignUp, useSignIn, useUser } from '@clerk/clerk-react';
// import { useNavigate } from 'react-router-dom';

// const MLALogin = () => {
//   const [isSignUp, setIsSignUp] = useState(true);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [constituency, setConstituency] = useState('');
//   const [verificationCode, setVerificationCode] = useState('');
//   const [pendingVerification, setPendingVerification] = useState(false);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const { signUp } = useSignUp();
//   const { signIn } = useSignIn();
//   const { isSignedIn, user } = useUser();
//   const navigate = useNavigate();

//   // Redirect if already signed in as MLA
//   useEffect(() => {
//     console.log('isSignedIn:', isSignedIn);
//     console.log('user role:', user?.publicMetadata?.role);
  
//     if (isSignedIn && user?.publicMetadata?.role === 'mla') {
//       navigate('/home');
//     }
//   }, [isSignedIn, user, navigate]);

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     if (!signUp) return;

//     setIsLoading(true);
//     setError('');

//     try {
//       await signUp.create({
//         emailAddress: email,
//         password,
//         publicMetadata: {
//           role: 'mla',
//           constituency,
//         },
//       });

//       await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
//       setPendingVerification(true);
//     } catch (err) {
//       console.error(err);
//       const msg = err.errors?.[0]?.message || 'Something went wrong';
//       setError(msg);
//     }

//     setIsLoading(false);
//   };

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     if (!signUp) return;

//     setIsLoading(true);
//     setError('');

//     try {
//       const completeSignUp = await signUp.attemptEmailAddressVerification({
//         code: verificationCode,
//       });

//       if (completeSignUp.status === 'complete') {
//         navigate('/home');
//       } else {
//         setError('Verification failed. Please try again.');
//       }
//     } catch (err) {
//       console.error(err);
//       const msg = err.errors?.[0]?.message || 'Invalid code';
//       setError(msg);
//     }

//     setIsLoading(false);
//   };

//   const handleSignIn = async (e) => {
//     e.preventDefault();
//     if (!signIn) return;

//     setIsLoading(true);
//     setError('');

//     try {
//       const result = await signIn.create({
//         identifier: email,
//         password,
//       });

//       if (result.status === 'complete') {
//         const user = result?.user;
//         const metadata = user?.publicMetadata;

//         if (metadata?.role === 'mla') {
//           navigate('/home');
//         } else {
//           setError('You are not authorized as an MLA');
//         }
//       } else {
//         setError('Check your email for verification');
//       }
//     } catch (err) {
//       console.error(err);
//       const msg = err.errors?.[0]?.message || 'Login failed';
//       setError(msg);
//     }

//     setIsLoading(false);
//   };

//   // Don't render if already signed in (prevents flash)
//   if (isSignedIn && user?.publicMetadata?.role === 'mla') {
//     return null;
//   }

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-xl bg-white">
//       <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">
//         {isSignUp ? 'MLA Sign Up' : 'MLA Login'}
//       </h2>

//       {error && <div className="text-red-600 mb-4">{error}</div>}

//       {!pendingVerification ? (
//         <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full border px-3 py-2 rounded"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full border px-3 py-2 rounded"
//           />
//           {isSignUp && (
//             <input
//               type="text"
//               placeholder="Constituency"
//               required
//               value={constituency}
//               onChange={(e) => setConstituency(e.target.value)}
//               className="w-full border px-3 py-2 rounded"
//             />
//           )}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
//           >
//             {isLoading ? 'Processing...' : isSignUp ? 'Register' : 'Login'}
//           </button>
//         </form>
//       ) : (
//         <form onSubmit={handleVerify} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Verification Code"
//             required
//             value={verificationCode}
//             onChange={(e) => setVerificationCode(e.target.value)}
//             className="w-full border px-3 py-2 rounded"
//           />
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//           >
//             {isLoading ? 'Verifying...' : 'Verify Email'}
//           </button>
//         </form>
//       )}

//       <p className="mt-4 text-center text-sm">
//         {isSignUp ? (
//           <>
//             Already an MLA?{' '}
//             <button
//               onClick={() => setIsSignUp(false)}
//               className="text-indigo-600 underline"
//             >
//               Login
//             </button>
//           </>
//         ) : (
//           <>
//             New MLA?{' '}
//             <button
//               onClick={() => setIsSignUp(true)}
//               className="text-indigo-600 underline"
//             >
//               Register
//             </button>
//           </>
//         )}
//       </p>
//     </div>
//   );
// };

// export default MLALogin;
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useUser, useAuth, SignIn, SignUp } from '@clerk/clerk-react';
// import { Shield, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
// import axios from 'axios';

// const MLALogin = () => {
//   const navigate = useNavigate();
//   const { user, isLoaded } = useUser();
//   const { getToken } = useAuth();
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [mlaProfile, setMlaProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [verificationStatus, setVerificationStatus] = useState(null);
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   useEffect(() => {
//     if (isLoaded) {
//       if (user) {
//         checkMLAProfile();
//       } else {
//         setLoading(false);
//       }
//     }
//   }, [user, isLoaded]);

//   const checkMLAProfile = async () => {
//     try {
//       setLoading(true);
      
//       // Check if MLA profile exists and verification status
//       const token = await getToken();
//       const response = await axios.get(`${backendUrl}/api/mla/profile/${user.id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         const profile = response.data.data;
//         setMlaProfile(profile);
//         setVerificationStatus(profile.verificationStatus);

//         // Check if MLA can access the system
//         if (profile.canAccess) {
//           // MLA is verified and can access - redirect to dashboard
//           navigate('/mla/dashboard');
//         } else if (!profile.profileCompleted) {
//           // Profile not completed - redirect to profile completion
//           navigate('/mla/complete-profile');
//         } else {
//           // Profile completed but not verified - show verification status
//           setLoading(false);
//         }
//       } else {
//         // MLA profile doesn't exist - redirect to registration
//         navigate('/mla/register');
//       }
//     } catch (error) {
//       console.error('Error checking MLA profile:', error);
//       if (error.response?.status === 404) {
//         // MLA not found - redirect to registration
//         navigate('/mla/register');
//       } else {
//         setLoading(false);
//       }
//     }
//   };

//   const getVerificationStatusInfo = () => {
//     switch (verificationStatus) {
//       case 'pending':
//         return {
//           icon: Clock,
//           color: 'text-yellow-600 bg-yellow-100',
//           title: 'Verification Pending',
//           message: 'Your account is under review by our admin team. You will be notified once verified.',
//           action: 'Please wait for admin approval'
//         };
//       case 'rejected':
//         return {
//           icon: XCircle,
//           color: 'text-red-600 bg-red-100',
//           title: 'Verification Rejected',
//           message: mlaProfile?.verificationNotes || 'Your verification was rejected. Please contact support.',
//           action: 'Contact support for assistance'
//         };
//       case 'verified':
//         return {
//           icon: CheckCircle,
//           color: 'text-green-600 bg-green-100',
//           title: 'Account Verified',
//           message: 'Your account has been verified successfully.',
//           action: 'Redirecting to dashboard...'
//         };
//       default:
//         return {
//           icon: Clock,
//           color: 'text-gray-600 bg-gray-100',
//           title: 'Status Unknown',
//           message: 'Please contact support.',
//           action: 'Contact support'
//         };
//     }
//   };

//   if (!isLoaded || loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // If user is signed in but verification is pending/rejected
//   if (user && verificationStatus && verificationStatus !== 'verified') {
//     const statusInfo = getVerificationStatusInfo();
//     const StatusIcon = statusInfo.icon;

//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//         <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
//           <div className={`w-16 h-16 rounded-full ${statusInfo.color} flex items-center justify-center mx-auto mb-6`}>
//             <StatusIcon size={32} />
//           </div>
          
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">{statusInfo.title}</h2>
//           <p className="text-gray-600 mb-6">{statusInfo.message}</p>
          
//           <div className="bg-gray-50 rounded-lg p-4 mb-6">
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-gray-600">Account Status:</span>
//               <span className={`font-medium ${
//                 verificationStatus === 'pending' ? 'text-yellow-600' :
//                 verificationStatus === 'rejected' ? 'text-red-600' :
//                 'text-gray-600'
//               }`}>
//                 {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
//               </span>
//             </div>
//             <div className="flex items-center justify-between text-sm mt-2">
//               <span className="text-gray-600">Email:</span>
//               <span className="font-medium text-gray-900">{user.emailAddresses[0]?.emailAddress}</span>
//             </div>
//             {mlaProfile?.constituency && (
//               <div className="flex items-center justify-between text-sm mt-2">
//                 <span className="text-gray-600">Constituency:</span>
//                 <span className="font-medium text-gray-900">{mlaProfile.constituency}</span>
//               </div>
//             )}
//           </div>

//           <p className="text-sm text-gray-500 mb-4">{statusInfo.action}</p>
          
//           <button
//             onClick={() => {
//               // Sign out and allow re-authentication
//               window.location.href = '/mla/login';
//             }}
//             className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
//           >
//             Sign Out
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // If no user is signed in, show sign in/up forms
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <div className="flex items-center justify-center min-h-screen p-4">
//         <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          
//           {/* Left Side - Information */}
//           <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center">
//             <div className="text-center lg:text-left">
//               <div className="flex items-center justify-center lg:justify-start mb-6">
//                 <div className="bg-indigo-600 p-3 rounded-full">
//                   <Shield className="w-8 h-8 text-white" />
//                 </div>
//                 <h1 className="text-2xl font-bold text-gray-900 ml-3">MLA Portal</h1>
//               </div>
              
//               <h2 className="text-3xl font-bold text-gray-900 mb-4">
//                 Welcome to the MLA Management System
//               </h2>
              
//               <p className="text-gray-600 mb-6">
//                 Access your constituency management dashboard, review citizen proposals, 
//                 and track community development projects.
//               </p>
              
//               <div className="space-y-4">
//                 <div className="flex items-center">
//                   <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
//                   <span className="text-gray-700">Manage constituency proposals</span>
//                 </div>
//                 <div className="flex items-center">
//                   <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
//                   <span className="text-gray-700">Track project progress</span>
//                 </div>
//                 <div className="flex items-center">
//                   <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
//                   <span className="text-gray-700">Analytics and reporting</span>
//                 </div>
//                 <div className="flex items-center">
//                   <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
//                   <span className="text-gray-700">Citizen engagement tools</span>
//                 </div>
//               </div>
              
//               <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <div className="flex items-center">
//                   <Shield className="w-5 h-5 text-yellow-600 mr-2" />
//                   <p className="text-sm text-yellow-800">
//                     <strong>Note:</strong> All MLA accounts require admin verification before access is granted.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Right Side - Authentication */}
//           <div className="bg-white rounded-xl shadow-lg p-8">
//             <div className="mb-6">
//               <div className="flex items-center justify-center space-x-4 mb-6">
//                 <button
//                   onClick={() => setIsSignUp(false)}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                     !isSignUp 
//                       ? 'bg-indigo-600 text-white' 
//                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                   }`}
//                 >
//                   Sign In
//                 </button>
//                 <button
//                   onClick={() => setIsSignUp(true)}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                     isSignUp 
//                       ? 'bg-indigo-600 text-white' 
//                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                   }`}
//                 >
//                   Sign Up
//                 </button>
//               </div>
//             </div>
            
//             <div className="flex items-center justify-center">
//               {isSignUp ? (
//                 <SignUp 
//                   routing="hash"
//                   afterSignUpUrl="/mla/register"
//                   appearance={{
//                     elements: {
//                       rootBox: "w-full",
//                       card: "shadow-none border-0 w-full"
//                     }
//                   }}
//                 />
//               ) : (
//                 <SignIn 
//                   routing="hash"
//                   afterSignInUrl="/mla/dashboard"
//                   appearance={{
//                     elements: {
//                       rootBox: "w-full",
//                       card: "shadow-none border-0 w-full"
//                     }
//                   }}
//                 />
//               )}
//             </div>
            
//             {isSignUp && (
//               <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                 <h4 className="font-medium text-blue-900 mb-2">After Registration:</h4>
//                 <ol className="text-sm text-blue-800 space-y-1">
//                   <li>1. Complete your MLA profile with required documents</li>
//                   <li>2. Wait for admin verification (24-48 hours)</li>
//                   <li>3. Access your constituency management dashboard</li>
//                 </ol>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MLALogin;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, SignIn, SignUp } from '@clerk/clerk-react';
import { Shield, CheckCircle } from 'lucide-react';

const MLALogin = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      // Simply redirect to dashboard after sign in/up
      navigate('/mla/dashboard');
    }
  }, [user, isLoaded, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already signed in, redirect immediately
  if (user) {
    navigate('/mla/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Side - Information */}
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="bg-indigo-600 p-3 rounded-full">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 ml-3">MLA Portal</h1>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to the MLA Management System
              </h2>
              
              <p className="text-gray-600 mb-6">
                Access your constituency management dashboard, review citizen proposals, 
                and track community development projects.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Manage constituency proposals</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Track project progress</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Analytics and reporting</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Citizen engagement tools</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Authentication */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <button
                  onClick={() => setIsSignUp(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !isSignUp 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsSignUp(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isSignUp 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              {isSignUp ? (
                <SignUp 
                  routing="hash"
                  afterSignUpUrl="/mla/dashboard"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none border-0 w-full"
                    }
                  }}
                />
              ) : (
                <SignIn 
                  routing="hash"
                  afterSignInUrl="/mla/dashboard"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none border-0 w-full"
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLALogin;
