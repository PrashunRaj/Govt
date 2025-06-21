import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user } = useUser();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      // Create socket connection
      const newSocket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', {
        transports: ['websocket'],
        upgrade: true
      });

      newSocket.on('connect', () => {
        console.log('Connected to server:', newSocket.id);
        setIsConnected(true);
        
        // Join user notification room
        newSocket.emit('join_user_notifications', user.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      // Listen for new notifications
      newSocket.on('new_notification', (notification) => {
        console.log('New notification received:', notification);
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.emit('leave_user_notifications', user.id);
        newSocket.close();
      };
    }
  }, [user]);

  // Helper functions
  const joinProposalRoom = (proposalId) => {
    if (socket && proposalId) {
      socket.emit('join_proposal', proposalId);
    }
  };

  const leaveProposalRoom = (proposalId) => {
    if (socket && proposalId) {
      socket.emit('leave_proposal', proposalId);
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    socket,
    isConnected,
    notifications,
    unreadCount,
    joinProposalRoom,
    leaveProposalRoom,
    markNotificationAsRead,
    clearAllNotifications,
    setNotifications,
    setUnreadCount
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
