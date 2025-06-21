

// import React, { useState } from 'react';

// import ProposalCard from '../components/ProposalCard';
// import SidebarItem from '../components/SidebarItem';
// import {useNavigate} from 'react-router-dom'; 
// import { 
//   ChevronLeft, 
//   ChevronRight, 
//   FileText, 
//   ThumbsUp, 
//   ThumbsDown, 
//   MessageSquare, 
//   Home,
//   Globe,
//   Users,
//   Star,
//   Menu,
//   X,
//   Send
// } from 'lucide-react';


// const UserDashboard = () => {
  
// const navigate = useNavigate();
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [selectedProposal, setSelectedProposal] = useState(null);

//   // Sample data - replace with your actual data
//   const proposals = [
//     {
//       id: 1,
//       title: "Community Park Renovation",
//       description: "Proposal to renovate the local park with new playground equipment and better lighting for improved safety and accessibility. This project aims to create a more inclusive and family-friendly environment for our community.",
//       image: "/api/placeholder/400/200",
//       upvotes: 156,
//       downvotes: 12,
//       comments: 45,
//       author: "John Doe",
//       date: "2025-02-01",
//       status: "Under Review"
//     },
//     {
//       id: 2,
//       title: "Road Safety Improvements",
//       description: "Installation of traffic signals and speed bumps in residential areas to enhance pedestrian safety and regulate traffic flow.",
//       image: "/api/placeholder/400/200",
//       upvotes: 234,
//       downvotes: 18,
//       comments: 67,
//       author: "Jane Smith",
//       date: "2025-02-03",
//       status: "Approved"
//     },
//     // Add more sample proposals
//     ...Array(6).fill(null).map((_, index) => ({
//       id: index + 3,
//       title: `Sample Proposal ${index + 3}`,
//       description: "A detailed sample proposal description for testing the scroll and display functionality of our platform.",
//       image: "/api/placeholder/400/200",
//       upvotes: Math.floor(Math.random() * 200),
//       downvotes: Math.floor(Math.random() * 50),
//       comments: Math.floor(Math.random() * 100),
//       author: "Sample Author",
//       date: "2025-02-03",
//       status: index % 2 === 0 ? "Under Review" : "Approved"
//     }))
//   ];

//   // Sample comments
//   const comments = [
//     {
//       id: 1,
//       user: "Alice Johnson",
//       avatar: "/api/placeholder/40/40",
//       comment: "This is exactly what our community needs. I fully support this initiative!",
//       date: "2025-02-05",
//       likes: 12
//     },
//     {
//       id: 2,
//       user: "Bob Smith",
//       avatar: "/api/placeholder/40/40",
//       comment: "Have we considered the environmental impact? We should add some green spaces.",
//       date: "2025-02-06",
//       likes: 8
//     },
//     ...Array(5).fill(null).map((_, index) => ({
//       id: index + 3,
//       user: `User ${index + 3}`,
//       avatar: "/api/placeholder/40/40",
//       comment: "Additional feedback and suggestions for the proposal...",
//       date: "2025-02-07",
//       likes: Math.floor(Math.random() * 10)
//     }))
//   ];

//   return (
//     <div className="h-screen flex bg-gray-50">
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
//         className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg"
//       >
//         <Menu size={24} />
//       </button>

//       {/* Overlay for mobile menu */}
//       {isMobileMenuOpen && (
//         <div 
//           className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={() => setMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div className={`
//         fixed md:relative z-40 h-screen
//         ${isSidebarOpen ? 'w-64 md:w-64' : 'w-20'}
//         ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
//         bg-indigo-800 text-white transition-all duration-300 ease-in-out
//         overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-indigo-900
//       `}>
//         <div className="sticky top-0 bg-indigo-800 p-4 flex justify-between items-center border-b border-indigo-700">
//           <h2 className={`font-bold ${isSidebarOpen ? 'block' : 'hidden'}`}>Dashboard</h2>
//           <button 
//             onClick={() => setSidebarOpen(!isSidebarOpen)}
//             className="p-2 hover:bg-indigo-700 rounded-lg hidden md:block"
//           >
//             {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
//           </button>
//         </div>

//         <nav className="mt-8">
//           <SidebarItem icon={<Home />} text="Add Proposals" isOpen={isSidebarOpen} onClick={()=>navigate('/add-proposals')}/>
//           <SidebarItem icon={<FileText />} text="Your Proposals" isOpen={isSidebarOpen} active />
//           <SidebarItem icon={<Globe />} text="Regional Proposals" isOpen={isSidebarOpen} />
//           <SidebarItem icon={<Users />} text="Community" isOpen={isSidebarOpen} />
//           <SidebarItem icon={<Star />} text="Favorites" isOpen={isSidebarOpen} />
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-hidden">
//         <div className="h-screen overflow-y-auto p-4 md:p-8">
//           <div className="md:ml-0 mt-16 md:mt-0">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Proposals</h1>
            
