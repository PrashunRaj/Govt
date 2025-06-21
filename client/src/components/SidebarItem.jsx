// Sidebar Item Component
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
const SidebarItem = ({ icon, text, isOpen, active = false }) => (
    <div className={`
      flex items-center p-4 cursor-pointer
      ${active ? 'bg-indigo-700' : 'hover:bg-indigo-700'}
      transition-colors duration-200
    `}>
      <div className="flex items-center">
        {icon}
        {isOpen && <span className="ml-4">{text}</span>}
      </div>
    </div>
  );

export default SidebarItem;
  