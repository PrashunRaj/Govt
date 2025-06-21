import userModel from '../models/User.js';
import mlaModel from '../models/mlaModel.js';
import proposalModel from '../models/Proposal.js';

// GET dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    console.log('📊 Fetching dashboard stats for admin:', req.user?.email);
    
    // Get total counts
    const totalUsers = await userModel.countDocuments({ isActive: true });
    const totalMLAs = await mlaModel.countDocuments();
    const totalProposals = await proposalModel.countDocuments();
    
    // Get MLA verification stats
    const pendingMLAs = await mlaModel.countDocuments({ 
      verificationStatus: 'pending' 
    });
    const verifiedMLAs = await mlaModel.countDocuments({ 
      verificationStatus: 'verified' 
    });
    
    // Get proposal status stats
    const activeProposals = await proposalModel.countDocuments({ 
      status: { $in: ['pending', 'approved', 'in_progress'] }
    });
    const completedProposals = await proposalModel.countDocuments({ 
      status: 'completed' 
    });
    const rejectedProposals = await proposalModel.countDocuments({ 
      status: 'rejected' 
    });
    
    // Get recent activity
    const recentUsers = await userModel.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('fullName constituency createdAt');
      
    const recentMLAs = await mlaModel.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name constituency verificationStatus createdAt');
      
    const recentProposals = await proposalModel.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title constituency status createdAt');
    
    // Format recent activity
    const recentActivity = [
      ...recentUsers.map(user => ({
        id: `user_${user._id}`,
        type: 'user_registered',
        message: `New user registered from ${user.constituency}`,
        time: getTimeAgo(user.createdAt),
        data: { userId: user._id, name: user.fullName }
      })),
      ...recentMLAs.map(mla => ({
        id: `mla_${mla._id}`,
        type: mla.verificationStatus === 'verified' ? 'mla_verified' : 'mla_pending',
        message: `MLA ${mla.verificationStatus === 'verified' ? 'verified' : 'applied'} from ${mla.constituency}`,
        time: getTimeAgo(mla.createdAt),
        data: { mlaId: mla._id, name: mla.name }
      })),
      ...recentProposals.map(proposal => ({
        id: `proposal_${proposal._id}`,
        type: 'proposal_submitted',
        message: `New proposal "${proposal.title}" from ${proposal.constituency}`,
        time: getTimeAgo(proposal.createdAt),
        data: { proposalId: proposal._id, title: proposal.title }
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

    console.log('✅ Dashboard stats fetched successfully');

    res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: {
        totalUsers,
        totalMLAs,
        totalProposals,
        pendingMLAs,
        verifiedMLAs,
        activeProposals,
        completedProposals,
        rejectedProposals,
        recentActivity
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
};

// GET all MLAs
const getAllMLAs = async (req, res) => {
  try {
    const { page = 1, limit = 10, state, constituency, status } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Build filter query
    const filter = {};
    if (state) filter.state = state;
    if (constituency) filter.constituency = constituency;
    if (status) filter.verificationStatus = status;
    
    const mlas = await mlaModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-password');
    
    const totalMLAs = await mlaModel.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      message: "MLAs fetched successfully",
      data: {
        mlas,
        pagination: {
          total: totalMLAs,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalMLAs / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching MLAs:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch MLAs",
      error: error.message
    });
  }
};

// GET all users

// GET all users with activity statistics
// GET all users - UPDATED to show all users (active and banned)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, state, constituency, status } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // ✅ FIXED: Build filter query without default isActive filter
    const filter = {};
    if (state) filter.state = state;
    if (constituency) filter.constituency = constituency;
    if (status === 'active') filter.isActive = true;
    if (status === 'banned') filter.isActive = false;
    // ✅ If no status filter, show ALL users (active and banned)
    
    const users = await userModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-password');
    
    const totalUsers = await userModel.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: {
        users,
        pagination: {
          total: totalUsers,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalUsers / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
};



// POST toggle user status - FIXED for route parameters
const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params; // ✅ FIXED: Get userId from URL params
    const { action } = req.body;   // Get action from body
    
    if (!['ban', 'unban'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action"
      });
    }
    
    const user = await userModel.findByIdAndUpdate(
      userId,
      { isActive: action === 'unban' },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: `User ${action}ned successfully`,
      data: user
    });

  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message
    });
  }
};


const verifyMLA = async (req, res) => {
  try {
    const { status, remarks } = req.body; 
    const { mlaId } = req.params; // ✅ CHANGED: Get mlaId from URL params instead of body
    
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification status"
      });
    }
    
    const mla = await mlaModel.findByIdAndUpdate(
      mlaId,
      { 
        verificationStatus: status,
        verificationRemarks: remarks, // ✅ UPDATED: Changed from verificationNotes to verificationRemarks
        verifiedAt: status === 'verified' ? new Date() : null
      },
      { new: true }
    );
    
    if (!mla) {
      return res.status(404).json({
        success: false,
        message: "MLA not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: `MLA ${status} successfully`,
      data: mla
    });

  } catch (error) {
    console.error('Error verifying MLA:', error);
    res.status(500).json({
      success: false,
      message: "Failed to verify MLA",
      error: error.message
    });
  }
};


// POST toggle user status (instead of PUT)


// Helper function
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} weeks ago`;
};

export {
  getDashboardStats,
  getAllMLAs,
  getAllUsers,
  verifyMLA,
  toggleUserStatus
};
