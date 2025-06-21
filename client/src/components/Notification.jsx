import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const Notification = ({ isOpen, toggleModal }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get(`${backendUrl}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setNotifications(response.data.data.notifications);
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = await getToken();
      await axios.post(`${backendUrl}/api/notifications/mark-read`, {
        notificationId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = await getToken();
      await axios.post(`${backendUrl}/api/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = await getToken();
      await axios.post(`${backendUrl}/api/notifications/delete`, {
        notificationId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setNotifications(prev => 
        prev.filter(notif => notif._id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'proposal_approved':
      case 'proposal_completed':
        return 'success';
      case 'upvote_received':
      case 'comment_received':
      case 'reply_received':
        return 'warning';
      case 'proposal_rejected':
        return 'error';
      default:
        return 'success';
    }
  };

  const handleViewMore = (notification) => {
    if (notification.proposalId) {
      // Navigate to proposal detail page
      window.location.href = `/proposal/${notification.proposalId}`;
    }
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={toggleModal}
      />
      
      <div className="relative w-full max-w-[400px] max-h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden m-4 z-50">
        <div className="sticky top-0 bg-white px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Notifications {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Mark all read
                </button>
              )}
              <button 
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh] scrollbar-hide">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12h5v12z" />
                </svg>
              </div>
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`relative rounded-xl border p-4 text-sm shadow-lg ${
                  notification.isRead 
                    ? 'border-gray-100 bg-white' 
                    : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex space-x-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    getNotificationIcon(notification.type) === 'success' ? 'bg-green-100 text-green-500' :
                    getNotificationIcon(notification.type) === 'warning' ? 'bg-yellow-100 text-yellow-500' :
                    'bg-red-100 text-red-500'
                  }`}>
                    {getNotificationIcon(notification.type) === 'success' && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                    )}
                    {getNotificationIcon(notification.type) === 'warning' && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    )}
                    {getNotificationIcon(notification.type) === 'error' && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="pr-6 font-medium text-gray-900">{notification.title}</h4>
                    <div className="mt-1 text-gray-500">{notification.description}</div>
                    <div className="mt-1 text-xs text-gray-400">
                      {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString()}
                    </div>
                    <div className="mt-2 flex space-x-4">
                      <button 
                        onClick={() => deleteNotification(notification._id)}
                        className="inline-block font-medium leading-loose text-gray-500 hover:text-gray-900"
                      >
                        Dismiss
                      </button>
                      {notification.proposalId && (
                        <button 
                          onClick={() => handleViewMore(notification)}
                          className="inline-block font-medium leading-loose text-indigo-600 hover:text-indigo-700"
                        >
                          View more
                        </button>
                      )}
                      {!notification.isRead && (
                        <button 
                          onClick={() => markAsRead(notification._id)}
                          className="inline-block font-medium leading-loose text-blue-600 hover:text-blue-700"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {!notification.isRead && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default Notification;
