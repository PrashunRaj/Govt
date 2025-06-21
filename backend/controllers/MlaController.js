import mlaModel from '../models/mlaModel.js';
import proposalModel from '../models/Proposal.js';
import userModel from '../models/User.js';
import { createNotification } from './notificationController.js'; 


// Add these imports at the top of your MlaController.js
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary (add this after imports)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get MLA Profile
const getMlaProfile = async (req, res) => {
  try {
    const { clerkId } = req.params;

    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: 'ClerkId is required'
      });
    }

    const mla = await mlaModel.findOne({ 
      clerkId, 
      isActive: true 
    }).select('-__v');

    if (!mla) {
      return res.status(404).json({
        success: false,
        message: 'MLA profile not found'
      });
    }

    // Update last login time
    mla.lastLoginAt = new Date();
    mla.loginCount += 1;
    await mla.save();

    return res.status(200).json({
      success: true,
      data: {
        id: mla._id,
        clerkId: mla.clerkId,
        email: mla.email,
        fullName: mla.fullName,
        firstName: mla.firstName,
        lastName: mla.lastName,
        phoneNumber: mla.phoneNumber,
        constituency: mla.constituency,
        district: mla.district,
        state: mla.state,
        politicalParty: mla.politicalParty,
        termStartDate: mla.termStartDate,
        termEndDate: mla.termEndDate,
        isVerified: mla.isVerified,
        verificationStatus: mla.verificationStatus,
        verifiedBy: mla.verifiedBy,
        verifiedAt: mla.verifiedAt,
        verificationNotes: mla.verificationNotes,
        isActive: mla.isActive,
        isBanned: mla.isBanned,
        documents: mla.documents,
        profileCompleted: mla.profileCompleted,
        canAccess: mla.canAccess(),
        createdAt: mla.createdAt,
        updatedAt: mla.updatedAt,
        lastLoginAt: mla.lastLoginAt
      }
    });
  } catch (error) {
    console.error('Error in getMlaProfile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get MLA profile',
      error: error.message
    });
  }
};

// Register/Create MLA Profile
const registerMla = async (req, res) => {
  try {
    const {
      clerkId,
      email,
      fullName,
      firstName,
      lastName,
      phoneNumber,
      constituency,
      district,
      state,
      politicalParty,
      termStartDate,
      termEndDate,
      documents
    } = req.body;

    // Validate required fields
    if (!clerkId || !email || !fullName || !phoneNumber || !constituency || 
        !district || !state || !politicalParty || !termStartDate || !termEndDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if MLA already exists
    const existingMla = await mlaModel.findOne({ clerkId });
    if (existingMla) {
      return res.status(400).json({
        success: false,
        message: 'MLA profile already exists'
      });
    }

    // Check if email is already used
    const existingEmail = await mlaModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new MLA profile
    const newMla = new mlaModel({
      clerkId,
      email: email.toLowerCase().trim(),
      fullName: fullName.trim(),
      firstName: firstName || fullName.split(' ')[0],
      lastName: lastName || fullName.split(' ').slice(1).join(' '),
      phoneNumber: phoneNumber.trim(),
      constituency: constituency.trim(),
      district: district.trim(),
      state: state.trim(),
      politicalParty: politicalParty.trim(),
      termStartDate: new Date(termStartDate),
      termEndDate: new Date(termEndDate),
      documents: documents || {},
      verificationStatus: 'pending',
      isVerified: false,
      isActive: true,
      isBanned: false,
      loginCount: 1,
      lastLoginAt: new Date()
    });

    await newMla.save();

    return res.status(201).json({
      success: true,
      message: 'MLA profile created successfully. Pending admin verification.',
      data: {
        id: newMla._id,
        clerkId: newMla.clerkId,
        email: newMla.email,
        fullName: newMla.fullName,
        constituency: newMla.constituency,
        district: newMla.district,
        state: newMla.state,
        politicalParty: newMla.politicalParty,
        verificationStatus: newMla.verificationStatus,
        profileCompleted: newMla.profileCompleted,
        canAccess: newMla.canAccess(),
        createdAt: newMla.createdAt
      }
    });
  } catch (error) {
    console.error('Error in registerMla:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create MLA profile',
      error: error.message
    });
  }
};

