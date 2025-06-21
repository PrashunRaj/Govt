import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Home,
  Globe,
  Users,
  Star,
  Menu,
  X,
  Send
} from 'lucide-react';
// Proposal Card Component
const ProposalCard = ({ proposal, onClick }) => (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <img 
        src={proposal.image} 
        alt={proposal.title}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`
            px-2 py-1 rounded-full text-xs font-semibold
            ${proposal.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
          `}>
            {proposal.status}
          </span>
          <span className="text-sm text-gray-500">{proposal.date}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{proposal.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{proposal.description}</p>
  
        {/* Interaction Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex space-x-4">
            <button className="flex items-center text-gray-600 hover:text-indigo-600">
              <ThumbsUp size={18} />
              <span className="ml-1 text-sm">{proposal.upvotes}</span>
            </button>
            <button className="flex items-center text-gray-600 hover:text-indigo-600">
              <ThumbsDown size={18} />
              <span className="ml-1 text-sm">{proposal.downvotes}</span>
            </button>
          </div>
          <button className="flex items-center text-gray-600 hover:text-indigo-600">
            <MessageSquare size={18} />
            <span className="ml-1 text-sm">{proposal.comments}</span>
          </button>
        </div>
      </div>
    </div>
  );

  export default ProposalCard;


  