//             {/* Proposal Cards Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {proposals.map((proposal) => (
//                 <ProposalCard 
//                   key={proposal.id} 
//                   proposal={proposal} 
//                   onClick={() => setSelectedProposal(proposal)}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//      {/* Modal */}
// {selectedProposal && (
//   <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
//     {/* Backdrop with blur */}
//     <div 
//       className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
//       onClick={() => setSelectedProposal(null)}
//     />
    
//     {/* Modal Content */}
//     <div className="relative w-full max-w-4xl max-h-[90vh] m-4 bg-white rounded-lg shadow-xl">
//       <div 
//         className="h-full bg-white rounded-lg transform transition-all duration-300 ease-in-out"
//         style={{
//           animation: "fadeIn 0.3s ease-out"
//         }}
//       >
//         {/* Close Button */}
//         <button
//           onClick={() => setSelectedProposal(null)}
//           className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
//         >
//           <X size={24} />
//         </button>

//         {/* Scrollable Content */}
//         <div className="max-h-[90vh] overflow-y-auto">
//           {/* Proposal Image */}
//           <div className="relative h-64">
//             <img 
//               src={selectedProposal.image} 
//               alt={selectedProposal.title}
//               className="w-full h-full object-cover rounded-t-lg"
//             />
//             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
//               <span className={`
//                 px-2 py-1 rounded-full text-xs font-semibold
//                 ${selectedProposal.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
//               `}>
//                 {selectedProposal.status}
//               </span>
//             </div>
//           </div>

//           {/* Proposal Content */}
//           <div className="p-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProposal.title}</h2>
//             <p className="text-gray-600 mb-4">{selectedProposal.description}</p>
            
//             {/* Interaction Stats */}
//             <div className="flex items-center space-x-6 mb-6">
//               <div className="flex items-center">
//                 <ThumbsUp size={18} className="text-gray-600" />
//                 <span className="ml-2 text-gray-600">{selectedProposal.upvotes}</span>
//               </div>
//               <div className="flex items-center">
//                 <ThumbsDown size={18} className="text-gray-600" />
//                 <span className="ml-2 text-gray-600">{selectedProposal.downvotes}</span>
//               </div>
//               <div className="flex items-center">
//                 <MessageSquare size={18} className="text-gray-600" />
//                 <span className="ml-2 text-gray-600">{comments.length} comments</span>
//               </div>
//             </div>

//             {/* Comments Section */}
//             <div className="border-t pt-6">
//               <h3 className="text-lg font-semibold mb-4">Comments</h3>
              
//               {/* Comment Input */}
//               <div className="flex items-center space-x-4 mb-6">
//                 <input
//                   type="text"
//                   placeholder="Add a comment..."
//                   className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//                 <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
//                   <Send size={20} />
//                 </button>
//               </div>

//               {/* Comments List */}
//               <div className="space-y-4">
//                 {comments.map((comment) => (
//                   <div key={comment.id} className="flex space-x-4">
//                     <img
//                       src={comment.avatar}
//                       alt={comment.user}
//                       className="w-10 h-10 rounded-full"
//                     />
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between">
//                         <h4 className="font-semibold">{comment.user}</h4>
//                         <span className="text-sm text-gray-500">{comment.date}</span>
//                       </div>
//                       <p className="text-gray-600 mt-1">{comment.comment}</p>
//                       <div className="flex items-center space-x-4 mt-2">
//                         <button className="text-sm text-gray-500 hover:text-indigo-600">
//                           <ThumbsUp size={14} className="inline mr-1" />
//                           {comment.likes}
//                         </button>
//                         <button className="text-sm text-gray-500 hover:text-indigo-600">Reply</button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };



// export default UserDashboard;

// import React, { useState, useEffect } from 'react';
// import { Menu } from 'lucide-react';
// import { useLocation } from 'react-router-dom';
// import Sidebar  from '../components/sidebar'; // Import the Sidebar component

// const UserDashboard = ({ children }) => {
//   const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const location = useLocation();

//   // Close mobile menu when route changes
//   useEffect(() => {
//     if (isMobileMenuOpen) {
//       setMobileMenuOpen(false);
//     }
//   }, [location.pathname]);

//   return (
//     <div className="h-screen flex bg-gray-50">
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
//         className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg"
//       >
//         <Menu size={24} />
//       </button>

//       {/* Sidebar Component */}
//       <Sidebar 
//         isMobileMenuOpen={isMobileMenuOpen} 
//         setMobileMenuOpen={setMobileMenuOpen} 
//       />

//       {/* Main Content */}
//       <div className="flex-1 overflow-hidden transition-all duration-300">
//         {children}
//       </div>
//     </div>
//   );
// };
// export default UserDashboard;
import React from 'react'
import Layout from '../components/Layout'

const UserDashboard = () => {
  return (
    <div>
      <Layout/>
    </div>
  )
}

export default UserDashboard