// Update MLA Profile
const updateMlaProfile = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const {
      fullName,
      firstName,
      lastName,
      phoneNumber,
      constituency,
      district,
      state,
      politicalParty,
      termStartDate,
      termEndDate,
      documents
    } = req.body;

    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: 'ClerkId is required'
      });
    }

    // Find and update MLA
    const updatedMla = await mlaModel.findOneAndUpdate(
      { clerkId, isActive: true },
      {
        fullName: fullName?.trim(),
        firstName: firstName || fullName?.split(' ')[0],
        lastName: lastName || fullName?.split(' ').slice(1).join(' '),
        phoneNumber: phoneNumber?.trim(),
        constituency: constituency?.trim(),
        district: district?.trim(),
        state: state?.trim(),
        politicalParty: politicalParty?.trim(),
        termStartDate: termStartDate ? new Date(termStartDate) : undefined,
        termEndDate: termEndDate ? new Date(termEndDate) : undefined,
        documents: documents,
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-__v');

    if (!updatedMla) {
      return res.status(404).json({
        success: false,
        message: 'MLA profile not found or inactive'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'MLA profile updated successfully',
      data: {
        id: updatedMla._id,
        clerkId: updatedMla.clerkId,
        email: updatedMla.email,
        fullName: updatedMla.fullName,
        constituency: updatedMla.constituency,
        district: updatedMla.district,
        state: updatedMla.state,
        politicalParty: updatedMla.politicalParty,
        verificationStatus: updatedMla.verificationStatus,
        profileCompleted: updatedMla.profileCompleted,
        canAccess: updatedMla.canAccess(),
        updatedAt: updatedMla.updatedAt
      }
    });
  } catch (error) {
    console.error('Error in updateMlaProfile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update MLA profile',
      error: error.message
    });
  }
};

// Upload Document - IMPROVED VERSION
const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    const { docType } = req.body;
    const clerkId = req.user?.sub;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    if (!docType || !['identityProof', 'electionCertificate'].includes(docType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type'
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
      folder: `mla-documents/${clerkId}`,
      public_id: `${docType}_${Date.now()}`
    });

    // ✅ ADD THIS: Clean up temporary file after successful upload
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (cleanupError) {
      console.warn('Failed to cleanup temporary file:', cleanupError);
      // Don't fail the request if cleanup fails
    }

    return res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        docType: docType
      }
    });
  } catch (error) {
    console.error('Error in uploadDocument:', error);
    
    // ✅ ADD THIS: Clean up file even if upload fails
    try {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (cleanupError) {
      console.warn('Failed to cleanup temporary file after error:', cleanupError);
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to upload document',
      error: error.message
    });
  }
};

// Admin Functions - Verify MLA
const verifyMla = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { adminClerkId, notes } = req.body;

    if (!adminClerkId) {
      return res.status(400).json({
        success: false,
        message: 'Admin ClerkId is required'
      });
    }

    const mla = await mlaModel.findOne({ clerkId });
    if (!mla) {
      return res.status(404).json({
        success: false,
        message: 'MLA profile not found'
      });
    }

    // Use the model method to verify
    await mla.verifyMLA(adminClerkId, notes);

    return res.status(200).json({
      success: true,
      message: 'MLA verified successfully',
      data: {
        clerkId: mla.clerkId,
        fullName: mla.fullName,
        constituency: mla.constituency,
        verificationStatus: mla.verificationStatus,
        verifiedAt: mla.verifiedAt,
        verifiedBy: mla.verifiedBy
      }
    });
  } catch (error) {
    console.error('Error in verifyMla:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify MLA',
      error: error.message
    });
  }
};

