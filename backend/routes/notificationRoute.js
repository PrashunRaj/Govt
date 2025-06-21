import express from 'express';
import { 
  getUserNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from '../controllers/notificationController.js';
import { verifyClerkToken } from '../middlewares/authUser.js';

const notificationRouter = express.Router();

// Get user's notifications (GET)
notificationRouter.get('/', verifyClerkToken, getUserNotifications);

// Mark specific notification as read (POST)
notificationRouter.post('/mark-read', verifyClerkToken, markAsRead);

// Mark all notifications as read (POST)
notificationRouter.post('/mark-all-read', verifyClerkToken, markAllAsRead);

// Delete specific notification (POST)
notificationRouter.post('/delete', verifyClerkToken, deleteNotification);

export default notificationRouter;
