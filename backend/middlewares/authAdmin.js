// backend/middleware/authAdmin.js
import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';
import { clerkClient } from '@clerk/clerk-sdk-node';

// Basic Clerk middleware for admin routes (same as authMla)
export const clerkAdminAuth = clerkMiddleware();

// Protected route middleware - requires authentication (same as authMla)
export const requireAdminAuth = requireAuth();

// ✅ FIXED: Custom middleware following your authMla pattern
export const authenticateAdmin = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    console.log('🔍 Admin auth object:', auth);
    
    if (!auth.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // ✅ Get user details from Clerk to verify admin email
    const user = await clerkClient.users.getUser(auth.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Admin email verification
    const adminEmails = [
      'rajprashun386b@gmail.com',
      'admin2@yourapp.com'
    ];

    const userEmail = user.emailAddresses.find(
      email => email.id === user.primaryEmailAddressId
    )?.emailAddress;
    
    if (!userEmail || !adminEmails.includes(userEmail)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
        debug: { userEmail, adminEmails }
      });
    }

    // Add user info to request (same pattern as authMla)
    req.user = {
      sub: auth.userId,
      email: userEmail,
      isAdmin: true,
      ...auth
    };
    
    console.log('✅ Admin verified:', userEmail);
    next();
    
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication service error',
      error: error.message
    });
  }
};