// Admin Functions - Reject Verification
const rejectVerification = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { adminClerkId, reason } = req.body;

    if (!adminClerkId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Admin ClerkId and reason are required'
      });
    }

    const mla = await mlaModel.findOne({ clerkId });
    if (!mla) {
      return res.status(404).json({
        success: false,
        message: 'MLA profile not found'
      });
    }

    // Use the model method to reject
    await mla.rejectVerification(adminClerkId, reason);

    return res.status(200).json({
      success: true,
      message: 'MLA verification rejected',
      data: {
        clerkId: mla.clerkId,
        fullName: mla.fullName,
        constituency: mla.constituency,
        verificationStatus: mla.verificationStatus,
        verificationNotes: mla.verificationNotes,
        verifiedAt: mla.verifiedAt
      }
    });
  } catch (error) {
    console.error('Error in rejectVerification:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reject verification',
      error: error.message
    });
  }
};

// Admin Functions - Ban MLA
const banMla = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { adminClerkId, reason } = req.body;

    if (!adminClerkId) {
      return res.status(400).json({
        success: false,
        message: 'Admin ClerkId is required'
      });
    }

    const mla = await mlaModel.findOne({ clerkId });
    if (!mla) {
      return res.status(404).json({
        success: false,
        message: 'MLA profile not found'
      });
    }

    // Use the model method to ban
    await mla.banMLA(adminClerkId, reason);

    return res.status(200).json({
      success: true,
      message: 'MLA banned successfully',
      data: {
        clerkId: mla.clerkId,
        fullName: mla.fullName,
        constituency: mla.constituency,
        isBanned: mla.isBanned,
        banReason: mla.banReason,
        bannedAt: mla.bannedAt
      }
    });
  } catch (error) {
    console.error('Error in banMla:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to ban MLA',
      error: error.message
    });
  }
};

// Admin Functions - Unban MLA
const unbanMla = async (req, res) => {
  try {
    const { clerkId } = req.params;

    const mla = await mlaModel.findOne({ clerkId });
    if (!mla) {
      return res.status(404).json({
        success: false,
        message: 'MLA profile not found'
      });
    }

    // Use the model method to unban
    await mla.unbanMLA();

    return res.status(200).json({
      success: true,
      message: 'MLA unbanned successfully',
      data: {
        clerkId: mla.clerkId,
        fullName: mla.fullName,
        constituency: mla.constituency,
        isBanned: mla.isBanned,
        isActive: mla.isActive
      }
    });
  } catch (error) {
    console.error('Error in unbanMla:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unban MLA',
      error: error.message
    });
  }
};

// Get All MLAs (for admin)
const getAllMlas = async (req, res) => {
  try {
    const { 
      status = 'all', 
      verificationStatus = 'all',
      page = 1, 
      limit = 10,
      search = ''
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = {};
    if (status !== 'all') {
      if (status === 'active') query.isActive = true;
      if (status === 'banned') query.isBanned = true;
    }
    if (verificationStatus !== 'all') {
      query.verificationStatus = verificationStatus;
    }
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { constituency: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const mlas = await mlaModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-documents -__v');

    const totalMlas = await mlaModel.countDocuments(query);
    const totalPages = Math.ceil(totalMlas / limitNum);

    return res.status(200).json({
      success: true,
      data: {
        mlas,
        pagination: {
          total: totalMlas,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Error in getAllMlas:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get MLAs',
      error: error.message
    });
  }
};

// Add these functions to your existing MlaController.js file

// Check MLA Profile Completion
const checkMlaProfileCompletion = async (req, res) => {
  try {
    const { clerkId } = req.params;

    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: 'ClerkId is required'
      });
    }

    const mla = await mlaModel.findOne({ 
      clerkId, 
      isActive: true 
    }).select('profileCompleted verificationStatus isVerified');

    if (!mla) {
      return res.status(404).json({
        success: false,
        message: 'MLA profile not found',
        profileExists: false
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        profileExists: true,
        profileCompleted: mla.profileCompleted,
        verificationStatus: mla.verificationStatus,
        isVerified: mla.isVerified
      }
    });
  } catch (error) {
    console.error('Error in checkMlaProfileCompletion:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check profile completion',
      error: error.message
    });
  }
};

