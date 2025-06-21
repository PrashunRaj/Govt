import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';
import mlaModel from '../models/mlaModel.js';

// Basic Clerk middleware for MLA routes
export const clerkMlaAuth = clerkMiddleware();
// Protected route middleware - requires authentication
export const requireMlaAuth = requireAuth();

// Custom middleware to verify MLA authentication and get MLA profile
export const verifyMlaToken = async (req, res, next) => {
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
    console.error('MLA Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication'
    });
  }
};

// Middleware to check if MLA is verified and can access features
export const requireMlaVerification = async (req, res, next) => {
  try {
    const clerkId = req.user?.sub;
    
    if (!clerkId) {
        console.log('MLA verification middleware error: No clerkId found');
      return res.status(401).json({
      
        success: false,
        message: 'Authentication required'
      });
    }

    // Find MLA profile
    const mla = await mlaModel.findOne({ clerkId, isActive: true });
    
    if (!mla) {
      return res.status(404).json({
        success: false,
        message: 'MLA profile not found. Please complete your profile first.',
        requiresProfile: true
      });
    }

    // Check if MLA can access the system
    if (!mla.canAccess()) {
      let message = 'Access denied.';
      let reason = 'unknown';
      
      if (!mla.profileCompleted) {
        message = 'Please complete your profile first.';
        reason = 'profile_incomplete';
      } else if (!mla.isVerified) {
        message = 'Your account is pending admin verification.';
        reason = 'pending_verification';
      } else if (mla.isBanned) {
        message = 'Your account has been suspended.';
        reason = 'banned';
      } else if (!mla.isActive) {
        message = 'Your account is inactive.';
        reason = 'inactive';
      }
      
      return res.status(403).json({
        success: false,
        message: message,
        reason: reason,
        verificationStatus: mla.verificationStatus,
        profileCompleted: mla.profileCompleted,
        isBanned: mla.isBanned,
        isActive: mla.isActive
      });
    }

    // Add MLA profile to request for use in controllers
    req.mla = mla;
    next();
  } catch (error) {
    console.error('MLA verification middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking MLA verification status'
    });
  }
};

// Middleware to check if MLA profile exists (for profile creation routes)
export const checkMlaProfileExists = async (req, res, next) => {
  try {
    const clerkId = req.user?.sub;
    
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if MLA profile already exists
    const existingMla = await mlaModel.findOne({ clerkId });
    
    if (existingMla) {
      return res.status(400).json({
        success: false,
        message: 'MLA profile already exists',
        profileExists: true,
        mla: {
          id: existingMla._id,
          fullName: existingMla.fullName,
          constituency: existingMla.constituency,
          verificationStatus: existingMla.verificationStatus
        }
      });
    }

    next();
  } catch (error) {
    console.error('Check MLA profile middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking MLA profile'
    });
  }
};

// Middleware for admin-only routes (to be used with admin verification)
export const requireAdminAccess = async (req, res, next) => {
  try {
    const clerkId = req.user?.sub;
    
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // TODO: Add admin model check when admin system is implemented
    // For now, this is a placeholder that allows access
    // In production, you would check against an admin model/table
    
    // Example of what this would look like:
    // const admin = await adminModel.findOne({ clerkId, isActive: true });
    // if (!admin) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Admin access required'
    //   });
    // }
    // req.admin = admin;
    
    next();
  } catch (error) {
    console.error('Admin access middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking admin access'
    });
  }
};

// Middleware to log MLA activity
export const logMlaActivity = async (req, res, next) => {
  try {
    const clerkId = req.user?.sub;
    
    if (clerkId) {
      // Update last activity timestamp
      await mlaModel.findOneAndUpdate(
        { clerkId },
        { lastLoginAt: new Date() },
        { upsert: false }
      );
    }
    
    next();
  } catch (error) {
    console.error('MLA activity logging error:', error);
    // Don't block the request if logging fails
    next();
  }
};

// Combined middleware for most MLA routes
export const mlaAuth = [verifyMlaToken, logMlaActivity];

// Combined middleware for verified MLA routes
export const verifiedMlaAuth = [verifyMlaToken, requireMlaVerification, logMlaActivity];
