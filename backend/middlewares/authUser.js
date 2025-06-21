// backend/middlewares/auth.js
import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';
// Basic Clerk middleware - adds auth to req object
export const clerkAuth = clerkMiddleware();
// Protected route middleware - requires authentication
export const requireAuthentication = requireAuth();

// Custom middleware to get user info
export const verifyClerkToken = (req, res, next) => {
  try {
    const auth = getAuth(req);
    
    if (!auth.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Add user info to request
    req.user = {
      sub: auth.userId,
      ...auth
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication'
    });
  }
};