// Get MLA by ID
const getMlaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'MLA ID is required'
      });
    }

    const mla = await mlaModel.findById(id)
      .select('-documents -__v')
      .lean();

    if (!mla) {
      return res.status(404).json({
        success: false,
        message: 'MLA not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: mla
    });
  } catch (error) {
    console.error('Error in getMlaById:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get MLA',
      error: error.message
    });
  }
};

// Add New MLA (alias for registerMla for consistency with your router)
const addNewMla = registerMla;

// Get MLA Proposals (for verified MLAs)
const getMlaProposals = async (req, res) => {
  try {
    const clerkId = req.user?.sub;
    const { 
      status = 'all',
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Get MLA profile to find constituency
    const mla = await mlaModel.findOne({ clerkId, isActive: true });
    if (!mla) {
      return res.status(404).json({
        success: false,
        message: 'MLA profile not found'
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query for proposals in MLA's constituency
    const query = { constituency: mla.constituency };
    if (status !== 'all') {
      query.status = status;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // ✅ UNCOMMENT AND USE REAL PROPOSAL FETCHING
    const proposals = await proposalModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalProposals = await proposalModel.countDocuments(query);
    const totalPages = Math.ceil(totalProposals / limitNum);

    // Transform proposals to match frontend expectations
    const transformedProposals = proposals.map(proposal => ({
      id: proposal._id,
      title: proposal.title,
      description: proposal.description,
      category: proposal.category,
      budget: proposal.budget,
      beneficiaries: proposal.beneficiaries,
      priority: proposal.priority,
      constituency: proposal.constituency,
      district: proposal.district,
      state: proposal.state,
      location: proposal.location,
      votes: proposal.votes || (proposal.upvotes - proposal.downvotes),
      upvotes: proposal.upvotes,
      downvotes: proposal.downvotes,
      status: proposal.status,
      submittedBy: proposal.authorName || proposal.authorEmail || 'Anonymous',
      submittedDate: new Date(proposal.createdAt).toISOString().split('T')[0],
      image: proposal.image,
      authorId: proposal.author,
      createdAt: proposal.createdAt,
      estimatedDuration: proposal.estimatedDuration,
      progress: proposal.progress || 0
    }));

    return res.status(200).json({
      success: true,
      data: {
        proposals: transformedProposals,
        constituency: mla.constituency,
        pagination: {
          total: totalProposals,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Error in getMlaProposals:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get MLA proposals',
      error: error.message
    });
  }
};

/// Get Proposal Details (for verified MLAs)
const getProposalDetails = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const clerkId = req.user?.sub;

    if (!proposalId) {
      return res.status(400).json({
        success: false,
        message: 'Proposal ID is required'
      });
    }

    // Get MLA profile
    const mla = await mlaModel.findOne({ clerkId, isActive: true });
    if (!mla) {
      return res.status(404).json({
        success: false,
        message: 'MLA profile not found'
      });
    }

    // ✅ FETCH ACTUAL PROPOSAL (instead of placeholder)
    const proposal = await proposalModel.findById(proposalId).lean();
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // ✅ CHECK CONSTITUENCY ACCESS
    if (proposal.constituency !== mla.constituency) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Proposal not in your constituency.'
      });
    }

    // ✅ TRANSFORM DATA WITH SAFE DEFAULTS
    const transformedProposal = {
      id: proposal._id,
      title: proposal.title || 'Untitled Proposal',
      description: proposal.description || 'No description available',
      category: proposal.category || 'Other',
      budget: proposal.budget || 0,
      beneficiaries: proposal.beneficiaries || 0,
      priority: proposal.priority || 'medium', // ✅ Default priority
      constituency: proposal.constituency || 'Unknown',
      district: proposal.district || 'Unknown',
      state: proposal.state || 'Unknown',
      location: proposal.location || '',
      votes: proposal.votes || (proposal.upvotes || 0) - (proposal.downvotes || 0),
      upvotes: proposal.upvotes || 0,
      downvotes: proposal.downvotes || 0,
      status: proposal.status || 'pending', // ✅ Default status
      submittedBy: proposal.authorName || proposal.authorEmail || proposal.submittedBy || 'Anonymous',
      submittedDate: proposal.createdAt ? new Date(proposal.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      estimatedDuration: proposal.estimatedDuration || '',
      progress: proposal.progress || 0,
      image: proposal.image || '',
      authorId: proposal.author || '',
      createdAt: proposal.createdAt || new Date(),
      updatedAt: proposal.updatedAt || new Date()
    };

    return res.status(200).json({
      success: true,
      message: 'Proposal details fetched successfully',
      data: transformedProposal
    });
  } catch (error) {
    console.error('Error in getProposalDetails:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get proposal details',
      error: error.message
    });
  }
};

// Approve Proposal (for verified MLAs)
const approveProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { notes } = req.body;
    const clerkId = req.user?.sub;

    if (!proposalId) {
      return res.status(400).json({
        success: false,
        message: 'Proposal ID is required'
      });
    }

    // Get MLA profile
    const mla = await mlaModel.findOne({ clerkId, isActive: true });
    if (!mla) {
      return res.status(404).json({
        success: false,
        message: 'MLA profile not found'
      });
    }

    // ✅ FETCH AND UPDATE ACTUAL PROPOSAL
    const proposal = await proposalModel.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // ✅ CHECK CONSTITUENCY ACCESS
    if (proposal.constituency !== mla.constituency) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Proposal not in your constituency.'
      });
    }

    // ✅ CHECK IF ALREADY PROCESSED
    if (proposal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Proposal is already ${proposal.status}. Cannot approve.`
      });
    }

    // ✅ UPDATE PROPOSAL STATUS
    proposal.status = 'approved';
    proposal.approvedBy = mla.fullName;
    proposal.approvedAt = new Date();
    proposal.mlaComments = notes || '';
    proposal.updatedAt = new Date();

    await proposal.save();

    // ✅ NEW: Create notification for proposal author
    const notification = await createNotification({
      userId: proposal.author,
      type: 'proposal_approved',
      title: 'Your Proposal Has Been Approved!',
      description: `Your proposal "${proposal.title}" has been approved by ${mla.fullName}`,
      proposalId: proposalId,
      data: {
        proposalTitle: proposal.title,
        constituency: proposal.constituency,
        approvedBy: mla.fullName,
        notes: notes || ''
      }
    });

    // ✅ NEW: Emit real-time notification
    const io = req.app.get('io');
    io.to(`user_${proposal.author}`).emit('new_notification', {
      id: notification._id,
      type: notification.type,
      title: notification.title,
      description: notification.description,
      isRead: false,
      createdAt: notification.createdAt
    });

    // ✅ RETURN UPDATED PROPOSAL DATA
    return res.status(200).json({
      success: true,
      message: 'Proposal approved successfully',
      data: {
        id: proposal._id,
        title: proposal.title,
        status: proposal.status,
        approvedBy: proposal.approvedBy,
        approvedAt: proposal.approvedAt,
        constituency: proposal.constituency,
        notes: proposal.mlaComments,
        budget: proposal.budget,
        category: proposal.category
      }
    });
  } catch (error) {
    console.error('Error in approveProposal:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to approve proposal',
      error: error.message
    });
  }
};
// Reject Proposal (for verified MLAs)
const rejectProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { reason } = req.body;
    const clerkId = req.user?.sub;

    if (!proposalId) {
      return res.status(400).json({
        success: false,
        message: 'Proposal ID is required'
      });
    }

    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    // Get MLA profile
    const mla = await mlaModel.findOne({ clerkId, isActive: true });
    if (!mla) {
      return res.status(404).json({
        success: false,
        message: 'MLA profile not found'
      });
    }

    // ✅ FETCH AND UPDATE ACTUAL PROPOSAL
    const proposal = await proposalModel.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // ✅ CHECK CONSTITUENCY ACCESS
    if (proposal.constituency !== mla.constituency) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Proposal not in your constituency.'
      });
    }

    // ✅ CHECK IF ALREADY PROCESSED
    if (proposal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Proposal is already ${proposal.status}. Cannot reject.`
      });
    }

    // ✅ UPDATE PROPOSAL STATUS
    proposal.status = 'rejected';
    proposal.rejectedBy = mla.fullName;
    proposal.rejectedAt = new Date();
    proposal.rejectionReason = reason.trim();
    proposal.mlaComments = reason.trim();
    proposal.updatedAt = new Date();

    await proposal.save();

    // ✅ NEW: Create notification for proposal author
    const notification = await createNotification({
      userId: proposal.author,
      type: 'proposal_rejected',
      title: 'Your Proposal Has Been Rejected',
      description: `Your proposal "${proposal.title}" has been rejected by ${mla.fullName}`,
      proposalId: proposalId,
      data: {
        proposalTitle: proposal.title,
        constituency: proposal.constituency,
        rejectedBy: mla.fullName,
        reason: reason.trim()
      }
    });

    // ✅ NEW: Emit real-time notification
    const io = req.app.get('io');
    io.to(`user_${proposal.author}`).emit('new_notification', {
      id: notification._id,
      type: notification.type,
      title: notification.title,
      description: notification.description,
      isRead: false,
      createdAt: notification.createdAt
    });

    // ✅ RETURN UPDATED PROPOSAL DATA
    return res.status(200).json({
      success: true,
      message: 'Proposal rejected successfully',
      data: {
        id: proposal._id,
        title: proposal.title,
        status: proposal.status,
        rejectedBy: proposal.rejectedBy,
        rejectedAt: proposal.rejectedAt,
        rejectionReason: proposal.rejectionReason,
        constituency: proposal.constituency
      }
    });
  } catch (error) {
    console.error('Error in rejectProposal:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reject proposal',
      error: error.message
    });
  }
};

