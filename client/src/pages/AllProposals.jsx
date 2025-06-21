
// import React, { useEffect, useState } from 'react';
// import { ThumbsUp, ThumbsDown, MessageSquare, X, Send, Filter, Search } from 'lucide-react';
// import axios from 'axios';
// import { useUser, useAuth } from '@clerk/clerk-react';

// const ProposalsComponent = () => {
//   const [proposals, setProposals] = useState([]);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const [replyText, setReplyText] = useState('');
//   const [replyingTo, setReplyingTo] = useState(null);
//   const { user } = useUser();
//   const { getToken } = useAuth();
//   const [selectedProposal, setSelectedProposal] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userProfile, setUserProfile] = useState(null);
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const [showReplies, setShowReplies] = useState({});
  
//   // New filter states
//   const [filter, setFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState('createdAt');
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [pagination, setPagination] = useState({
//     total: 0,
//     page: 1,
//     limit: 12,
//     totalPages: 0
//   });

//   // Get user profile for constituency filtering
//   useEffect(() => {
//     if (user) {
//       getUserProfile();
//     }
//   }, [user]);

//   const getUserProfile = async () => {
//     try {
//       const cached = localStorage.getItem('userProfile');
//       if (cached) {
//         const profile = JSON.parse(cached);
//         if (profile.clerkId === user.id && profile.onboardingCompleted) {
//           setUserProfile(profile);
//           return;
//         }
//       }

//       const token = await getToken();
//       const response = await axios.get(`${backendUrl}/api/user/profile/${user.id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setUserProfile(response.data.data);
//         localStorage.setItem('userProfile', JSON.stringify(response.data.data));
//       }
//     } catch (error) {
//       console.error('Error getting user profile:', error);
//     }
//   };

//   useEffect(() => {
//     if (userProfile) {
//       fetchProposals();
//     }
//   }, [userProfile, filter, searchTerm, sortBy, sortOrder, pagination.page]);

//   const fetchProposals = async () => {
//     try {
//       setLoading(true);
      
//       const params = new URLSearchParams({
//         page: pagination.page,
//         limit: pagination.limit,
//         sortBy: sortBy,
//         sortOrder: sortOrder
//       });

//       if (filter !== 'all') params.append('status', filter);
//       if (searchTerm) params.append('search', searchTerm);
      
//       // Auto-filter by user's constituency
//       if (userProfile?.constituency) {
//         params.append('constituency', userProfile.constituency);
//       }

//       const response = await axios.get(`${backendUrl}/api/user/all-proposals?${params}`);
//       console.log(response);
//       console.log(response.data);
      
//       if (response.data.success) {
//         setProposals(response.data.data.proposals);
//         setPagination(prev => ({
//           ...prev,
//           total: response.data.data.pagination.total,
//           totalPages: response.data.data.pagination.totalPages
//         }));
//       }
//     } catch (error) {
//       console.error('Error fetching proposals:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleReplies = (commentId) => {
//     setShowReplies((prev) => ({
//       ...prev,
//       [commentId]: !prev[commentId],
//     }));
//   };

//   const handleAddComment = async (proposalId) => {
//     if (!newComment.trim()) return;
//     if (!proposalId) {
//       console.error('No proposal selected!');
//       return;
//     }

//     try {
//       const token = await getToken();
//       const res = await axios.post(`${backendUrl}/api/user/add-comment`, {
//         proposalId,
//         content: newComment, // Changed from 'comment' to 'content'
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setComments((prev) => [...prev, res.data.data]);
//       setNewComment('');
//     } catch (error) {
//       console.error('Error adding comment:', error);
//     }
//   };

//   useEffect(() => {
//     const fetchComments = async (proposalId) => {
//       try {
//         const response = await axios.get(`${backendUrl}/api/user/get-comments/${proposalId}`);
//         if (response.data.success) {
//           setComments(response.data.data.comments);
//         }
//       } catch (error) {
//         console.error('Error fetching comments:', error);
//       }
//     };

//     if (selectedProposal) {
//       fetchComments(selectedProposal.id);
//     }
//   }, [selectedProposal]);

//   const handleVote = async (proposalId, type) => {
//     if (!user) {
//       alert('Please sign in to vote');
//       return;
//     }

//     try {
//       const token = await getToken();
//       const res = await axios.post(`${backendUrl}/api/user/vote`, {
//         proposalId,
//         voteType: type, // "upvote" or "downvote"
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (res.data.success) {
//         // Update proposal in state
//         setProposals(prev => prev.map(proposal => 
//           proposal.id === proposalId 
//             ? { 
//                 ...proposal, 
//                 votes: res.data.data.votes,
//                 upvotes: res.data.data.upvotes,
//                 downvotes: res.data.data.downvotes
//               }
//             : proposal
//         ));

//         // Update selected proposal if it's the same one
//         if (selectedProposal && selectedProposal.id === proposalId) {
//           setSelectedProposal(prev => ({
//             ...prev,
//             votes: res.data.data.votes,
//             upvotes: res.data.data.upvotes,
//             downvotes: res.data.data.downvotes
//           }));
//         }
//       }
//     } catch (error) {
//       console.error("Voting error:", error);
//       alert('Failed to record vote. Please try again.');
//     }
//   };

//   const handleAddReply = async (parentCommentId, proposalId) => {
//     if (!replyText.trim()) return;

//     try {
//       const token = await getToken();
//       await axios.post(`${backendUrl}/api/user/add-reply`, {
//         content: replyText, // Changed from 'comment' to 'content'
//         commentId: parentCommentId,
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       // Fetch latest comments for this proposal
//       const res = await axios.get(`${backendUrl}/api/user/get-comments/${proposalId}`);
//       if (res.data.success) {
//         setComments(res.data.data.comments);
//       }

//       setReplyText('');
//       setReplyingTo(null);
//     } catch (err) {
//       console.error("Failed to add reply:", err);
//     }
//   };

//   const handleToggleCommentLike = async (commentId) => {
//     if (!user) return;

//     try {
//       const token = await getToken();
//       const response = await axios.post(`${backendUrl}/api/user/comment-like`, {
//         commentId,
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setComments((prevComments) =>
//           prevComments.map((comment) =>
//             comment._id === commentId 
//               ? { 
//                   ...comment, 
//                   likes: response.data.data.likes,
//                   isLiked: response.data.data.isLiked 
//                 }
//               : comment
//           )
//         );
//       }
//     } catch (err) {
//       console.error("Failed to toggle like on comment:", err);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setPagination(prev => ({ ...prev, page: 1 }));
//     fetchProposals();
//   };

//   if (!userProfile || !userProfile.onboardingCompleted) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Required</h2>
//           <p className="text-gray-600">Please complete your profile to view proposals from your area.</p>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen overflow-y-auto p-4 md:p-8">
//       <div className="md:ml-0 mt-16 md:mt-0">
//         {/* Header with constituency info */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">
//             Proposals in {userProfile.constituency}
//           </h1>
//           <p className="text-gray-600">
//             {userProfile.district}, {userProfile.state} • {pagination.total} proposals found
//           </p>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex flex-col lg:flex-row gap-4">
//             <form onSubmit={handleSearch} className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search proposals..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//               </div>
//             </form>

//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             >
//               <option value="all">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="approved">Approved</option>
//               <option value="in_progress">In Progress</option>
//               <option value="completed">Completed</option>
//               <option value="rejected">Rejected</option>
//             </select>

//             <select
//               value={`${sortBy}-${sortOrder}`}
//               onChange={(e) => {
//                 const [field, order] = e.target.value.split('-');
//                 setSortBy(field);
//                 setSortOrder(order);
//               }}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             >
//               <option value="createdAt-desc">Newest First</option>
//               <option value="createdAt-asc">Oldest First</option>
//               <option value="votes-desc">Most Votes</option>
//               <option value="budget-desc">Highest Budget</option>
//               <option value="budget-asc">Lowest Budget</option>
//             </select>
//           </div>
//         </div>
        
//         {/* Proposal Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {proposals.map((proposal) => (
//             <ProposalCard 
//               key={proposal.id} 
//               proposal={proposal} 
//               onClick={() => setSelectedProposal(proposal)}
//             />
//           ))}
//         </div>

//         {/* Pagination */}
//         {pagination.totalPages > 1 && (
//           <div className="flex justify-center">
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
//                 disabled={pagination.page === 1}
//                 className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Previous
//               </button>
              
//               {[...Array(pagination.totalPages)].map((_, index) => (
//                 <button
//                   key={index + 1}
//                   onClick={() => setPagination(prev => ({ ...prev, page: index + 1 }))}
//                   className={`px-3 py-2 border rounded-lg ${
//                     pagination.page === index + 1
//                       ? 'bg-indigo-500 text-white border-indigo-500'
//                       : 'border-gray-300 hover:bg-gray-50'
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
              
//               <button
//                 onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
//                 disabled={pagination.page === pagination.totalPages}
//                 className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal - Same as before but with updated field names */}
//       {selectedProposal && (
//         <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
//           <div 
//             className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
//             onClick={() => setSelectedProposal(null)}
//           />
          
//           <div className="relative w-full max-w-4xl max-h-[90vh] m-4 bg-white rounded-lg shadow-xl">
//             <div className="h-full bg-white rounded-lg transform transition-all duration-300 ease-in-out">
//               <button
//                 onClick={() => setSelectedProposal(null)}
//                 className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
//               >
//                 <X size={24} />
//               </button>

//               <div className="max-h-[90vh] overflow-y-auto">
//                 {/* Proposal Image */}
//                 <div className="relative h-64">
//                   <img 
//                     src={selectedProposal.image} 
//                     alt={selectedProposal.title}
//                     className="w-full h-full object-cover rounded-t-lg"
//                   />
//                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
//                     <div className="flex justify-between items-end">
//                       <span className={`
//                         px-3 py-1 rounded-full text-sm font-semibold
//                         ${selectedProposal.status === 'approved' ? 'bg-green-100 text-green-800' : 
//                           selectedProposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
//                           selectedProposal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
//                           selectedProposal.status === 'completed' ? 'bg-purple-100 text-purple-800' :
//                           'bg-yellow-100 text-yellow-800'}
//                       `}>
//                         {selectedProposal.status.replace('_', ' ').toUpperCase()}
//                       </span>
//                       {selectedProposal.category && (
//                         <span className="bg-white/20 text-white px-2 py-1 rounded text-sm">
//                           {selectedProposal.category}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Proposal Content */}
//                 <div className="p-6">
//                   <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProposal.title}</h2>
//                   <p className="text-gray-600 mb-4">{selectedProposal.description}</p>
                  
//                   {/* Proposal Details */}
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
//                     {selectedProposal.budget && (
//                       <div>
//                         <p className="text-sm text-gray-500">Budget</p>
//                         <p className="font-semibold">₹{selectedProposal.budget.toLocaleString()}</p>
//                       </div>
//                     )}
//                     {selectedProposal.beneficiaries && (
//                       <div>
//                         <p className="text-sm text-gray-500">Beneficiaries</p>
//                         <p className="font-semibold">{selectedProposal.beneficiaries.toLocaleString()}</p>
//                       </div>
//                     )}
//                     {selectedProposal.priority && (
//                       <div>
//                         <p className="text-sm text-gray-500">Priority</p>
//                         <p className={`font-semibold capitalize ${
//                           selectedProposal.priority === 'high' ? 'text-red-600' :
//                           selectedProposal.priority === 'medium' ? 'text-yellow-600' :
//                           'text-green-600'
//                         }`}>{selectedProposal.priority}</p>
//                       </div>
//                     )}
//                     {selectedProposal.submittedBy && (
//                       <div>
//                         <p className="text-sm text-gray-500">Submitted by</p>
//                         <p className="font-semibold">{selectedProposal.submittedBy}</p>
//                       </div>
//                     )}
//                   </div>
                 
//                   {/* Interaction Stats */}
//                   <div className="flex items-center space-x-6 mb-6">
//                     <div
//                       className="flex items-center cursor-pointer hover:text-indigo-600"
//                       onClick={() => handleVote(selectedProposal.id, "upvote")}
//                     >
//                       <ThumbsUp size={18} className="text-gray-600" />
//                       <span className="ml-2 text-gray-600">{selectedProposal.upvotes || 0}</span>
//                     </div>

//                     <div
//                       className="flex items-center cursor-pointer hover:text-red-600"
//                       onClick={() => handleVote(selectedProposal.id, "downvote")}
//                     >
//                       <ThumbsDown size={18} className="text-gray-600" />
//                       <span className="ml-2 text-gray-600">{selectedProposal.downvotes || 0}</span>
//                     </div>

//                     <div className="flex items-center">
//                       <MessageSquare size={18} className="text-gray-600" />
//                       <span className="ml-2 text-gray-600">{comments.length} comments</span>
//                     </div>
//                   </div>

//                   {/* Comments Section - Same as before but with updated field names */}
//                   <div className="border-t pt-6">
//                     <h3 className="text-lg font-semibold mb-4">Comments</h3>

//                     {/* Comment Input */}
//                     <div className="flex items-center space-x-4 mb-6">
//                       <input
//                         type="text"
//                         placeholder="Add a comment..."
//                         value={newComment}
//                         onChange={(e) => setNewComment(e.target.value)}
//                         className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => handleAddComment(selectedProposal.id)}
//                         disabled={!newComment.trim()}
//                         className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
//                       >
//                         <Send size={20} />
//                       </button>
//                     </div>

//                     {/* Comments List */}
//                     <div className="space-y-4">
//                       {comments
//                         .filter((comment) => !comment.parentCommentId)
//                         .map((comment) => (
//                           <div key={comment._id} className="flex space-x-4">
//                             <img
//                               src={comment.avatar || "/api/placeholder/40/40"}
//                               alt={comment.user}
//                               className="w-10 h-10 rounded-full"
//                             />
//                             <div className="flex-1">
//                               <div className="flex items-center justify-between">
//                                 <h4 className="font-semibold">{comment.user}</h4>
//                                 <span className="text-sm text-gray-500">
//                                   {new Date(comment.createdAt).toLocaleString()}
//                                 </span>
//                               </div>
//                               <p className="text-gray-600 mt-1">{comment.content || comment.comment}</p>

//                               {/* Like & Reply */}
//                               <div className="flex items-center space-x-4 mt-2">
//                                 <button
//                                   className="text-sm text-gray-500 hover:text-indigo-600"
//                                   onClick={() => handleToggleCommentLike(comment._id)}
//                                 >
//                                   <ThumbsUp size={14} className="inline mr-1" />
//                                   {comment.likes || 0}
//                                 </button>
//                                 <button
//                                   className="text-sm text-gray-500 hover:text-indigo-600"
//                                   onClick={() => setReplyingTo(comment._id)}
//                                 >
//                                   Reply
//                                 </button>
//                               </div>

//                               {/* Reply Input Box */}
//                               {replyingTo === comment._id && (
//                                 <div className="mt-2 ml-4 flex items-center space-x-2">
//                                   <input
//                                     type="text"
//                                     value={replyText}
//                                     onChange={(e) => setReplyText(e.target.value)}
//                                     placeholder="Write a reply..."
//                                     className="flex-1 p-2 border rounded-lg"
//                                   />
//                                   <button
//                                     onClick={() => handleAddReply(comment._id, selectedProposal.id)}
//                                     className="text-indigo-600 hover:underline"
//                                   >
//                                     <Send size={20} />
//                                   </button>
//                                 </div>
//                               )}

//                               {/* See/Hide Replies Button */}
//                               {comments.some((c) => String(c.parentCommentId) === String(comment._id)) && (
//                                 <button
//                                   onClick={() => toggleReplies(comment._id)}
//                                   className="text-sm text-indigo-500 mt-3"
//                                 >
//                                   {showReplies[comment._id] ? "Hide replies" : "See all replies"}
//                                 </button>
//                               )}

//                               {/* Replies */}
//                               {showReplies[comment._id] && (
//                                 <div className="ml-6 mt-4 space-y-2">
//                                   {comments
//                                     .filter((c) => String(c.parentCommentId) === String(comment._id))
//                                     .map((reply) => (
//                                       <div key={reply._id} className="flex space-x-3">
//                                         <img
//                                           src={reply.avatar || "/api/placeholder/40/40"}
//                                           alt={reply.user}
//                                           className="w-8 h-8 rounded-full"
//                                         />
//                                         <div>
//                                           <div className="flex items-center justify-between">
//                                             <h5 className="font-medium">{reply.user}</h5>
//                                             <span className="text-xs text-gray-500">
//                                               {new Date(reply.createdAt).toLocaleString()}
//                                             </span>
//                                           </div>
//                                           <p className="text-sm text-gray-600">{reply.content || reply.comment}</p>
//                                           <button
//                                             className="text-xs text-gray-500 hover:text-indigo-600 mt-1"
//                                             onClick={() => handleToggleCommentLike(reply._id)}
//                                           >
//                                             <ThumbsUp size={12} className="inline mr-1" />
//                                             {reply.likes || 0}
//                                           </button>
//                                         </div>
//                                       </div>
//                                     ))}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Updated ProposalCard Component
// const ProposalCard = ({ proposal, onClick }) => {
//   return (
//     <div 
//       className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
//       onClick={onClick}
//     >
//       <div className="relative h-40">
//         <img 
//           src={proposal.image} 
//           alt={proposal.title}
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute top-2 right-2">
//           <span className={`
//             px-2 py-1 rounded-full text-xs font-semibold
//             ${proposal.status === 'approved' ? 'bg-green-100 text-green-800' : 
//               proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
//               proposal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
//               proposal.status === 'completed' ? 'bg-purple-100 text-purple-800' :
//               'bg-yellow-100 text-yellow-800'}
//           `}>
//             {proposal.status.replace('_', ' ').toUpperCase()}
//           </span>
//         </div>
//         {proposal.priority && (
//           <div className="absolute top-2 left-2">
//             <span className={`
//               px-2 py-1 rounded-full text-xs font-semibold
//               ${proposal.priority === 'high' ? 'bg-red-100 text-red-800' :
//                 proposal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                 'bg-green-100 text-green-800'}
//             `}>
//               {proposal.priority.toUpperCase()}
//             </span>
//           </div>
//         )}
//       </div>
      
//       <div className="p-4">
//         <div className="flex justify-between items-start mb-2">
//           <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{proposal.title}</h2>
//           {proposal.category && (
//             <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//               {proposal.category}
//             </span>
//           )}
//         </div>
//         <p className="text-gray-600 text-sm mb-4 line-clamp-2">{proposal.description}</p>
        
//         {/* Budget and Beneficiaries */}
//         {(proposal.budget || proposal.beneficiaries) && (
//           <div className="flex justify-between text-xs text-gray-500 mb-3">
//             {proposal.budget && (
//               <span>Budget: ₹{proposal.budget.toLocaleString()}</span>
//             )}
//             {proposal.beneficiaries && (
//               <span>{proposal.beneficiaries} beneficiaries</span>
//             )}
//           </div>
//         )}
        
//         <div className="flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center">
//               <ThumbsUp size={16} className="text-gray-500" />
//               <span className="ml-1 text-sm text-gray-500">{proposal.upvotes || 0}</span>
//             </div>
//             <div className="flex items-center">
//               <MessageSquare size={16} className="text-gray-500" />
//               <span className="ml-1 text-sm text-gray-500">{proposal.comments || 0}</span>
//             </div>
//           </div>
//           <span className="text-xs text-gray-500">
//             {proposal.submittedDate || new Date(proposal.createdAt).toLocaleDateString()}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ProposalsComponent;


import React, { useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, X, Send, Filter, Search } from 'lucide-react';
import axios from 'axios';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useSocket } from '../context/SocketContext'; // ✅ Import Socket context

const ProposalsComponent = () => {
  const [proposals, setProposals] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const { user } = useUser();
  const { getToken } = useAuth();
  const { socket, joinProposalRoom, leaveProposalRoom } = useSocket(); // ✅ Use Socket context
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [showReplies, setShowReplies] = useState({});
  
  // Filter states
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0
  });

  // ✅ Socket.IO real-time listeners for selected proposal - CORRECTED VERSION
  useEffect(() => {
    if (socket && selectedProposal) {
      // Join proposal room for real-time updates
      console.log('Joining proposal room:', selectedProposal.id);
      joinProposalRoom(selectedProposal.id);
      
      // Listen for new comments - FIXED
      socket.on('new_comment', (newComment) => {
        console.log('New comment received:', newComment);
        if (newComment.proposalId === selectedProposal.id) {
          setComments(prev => [...prev, {
            _id: newComment.id,
            user: newComment.user,
            comment: newComment.comment,
            content: newComment.comment,
            createdAt: newComment.createdAt,
            likes: 0,
            replies: []
          }]);
        }
      });
      
      // Listen for new replies - FIXED VERSION
      socket.on('new_reply', ({ commentId, reply }) => {
        console.log('New reply received:', reply);
        setComments(prev => {
          const updatedComments = prev.map(comment => {
            if (comment._id === commentId) {
              // Ensure replies array exists
              const currentReplies = Array.isArray(comment.replies) ? comment.replies : [];
              
              // Add new reply with proper structure
              const newReply = {
                _id: reply.id || reply._id,
                comment: reply.comment || reply.content,
                content: reply.comment || reply.content,
                user: reply.user,
                createdAt: reply.createdAt,
                likes: reply.likes || 0,
                avatar: reply.avatar || "/api/placeholder/40/40",
                parentCommentId: commentId
              };
              
              return {
                ...comment,
                replies: [...currentReplies, newReply]
              };
            }
            return comment;
          });
          
          console.log('Updated comments after reply:', updatedComments);
          return updatedComments;
        });
      });
      
      // Listen for vote updates - FIXED VERSION
     socket.on('vote_updated', (voteData) => {
  console.log('Vote updated:', voteData);
  
  // Use functional updates to avoid stale closure
  setSelectedProposal(prev => {
    if (prev && prev.id === voteData.proposalId) {
      return {
        ...prev,
        votes: voteData.votes,
        upvotes: voteData.upvotes,
        downvotes: voteData.downvotes
      };
    }
    return prev;
  });
  
  setProposals(prev => prev.map(proposal => 
    proposal.id === voteData.proposalId 
      ? { 
          ...proposal, 
          votes: voteData.votes,
          upvotes: voteData.upvotes,
          downvotes: voteData.downvotes
        }
      : proposal
  ));
});


      
      // Cleanup when proposal changes or component unmounts
      return () => {
        leaveProposalRoom(selectedProposal.id);
        socket.off('new_comment');
        socket.off('new_reply');
        socket.off('vote_updated');
      };
    }
  }, [socket, selectedProposal?.id]); // Fixed dependencies

  // Get user profile for constituency filtering
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
      const response = await axios.get(`${backendUrl}/api/user/profile/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUserProfile(response.data.data);
        localStorage.setItem('userProfile', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
    }
  };

  useEffect(() => {
    if (userProfile) {
      fetchProposals();
    }
  }, [userProfile, filter, searchTerm, sortBy, sortOrder, pagination.page]);

  const fetchProposals = async () => {
  try {
    setLoading(true);
    
    // ✅ ADDED: Get authentication token
    const token = await getToken();
    
    const params = new URLSearchParams({
      page: pagination.page,
      limit: pagination.limit,
      sortBy: sortBy,
      sortOrder: sortOrder
    });

    if (filter !== 'all') params.append('status', filter);
    if (searchTerm) params.append('search', searchTerm);
    
    // ✅ REMOVED: constituency parameter (now handled automatically by backend)
    // The backend now automatically filters by user's constituency

    // ✅ UPDATED: Added authorization headers
    const response = await axios.get(`${backendUrl}/api/user/all-proposals?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      setProposals(response.data.data.proposals);
      setPagination(prev => ({
        ...prev,
        total: response.data.data.pagination.total,
        totalPages: response.data.data.pagination.totalPages
      }));
    }
  } catch (error) {
    console.error('Error fetching proposals:', error);
    // ✅ OPTIONAL: Add error handling for authentication issues
    if (error.response?.status === 401) {
      console.error('Authentication required');
    }
  } finally {
    setLoading(false);
  }
};

  // FIXED: fetchComments useEffect
  useEffect(() => {
    const fetchComments = async (proposalId) => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/get-comments/${proposalId}`);
        if (response.data.success) {
          // Ensure each comment has replies array initialized
          const commentsWithReplies = response.data.data.comments.map(comment => ({
            ...comment,
            replies: Array.isArray(comment.replies) ? comment.replies : []
          }));
          setComments(commentsWithReplies);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (selectedProposal) {
      // Clear comments first to prevent state conflicts
      setComments([]);
      setReplyingTo(null); // Clear reply state
      setReplyText(''); // Clear reply text
      setShowReplies({}); // Clear show replies state
      fetchComments(selectedProposal.id);
    }
  }, [selectedProposal?.id, backendUrl]); // Fixed dependencies

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleAddComment = async (proposalId) => {
    if (!newComment.trim()) return;
    if (!proposalId) {
      console.error('No proposal selected!');
      return;
    }

    try {
      const token = await getToken();
      const res = await axios.post(`${backendUrl}/api/user/add-comment`, {
        proposalId,
        content: newComment,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // Comment will be added via Socket.IO real-time event
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleVote = async (proposalId, type) => {
    if (!user) {
      alert('Please sign in to vote');
      return;
    }

    try {
      const token = await getToken();
      const res = await axios.post(`${backendUrl}/api/user/vote`, {
        proposalId,
        voteType: type,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // Vote count will be updated via Socket.IO real-time event
        console.log('Vote recorded successfully');
      }
    } catch (error) {
      console.error("Voting error:", error);
      alert('Failed to record vote. Please try again.');
    }
  };

  const handleAddReply = async (parentCommentId, proposalId) => {
    if (!replyText.trim()) return;

    try {
      const token = await getToken();
      const response = await axios.post(`${backendUrl}/api/user/add-reply`, {
        content: replyText,
        commentId: parentCommentId,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Reply will be added via Socket.IO real-time event
        setReplyText('');
        setReplyingTo(null);
      }
    } catch (err) {
      console.error("Failed to add reply:", err);
      alert('Failed to add reply. Please try again.');
    }
  };

  // FIXED: handleToggleCommentLike Function
  const handleToggleCommentLike = async (commentId) => {
    if (!user) return;

    try {
      const token = await getToken();
      const response = await axios.post(`${backendUrl}/api/user/comment-like`, {
        commentId,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Use functional update to ensure latest state
        setComments(prevComments =>
          prevComments.map(comment => {
            if (comment._id === commentId) {
              return { 
                ...comment, 
                likes: response.data.data.likes,
                isLiked: response.data.data.isLiked 
              };
            }
            // Also check in replies
            if (comment.replies && comment.replies.length > 0) {
              const updatedReplies = comment.replies.map(reply =>
                reply._id === commentId 
                  ? { 
                      ...reply, 
                      likes: response.data.data.likes,
                      isLiked: response.data.data.isLiked 
                    }
                  : reply
              );
              return { ...comment, replies: updatedReplies };
            }
            return comment;
          })
        );
      }
    } catch (err) {
      console.error("Failed to toggle like on comment:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProposals();
  };

  if (!userProfile || !userProfile.onboardingCompleted) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Required</h2>
          <p className="text-gray-600">Please complete your profile to view proposals from your area.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto p-4 md:p-8">
      <div className="md:ml-0 mt-16 md:mt-0">
        {/* Header with constituency info */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Proposals in {userProfile.constituency}
          </h1>
          <p className="text-gray-600">
            {userProfile.district}, {userProfile.state} • {pagination.total} proposals found
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search proposals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </form>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="votes-desc">Most Votes</option>
              <option value="budget-desc">Highest Budget</option>
              <option value="budget-asc">Lowest Budget</option>
            </select>
          </div>
        </div>
        
        {/* Proposal Cards Grid - FIXED onClick */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {proposals.map((proposal) => (
            <ProposalCard 
              key={proposal.id} 
              proposal={proposal} 
              onClick={() => {
                // Clear states when opening new proposal
                setComments([]);
                setReplyingTo(null);
                setReplyText('');
                setShowReplies({});
                setSelectedProposal(proposal);
              }}
            />
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {[...Array(pagination.totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: index + 1 }))}
                  className={`px-3 py-2 border rounded-lg ${
                    pagination.page === index + 1
                      ? 'bg-indigo-500 text-white border-indigo-500'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal with Real-time Features */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
          <div 
            className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
            onClick={() => setSelectedProposal(null)}
          />
          
          <div className="relative w-full max-w-4xl max-h-[90vh] m-4 bg-white rounded-lg shadow-xl">
            <div className="h-full bg-white rounded-lg transform transition-all duration-300 ease-in-out">
              <button
                onClick={() => setSelectedProposal(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="max-h-[90vh] overflow-y-auto">
                {/* Proposal Image */}
                <div className="relative h-64">
                  <img 
                    src={selectedProposal.image} 
                    alt={selectedProposal.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                    <div className="flex justify-between items-end">
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-semibold
                        ${selectedProposal.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          selectedProposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          selectedProposal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          selectedProposal.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'}
                      `}>
                        {selectedProposal.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {selectedProposal.category && (
                        <span className="bg-white/20 text-white px-2 py-1 rounded text-sm">
                          {selectedProposal.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Proposal Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProposal.title}</h2>
                  <p className="text-gray-600 mb-4">{selectedProposal.description}</p>
                  
                  {/* Proposal Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    {selectedProposal.budget && (
                      <div>
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="font-semibold">₹{selectedProposal.budget.toLocaleString()}</p>
                      </div>
                    )}
                    {selectedProposal.beneficiaries && (
                      <div>
                        <p className="text-sm text-gray-500">Beneficiaries</p>
                        <p className="font-semibold">{selectedProposal.beneficiaries.toLocaleString()}</p>
                      </div>
                    )}
                    {selectedProposal.priority && (
                      <div>
                        <p className="text-sm text-gray-500">Priority</p>
                        <p className={`font-semibold capitalize ${
                          selectedProposal.priority === 'high' ? 'text-red-600' :
                          selectedProposal.priority === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>{selectedProposal.priority}</p>
                      </div>
                    )}
                    {selectedProposal.submittedBy && (
                      <div>
                        <p className="text-sm text-gray-500">Submitted by</p>
                        <p className="font-semibold">{selectedProposal.submittedBy}</p>
                      </div>
                    )}
                  </div>
                 
                  {/* Interaction Stats with Real-time Updates */}
                  <div className="flex items-center space-x-6 mb-6">
                    <div
                      className="flex items-center cursor-pointer hover:text-indigo-600"
                      onClick={() => handleVote(selectedProposal.id, "upvote")}
                    >
                      <ThumbsUp size={18} className="text-gray-600" />
                      <span className="ml-2 text-gray-600">{selectedProposal.upvotes || 0}</span>
                    </div>

                    <div
                      className="flex items-center cursor-pointer hover:text-red-600"
                      onClick={() => handleVote(selectedProposal.id, "downvote")}
                    >
                      <ThumbsDown size={18} className="text-gray-600" />
                      <span className="ml-2 text-gray-600">{selectedProposal.downvotes || 0}</span>
                    </div>

                    <div className="flex items-center">
                      <MessageSquare size={18} className="text-gray-600" />
                      <span className="ml-2 text-gray-600">{comments.length} comments</span>
                    </div>
                  </div>

                  {/* Comments Section with Real-time Updates */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Comments</h3>

                    {/* Comment Input */}
                    <div className="flex items-center space-x-4 mb-6">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(selectedProposal.id)}
                        disabled={!newComment.trim()}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Send size={20} />
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments
                        .filter((comment) => !comment.parentCommentId)
                        .map((comment) => (
                          <div key={comment._id} className="flex space-x-4">
                            <img
                              src={comment.avatar || "/api/placeholder/40/40"}
                              alt={comment.user}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">{comment.user}</h4>
                                <span className="text-sm text-gray-500">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-600 mt-1">{comment.content || comment.comment}</p>

                              {/* Like & Reply */}
                              <div className="flex items-center space-x-4 mt-2">
                                <button
                                  className="text-sm text-gray-500 hover:text-indigo-600"
                                  onClick={() => handleToggleCommentLike(comment._id)}
                                >
                                  <ThumbsUp size={14} className="inline mr-1" />
                                  {comment.likes || 0}
                                </button>
                                <button
                                  className="text-sm text-gray-500 hover:text-indigo-600"
                                  onClick={() => setReplyingTo(comment._id)}
                                >
                                  Reply
                                </button>
                              </div>

                              {/* Reply Input Box */}
                              {replyingTo === comment._id && (
                                <div className="mt-2 ml-4 flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="flex-1 p-2 border rounded-lg"
                                  />
                                  <button
                                    onClick={() => handleAddReply(comment._id, selectedProposal.id)}
                                    className="text-indigo-600 hover:underline"
                                  >
                                    <Send size={20} />
                                  </button>
                                </div>
                              )}

                             {/* FIXED: See/Hide Replies Button - Use comment.replies instead of filtering comments */}
{comment.replies && comment.replies.length > 0 && (
  <button
    onClick={() => toggleReplies(comment._id)}
    className="text-sm text-indigo-500 mt-3"
  >
    {showReplies[comment._id] ? "Hide replies" : `See ${comment.replies.length} replies`}
  </button>
)}

{/* FIXED: Replies - Use comment.replies instead of filtering comments */}
{showReplies[comment._id] && (
  <div className="ml-6 mt-4 space-y-2">
    {comment.replies && comment.replies.map((reply) => (
      <div key={reply._id} className="flex space-x-3">
        <img
          src={reply.avatar || "/api/placeholder/40/40"}
          alt={reply.user}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <div className="flex items-center justify-between">
            <h5 className="font-medium">{reply.user}</h5>
            <span className="text-xs text-gray-500">
              {new Date(reply.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-600">{reply.content || reply.comment}</p>
          <button
            className="text-xs text-gray-500 hover:text-indigo-600 mt-1"
            onClick={() => handleToggleCommentLike(reply._id)}
          >
            <ThumbsUp size={12} className="inline mr-1" />
            {reply.likes || 0}
          </button>
        </div>
      </div>
    ))}
  </div>
)}

                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ProposalCard Component (unchanged)
const ProposalCard = ({ proposal, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="relative h-40">
        <img 
          src={proposal.image} 
          alt={proposal.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`
            px-2 py-1 rounded-full text-xs font-semibold
            ${proposal.status === 'approved' ? 'bg-green-100 text-green-800' : 
              proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
              proposal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              proposal.status === 'completed' ? 'bg-purple-100 text-purple-800' :
              'bg-yellow-100 text-yellow-800'}
          `}>
            {proposal.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        {proposal.priority && (
          <div className="absolute top-2 left-2">
            <span className={`
              px-2 py-1 rounded-full text-xs font-semibold
              ${proposal.priority === 'high' ? 'bg-red-100 text-red-800' :
                proposal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'}
            `}>
              {proposal.priority.toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{proposal.title}</h2>
          {proposal.category && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {proposal.category}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{proposal.description}</p>
        
        {/* Budget and Beneficiaries */}
        {(proposal.budget || proposal.beneficiaries) && (
          <div className="flex justify-between text-xs text-gray-500 mb-3">
            {proposal.budget && (
              <span>Budget: ₹{proposal.budget.toLocaleString()}</span>
            )}
            {proposal.beneficiaries && (
              <span>{proposal.beneficiaries} beneficiaries</span>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <ThumbsUp size={16} className="text-gray-500" />
              <span className="ml-1 text-sm text-gray-500">{proposal.upvotes || 0}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare size={16} className="text-gray-500" />
              <span className="ml-1 text-sm text-gray-500">{proposal.comments || 0}</span>
            </div>
          </div>
          <span className="text-xs text-gray-500">
            {proposal.submittedDate || new Date(proposal.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProposalsComponent;
