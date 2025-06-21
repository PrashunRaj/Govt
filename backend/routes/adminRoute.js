import express from 'express';
import { 
  getDashboardStats,
  getAllMLAs,
  getAllUsers,
  verifyMLA,
  toggleUserStatus
} from '../controllers/AdminController.js';

import { authenticateAdmin } from '../middlewares/authAdmin.js';

const adminRouter = express.Router();

// Dashboard routes
adminRouter.get('/dashboard-stats', authenticateAdmin, getDashboardStats);
// MLA management routes
adminRouter.get('/mlas', authenticateAdmin, getAllMLAs);
adminRouter.post('/mlas/:mlaId/verify', authenticateAdmin, verifyMLA);

// User management routes
adminRouter.get('/users', authenticateAdmin, getAllUsers);
adminRouter.post('/users/:userId/toggle-status', authenticateAdmin, toggleUserStatus);

export default adminRouter;