// Update Proposal Status (for verified MLAs)
const updateProposalStatus = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { status, notes, progress } = req.body;
    const clerkId = req.user?.sub;

    if (!proposalId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Proposal ID and status are required'
      });
    }

    const validStatuses = ['pending', 'approved', 'rejected', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses: ' + validStatuses.join(', ')
      });
    }

    // Get MLA profile
    const mla = await mlaModel.findOne({ clerkId, isActive: true });
    if (!mla) {
      return res.status(404).json({
        success: false,
        message: 'MLA profile not found'
      });
    }

    // ✅ FETCH AND UPDATE ACTUAL PROPOSAL
    const proposal = await proposalModel.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // ✅ CHECK CONSTITUENCY ACCESS
    if (proposal.constituency !== mla.constituency) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Proposal not in your constituency.'
      });
    }

    // ✅ VALIDATE STATUS TRANSITIONS
    const validTransitions = {
      'pending': ['approved', 'rejected'],
      'approved': ['in_progress', 'rejected'],
      'in_progress': ['in_progress','completed', 'approved'],
      'completed': [], // Cannot change from completed
      'rejected': ['pending'] // Can reopen rejected proposals
    };

    if (!validTransitions[proposal.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${proposal.status} to ${status}`
      });
    }

    // ✅ UPDATE PROPOSAL
    const oldStatus = proposal.status;
    proposal.status = status;
    proposal.lastUpdatedBy = mla.fullName;
    proposal.updatedAt = new Date();

    // Add status-specific fields
    if (status === 'approved' && oldStatus === 'pending') {
      proposal.approvedBy = mla.fullName;
      proposal.approvedAt = new Date();
    } else if (status === 'in_progress') {
      proposal.startedAt = proposal.startedAt || new Date();
    } else if (status === 'completed') {
      proposal.completedAt = new Date();
      proposal.progress = 100;
    }

    // Update progress if provided
    if (progress !== undefined && progress >= 0 && progress <= 100) {
      proposal.progress = parseInt(progress);
    }

    // Add notes if provided
    if (notes && notes.trim()) {
      proposal.mlaComments = notes.trim();
    }

    await proposal.save();

    // ✅ NEW: Create notification for significant status changes
    if (status === 'completed') {
      const notification = await createNotification({
        userId: proposal.author,
        type: 'proposal_completed',
        title: 'Your Proposal Has Been Completed!',
        description: `Your proposal "${proposal.title}" has been successfully completed`,
        proposalId: proposalId,
        data: {
          proposalTitle: proposal.title,
          constituency: proposal.constituency,
          completedBy: mla.fullName,
          notes: notes || ''
        }
      });

      // ✅ NEW: Emit real-time notification
      const io = req.app.get('io');
      io.to(`user_${proposal.author}`).emit('new_notification', {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        description: notification.description,
        isRead: false,
        createdAt: notification.createdAt
      });
    }

    // ✅ RETURN UPDATED PROPOSAL DATA
    return res.status(200).json({
      success: true,
      message: `Proposal status updated from ${oldStatus} to ${status}`,
      data: {
        id: proposal._id,
        title: proposal.title,
        oldStatus: oldStatus,
        newStatus: proposal.status,
        progress: proposal.progress,
        updatedBy: proposal.lastUpdatedBy,
        updatedAt: proposal.updatedAt,
        constituency: proposal.constituency,
        notes: proposal.mlaComments
      }
    });
  } catch (error) {
    console.error('Error in updateProposalStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update proposal status',
      error: error.message
    });
  }
};



// Get Constituency Analytics (for verified MLAs)
// Get Constituency Analytics (for verified MLAs) - CORRECTED VERSION
const getConstituencyAnalytics = async (req, res) => {
  try {
    const clerkId = req.user?.sub;
    const { timeRange = '30days' } = req.query;

    // Get MLA profile
    const mla = await mlaModel.findOne({ clerkId, isActive: true });
    if (!mla) {
      return res.status(404).json({
        success: false,
        message: 'MLA profile not found'
      });
    }

    // Calculate date range
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default: // 30days
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get proposals for this constituency
    const allProposals = await proposalModel.find({ 
      constituency: mla.constituency,
      createdAt: { $gte: startDate }
    }).lean();

    const previousPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const previousProposals = await proposalModel.find({
      constituency: mla.constituency,
      createdAt: { $gte: previousPeriodStart, $lt: startDate }
    }).lean();

    // ✅ CORRECTED: Define approved statuses
    const approvedStatuses = ['approved', 'in_progress', 'completed'];

    // Calculate overview stats
    const totalProposals = allProposals.length;
    const approvedProposals = allProposals.filter(p => approvedStatuses.includes(p.status)).length;
    const rejectedProposals = allProposals.filter(p => p.status === 'rejected').length;
    const pendingProposals = allProposals.filter(p => ['pending', 'under_review'].includes(p.status)).length;
    const completedProjects = allProposals.filter(p => p.status === 'completed').length;
    const totalVotes = allProposals.reduce((sum, p) => sum + (p.votes || 0), 0);
    const budgetAllocated = allProposals
      .filter(p => approvedStatuses.includes(p.status))
      .reduce((sum, p) => sum + (p.budget || 0), 0);

    // Calculate changes from previous period
    const prevTotal = previousProposals.length;
    const prevApproved = previousProposals.filter(p => approvedStatuses.includes(p.status)).length;
    const prevRejected = previousProposals.filter(p => p.status === 'rejected').length;
    const prevPending = previousProposals.filter(p => ['pending', 'under_review'].includes(p.status)).length;

    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // ✅ CORRECTED: Get monthly trends with proper approved calculation
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthProposals = allProposals.filter(p => {
        const createdAt = new Date(p.createdAt);
        return createdAt >= monthStart && createdAt <= monthEnd;
      });

      monthlyTrends.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        proposals: monthProposals.length,
        approved: monthProposals.filter(p => approvedStatuses.includes(p.status)).length, // ✅ CORRECTED
        rejected: monthProposals.filter(p => p.status === 'rejected').length,
        pending: monthProposals.filter(p => ['pending', 'under_review'].includes(p.status)).length
      });
    }

    // Get category breakdown
    const categoryBreakdown = {};
    allProposals.forEach(p => {
      const category = p.category || 'Other';
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
    });

    const categoryData = Object.entries(categoryBreakdown)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / totalProposals) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    // Get recent activity
    const recentActivity = allProposals
      .filter(p => p.reviewDate || p.approvalDate)
      .sort((a, b) => {
        const dateA = new Date(a.reviewDate || a.approvalDate || a.updatedAt);
        const dateB = new Date(b.reviewDate || b.approvalDate || b.updatedAt);
        return dateB - dateA;
      })
      .slice(0, 5)
      .map(p => ({
        action: approvedStatuses.includes(p.status) ? 'Approved' : 
                p.status === 'rejected' ? 'Rejected' : 'Under Review',
        proposal: p.title,
        time: getTimeAgo(p.reviewDate || p.approvalDate || p.updatedAt),
        status: p.status
      }));

    // Get unique citizens who submitted proposals
    const uniqueCitizens = new Set(allProposals.map(p => p.author)).size;

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          totalProposals,
          approvedProposals,
          rejectedProposals,
          pendingProposals,
          completedProjects,
          totalVotes,
          budgetAllocated,
          activeCitizens: uniqueCitizens,
          proposalsChange: calculateChange(totalProposals, prevTotal),
          approvedChange: calculateChange(approvedProposals, prevApproved),
          rejectedChange: calculateChange(rejectedProposals, prevRejected),
          pendingChange: calculateChange(pendingProposals, prevPending)
        },
        monthlyTrends,
        categoryBreakdown: categoryData,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Error in getConstituencyAnalytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get constituency analytics',
      error: error.message
    });
  }
};



// GET heatmap proposals for MLA
const getHeatmapProposals = async (req, res) => {
  try {
    const clerkId = req.user?.sub;
    
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get MLA profile
    const mla = await mlaModel.findOne({ clerkId, isActive: true });
    
    if (!mla) {
      return res.status(404).json({
        success: false,
        message: 'MLA profile not found'
      });
    }

    const { page = 1, limit = 500, status, category, scope = 'constituency' } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // ✅ UPDATED: Build filter based on MLA's jurisdiction
    const filter = {
      coordinates: { $exists: true, $ne: null }
    };
    
    // ✅ SCOPE-BASED FILTERING
    switch (scope) {
      case 'constituency':
        filter.constituency = mla.constituency;
        break;
      case 'district':
        filter.district = mla.district;
        break;
      case 'state':
        filter.state = mla.state;
        break;
      case 'all':
        // No additional filter - show all (for comparative analysis)
        break;
      default:
        filter.constituency = mla.constituency; // Default to constituency
    }
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    // Rest of the controller remains the same...
    const proposals = await proposalModel.find(filter)
      .populate('author', 'fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('title description category status budget votes priority coordinates constituency district state createdAt author');
    
    // Format proposals for frontend
    const formattedProposals = proposals.map(proposal => ({
      _id: proposal._id,
      title: proposal.title,
      description: proposal.description,
      category: proposal.category,
      status: proposal.status,
      budget: proposal.budget,
      votes: proposal.votes,
      priority: proposal.priority,
      coordinates: proposal.coordinates,
      constituency: proposal.constituency,
      district: proposal.district,
      state: proposal.state,
      submittedBy: proposal.author?.fullName || 'Anonymous',
      createdAt: proposal.createdAt
    }));
    
    const totalProposals = await proposalModel.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      message: "Heatmap proposals fetched successfully",
      data: {
        proposals: formattedProposals,
        mlaInfo: {
          constituency: mla.constituency,
          district: mla.district,
          state: mla.state,
          currentScope: scope
        },
        pagination: {
          total: totalProposals,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalProposals / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching heatmap proposals:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch heatmap proposals",
      error: error.message
    });
  }
};




// Update your export statement to include all functions
export {
  getMlaProfile,
  registerMla,
  addNewMla,
  updateMlaProfile,
  uploadDocument,
  checkMlaProfileCompletion,
  getMlaById,
  getMlaProposals,
  getProposalDetails,
  approveProposal,
  rejectProposal,
  updateProposalStatus,
  getConstituencyAnalytics,
 
  verifyMla,
  rejectVerification,
  banMla,
  unbanMla,
  getAllMlas,
  getHeatmapProposals
};
