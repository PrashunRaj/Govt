

import React from "react";
import { X } from "lucide-react";

const Notification = ({ isOpen, toggleModal }) => {
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Project A Approved",
      description: "Your project proposal has been approved by the council and is ready for implementation."
    },
    {
      id: 1,
      type: "success",
      title: "Project A Approved",
      description: "Your project proposal has been approved by the council and is ready for implementation."
    },
    {
      id: 1,
      type: "success",
      title: "Project A Approved",
      description: "Your project proposal has been approved by the council and is ready for implementation."
    },
    {
      id: 1,
      type: "success",
      title: "Project A Approved",
      description: "Your project proposal has been approved by the council and is ready for implementation."
    },
    {
      id: 2,
      type: "warning",
      title: "New Votes Received",
      description: "Your project proposal has received 50 new community votes requiring your review."
    },
    {
      id: 3,
      type: "error",
      title: "Update Required",
      description: "Additional documentation is required for your project proposal to proceed."
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={toggleModal}
      />
      
      <div className="relative w-full max-w-[400px] max-h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden m-4 z-50">
        <div className="sticky top-0 bg-white px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-center">Notifications</h2>
          <button 
            onClick={toggleModal}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh] scrollbar-hide">
          {notifications.map((notification) => (
            <div key={notification.id} className="relative rounded-xl border border-gray-100 bg-white p-4 text-sm shadow-lg">
              <div className="flex space-x-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  notification.type === 'success' ? 'bg-green-100 text-green-500' :
                  notification.type === 'warning' ? 'bg-yellow-100 text-yellow-500' :
                  'bg-red-100 text-red-500'
                }`}>
                  {notification.type === 'success' && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  )}
                  {notification.type === 'warning' && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  )}
                  {notification.type === 'error' && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="pr-6 font-medium text-gray-900">{notification.title}</h4>
                  <div className="mt-1 text-gray-500">{notification.description}</div>
                  <div className="mt-2 flex space-x-4">
                    <button className="inline-block font-medium leading-loose text-gray-500 hover:text-gray-900">
                      Dismiss
                    </button>
                    <button className="inline-block font-medium leading-loose text-indigo-600 hover:text-indigo-700">
                      View more
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;