import proposalModel from "../models/Proposal.js";
import { createNotification } from './notificationController.js';
import commentModel from "../models/Comment.js";
import userModel from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";






const addProposal = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            category, 
            priority, 
            budget, 
            beneficiaries, 
            location, 
            estimatedDuration,
            latitude,
            longitude,
            constituency,
            district,
            state
        } = req.body;
        
        const file = req.file;
        console.log("File received:", file);
        console.log("Request body:", req.body);

        // Get user info from JWT token
        const clerkId = req.user?.sub;
        if (!clerkId) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required" 
            });
        }

        // Validate required fields
        if (!title || !description || !category || !budget || !constituency || !district || !state) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields: title, description, category, budget, constituency, district, state" 
            });
        }

        // Get user details for author information
        const user = await userModel.findOne({ clerkId, isActive: true });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Handle image upload
        let imageUrl = "data:image/png;base64,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... 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";
        
        if (file) {
            console.log("Uploading image to Cloudinary...");
            const result = await cloudinary.uploader.upload(file.path, { 
                resource_type: "image",
                folder: "proposals"
            });
            imageUrl = result.secure_url;
        }

        // Prepare coordinates object
        const coordinates = {};
        if (latitude && longitude) {
            coordinates.latitude = parseFloat(latitude);
            coordinates.longitude = parseFloat(longitude);
        }

        // Create new proposal with all fields
        const newProposal = new proposalModel({
            title: title.trim(),
            description: description.trim(),
            image: imageUrl,
            category,
            priority: priority || 'medium',
            budget: parseInt(budget),
            beneficiaries: beneficiaries ? parseInt(beneficiaries) : 0,
            constituency,
            district,
            state,
            location: location?.trim() || '',
            coordinates: Object.keys(coordinates).length > 0 ? coordinates : undefined,
            author: clerkId,
            authorEmail: user.email,
            authorName: user.fullName,
            estimatedDuration: estimatedDuration || '',
            status: 'pending',
            upvotes: 0,
            downvotes: 0,
            votes: 0,
            viewCount: 0,
            progress: 0
        });

        await newProposal.save();
        
        console.log("Proposal saved successfully:", newProposal._id);

        // ✅ NEW: Find all users in the same constituency (excluding the author)
        const constituencyUsers = await userModel.find({
            constituency: constituency,
            clerkId: { $ne: clerkId }, // Exclude the proposal author
            isActive: true
        });

        // ✅ NEW: Create notifications for all users in the constituency
        const io = req.app.get('io');
        
        for (const constituencyUser of constituencyUsers) {
            const notification = await createNotification({
                userId: constituencyUser.clerkId,
                type: 'new_proposal',
                title: 'New Proposal in Your Constituency',
                description: `${user.fullName} submitted a new ${category.toLowerCase()} proposal: "${title}"`,
                proposalId: newProposal._id,
                data: {
                    proposalTitle: title,
                    constituency: constituency,
                    authorName: user.fullName,
                    category: category,
                    budget: budget
                }
            });

            // ✅ NEW: Emit real-time notification to each user
            io.to(`user_${constituencyUser.clerkId}`).emit('new_notification', {
                id: notification._id,
                type: notification.type,
                title: notification.title,
                description: notification.description,
                isRead: false,
                createdAt: notification.createdAt
            });
        }

        // ✅ NEW: Emit new proposal event for real-time proposal list updates
        io.to(`constituency_${constituency}`).emit('new_proposal_submitted', {
            id: newProposal._id,
            title: newProposal.title,
            category: newProposal.category,
            constituency: newProposal.constituency,
            authorName: user.fullName,
            createdAt: newProposal.createdAt
        });
        
        res.json({
            success: true, 
            message: "Proposal submitted successfully! It will be reviewed by your local representative.",
            data: {
                id: newProposal._id,
                title: newProposal.title,
                status: newProposal.status,
                constituency: newProposal.constituency
            }
        });

    } catch (error) {
        console.error("Error in addProposal:", error);
        res.status(500).json({
            success: false, 
            message: "Failed to submit proposal. Please try again.",
            error: error.message
        });
    }
};


const getAllProposals = async (req, res) => {
  try {
    const { 
      status, 
      category, 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      search
    } = req.query;

    // ✅ Get user's constituency information
    const clerkId = req.user?.sub;
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get user profile to determine constituency
    const userProfile = await userModel.findOne({ clerkId }).select('constituency district state');
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // ✅ FIXED: Only show proposals from user's constituency
    const query = {
      constituency: userProfile.constituency // Only user's constituency
    };
    console.log("Querying proposals with filters:",userProfile.constituency);
    
    // Add other filters if provided
    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = category;
    
    // Add search functionality
    if (search) {
      query.$or =[
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Create sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Find proposals with filters, pagination and sorting
    const proposals = await proposalModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const totalProposals = await proposalModel.countDocuments(query);
    const totalPages = Math.ceil(totalProposals / limitNum);

    // Transform data to match frontend expectations
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
      coordinates: proposal.coordinates,
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
        userInfo: {
          constituency: userProfile.constituency,
          district: userProfile.district,
          state: userProfile.state
        },
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
    console.error('Error in getAllProposals:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get proposals',
      error: error.message
    });
  }
};


const getComments = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    if (!proposalId) {
      return res.status(400).json({ 
        success: false,
        message: "Proposal ID is required." 
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Fetch comments with pagination
    const comments = await commentModel.find({ proposalId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('replies')
      .lean();

    const totalComments = await commentModel.countDocuments({ proposalId });

    if (comments.length === 0) {
      return res.status(200).json({ 
        success: true,
        message: "No comments found for this proposal.",
        data: {
          comments: [],
          pagination: {
            total: 0,
            page: pageNum,
            limit: limitNum,
            totalPages: 0
          }
        }
      });
    }
    console.log("Comments fetched successfully:", comments);
    res.status(200).json({ 
      success: true,
      message: "Comments fetched successfully!", 
      data: {
        comments,
        pagination: {
          total: totalComments,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalComments / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch comments.",
      error: error.message 
    });
  }
};

// const addComment = async (req, res) => {
//   try {
//     const { proposalId, content } = req.body; // Changed from 'comment' to 'content'
//     const clerkId = req.user?.sub;

//     if (!clerkId) {
//       return res.status(401).json({
//         success: false,
//         message: 'Authentication required'
//       });
//     }

//     if (!proposalId || !content) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Proposal ID and content are required." 
//       });
//     }

//     // Get user details
//     const user = await userModel.findOne({ clerkId, isActive: true });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     const newComment = new commentModel({
//       proposalId,
//       user: user.fullName, // Use fullName from user model
//       avatar: "/api/placeholder/40/40", // Default avatar
//       comment: content, // Use 'content' field
//       parentCommentId: null // Top-level comment
//     });

//     await newComment.save();

//     // Add comment to proposal's comments array
//     await proposalModel.findByIdAndUpdate(proposalId, {
//       $push: { comments: newComment._id }
//     });

//     console.log("Comment added successfully:", newComment);

//     res.status(201).json({ 
//       success: true,
//       message: "Comment added successfully!", 
//       data: newComment 
//     });
//   } catch (error) {
//     console.error('Error adding comment:', error);
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to add comment.",
//       error: error.message 
//     });
//   }
// };



const addComment = async (req, res) => {
  try {
    const { proposalId, content } = req.body;
    const clerkId = req.user?.sub;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!proposalId || !content) {
      return res.status(400).json({ 
        success: false,
        message: "Proposal ID and content are required." 
      });
    }

    // Get user details
    const user = await userModel.findOne({ clerkId, isActive: true });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const newComment = new commentModel({
      proposalId,
      user: user.fullName,
      avatar: "/api/placeholder/40/40",
      comment: content,
      parentCommentId: null
    });

    await newComment.save();

    // Add comment to proposal's comments array
    await proposalModel.findByIdAndUpdate(proposalId, {
      $push: { comments: newComment._id }
    });

    // ✅ NEW: Get proposal details for notification
    const proposal = await proposalModel.findById(proposalId);
    
    // ✅ NEW: Create notification for proposal author (if not commenting on own proposal)
    if (proposal && proposal.author !== clerkId) {
      const notification = await createNotification({
        userId: proposal.author,
        type: 'comment_received',
        title: 'New Comment on Your Proposal',
        description: `${user.fullName} commented on "${proposal.title}"`,
        proposalId: proposalId,
        data: {
          proposalTitle: proposal.title,
          constituency: proposal.constituency,
          authorName: user.fullName,
          commentId: newComment._id
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

    // ✅ NEW: Emit real-time comment to proposal viewers
    const io = req.app.get('io');
    io.to(`proposal_${proposalId}`).emit('new_comment', {
      id: newComment._id,
      proposalId: newComment.proposalId,
      user: newComment.user,
      comment: newComment.comment,
      createdAt: newComment.createdAt,
      replies: []
    });

    console.log("Comment added successfully:", newComment);

    res.status(201).json({ 
      success: true,
      message: "Comment added successfully!", 
      data: newComment 
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to add comment.",
      error: error.message 
    });
  }
};





// const voteOnProposal = async (req, res) => {
//   try {
//     const { proposalId, voteType } = req.body; 
//     const clerkId = req.user?.sub;

//     if (!clerkId) {
//       return res.status(401).json({
//         success: false,
//         message: 'Authentication required'
//       });
//     }

//     if (!proposalId || !["upvote", "downvote"].includes(voteType)) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Invalid vote data." 
//       });
//     }

//     const proposal = await proposalModel.findById(proposalId);
//     if (!proposal) {
//       return res.status(404).json({ 
//         success: false,
//         message: "Proposal not found." 
//       });
//     }

//     const liked = proposal.likedBy.includes(clerkId);
//     const disliked = proposal.dislikedBy.includes(clerkId);

//     // Toggle Logic
//     if (voteType === "upvote") {
//       if (liked) {
//         // Already liked → remove like
//         proposal.likedBy.pull(clerkId);
//         proposal.upvotes = Math.max(0, proposal.upvotes - 1);
//       } else {
//         // Add like
//         proposal.likedBy.push(clerkId);
//         proposal.upvotes++;

//         // If previously disliked, remove dislike
//         if (disliked) {
//           proposal.dislikedBy.pull(clerkId);
//           proposal.downvotes = Math.max(0, proposal.downvotes - 1);
//         }
//       }
//     } else if (voteType === "downvote") {
//       if (disliked) {
//         // Already disliked → remove dislike
//         proposal.dislikedBy.pull(clerkId);
//         proposal.downvotes = Math.max(0, proposal.downvotes - 1);
//       } else {
//         // Add dislike
//         proposal.dislikedBy.push(clerkId);
//         proposal.downvotes++;

//         // If previously liked, remove like
//         if (liked) {
//           proposal.likedBy.pull(clerkId);
//           proposal.upvotes = Math.max(0, proposal.upvotes - 1);
//         }
//       }
//     }

//     // Update net votes
//     proposal.votes = proposal.upvotes - proposal.downvotes;
//     await proposal.save();

//     res.status(200).json({ 
//       success: true,
//       message: "Vote updated successfully.",
//       data: {
//         votes: proposal.votes,
//         upvotes: proposal.upvotes,
//         downvotes: proposal.downvotes
//       }
//     });
//   } catch (error) {
//     console.error("Vote error:", error);
//     res.status(500).json({ 
//       success: false,
//       message: "Server error while voting.",
//       error: error.message 
//     });
//   }
// };

const voteOnProposal = async (req, res) => {
  try {
    const { proposalId, voteType } = req.body; 
    const clerkId = req.user?.sub;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!proposalId || !["upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid vote data." 
      });
    }

    const proposal = await proposalModel.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ 
        success: false,
        message: "Proposal not found." 
      });
    }

    // Get user details for notification
    const user = await userModel.findOne({ clerkId, isActive: true });

    const liked = proposal.likedBy.includes(clerkId);
    const disliked = proposal.dislikedBy.includes(clerkId);
    let shouldNotify = false;

    // Toggle Logic
    if (voteType === "upvote") {
      if (liked) {
        // Already liked → remove like
        proposal.likedBy.pull(clerkId);
        proposal.upvotes = Math.max(0, proposal.upvotes - 1);
      } else {
        // Add like
        proposal.likedBy.push(clerkId);
        proposal.upvotes++;
        shouldNotify = true; // ✅ NEW: Notify on new upvote

        // If previously disliked, remove dislike
        if (disliked) {
          proposal.dislikedBy.pull(clerkId);
          proposal.downvotes = Math.max(0, proposal.downvotes - 1);
        }
      }
    } else if (voteType === "downvote") {
      if (disliked) {
        // Already disliked → remove dislike
        proposal.dislikedBy.pull(clerkId);
        proposal.downvotes = Math.max(0, proposal.downvotes - 1);
      } else {
        // Add dislike
        proposal.dislikedBy.push(clerkId);
        proposal.downvotes++;

        // If previously liked, remove like
        if (liked) {
          proposal.likedBy.pull(clerkId);
          proposal.upvotes = Math.max(0, proposal.upvotes - 1);
        }
      }
    }

    // Update net votes
    proposal.votes = proposal.upvotes - proposal.downvotes;
    await proposal.save();

    // ✅ NEW: Emit real-time vote update to all proposal viewers
    const io = req.app.get('io');
    io.to(`proposal_${proposalId}`).emit('vote_updated', {
      proposalId: proposalId,
      votes: proposal.votes,
      upvotes: proposal.upvotes,
      downvotes: proposal.downvotes
    });

    console.log('Emitted vote_updated:', { // ✅ Debug log
      proposalId: proposalId,
      votes: proposal.votes,
      upvotes: proposal.upvotes,
      downvotes: proposal.downvotes
    });

    // ✅ NEW: Create notification for upvotes (not downvotes to avoid spam)
    if (shouldNotify && proposal.author !== clerkId && user) {
      const notification = await createNotification({
        userId: proposal.author,
        type: 'upvote_received',
        title: 'Your Proposal Received an Upvote',
        description: `${user.fullName} upvoted your proposal "${proposal.title}"`,
        proposalId: proposalId,
        data: {
          proposalTitle: proposal.title,
          constituency: proposal.constituency,
          authorName: user.fullName,
          currentVotes: proposal.votes
        }
      });

      // ✅ NEW: Emit real-time notification
      io.to(`user_${proposal.author}`).emit('new_notification', {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        description: notification.description,
        isRead: false,
        createdAt: notification.createdAt
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Vote updated successfully.",
      data: {
        votes: proposal.votes,
        upvotes: proposal.upvotes,
        downvotes: proposal.downvotes
      }
    });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while voting.",
      error: error.message 
    });
  }
};




const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.body; // Removed userId, get from auth
    const clerkId = req.user?.sub;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!commentId) {
      return res.status(400).json({ 
        success: false,
        message: "Comment ID is required." 
      });
    }

    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ 
        success: false,
        message: "Comment not found." 
      });
    }

    const alreadyLiked = comment.likedBy.includes(clerkId);

    if (alreadyLiked) {
      comment.likedBy.pull(clerkId);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.likedBy.push(clerkId);
      comment.likes++;
    }

    await comment.save();
    
    res.status(200).json({ 
      success: true,
      message: "Comment like toggled successfully",
      data: {
        likes: comment.likes,
        isLiked: !alreadyLiked
      }
    });

  } catch (error) {
    console.error("Error toggling comment like:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while toggling like.",
      error: error.message 
    });
  }
};



// const addReply = async (req, res) => {
//   try {
//     const { content, commentId } = req.body; // Changed from 'comment' to 'content'
//     const clerkId = req.user?.sub;

//     if (!clerkId) {
//       return res.status(401).json({
//         success: false,
//         message: 'Authentication required'
//       });
//     }

//     if (!content || !commentId) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Content and comment ID are required." 
//       });
//     }

//     // Get user details
//     const user = await userModel.findOne({ clerkId, isActive: true });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // Get parent comment to get proposalId
//     const parentComment = await commentModel.findById(commentId);
//     if (!parentComment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Parent comment not found'
//       });
//     }

//     const newReply = await commentModel.create({
//       comment: content, // Use 'content' field
//       proposalId: parentComment.proposalId,
//       user: user.fullName,
//       avatar: "/api/placeholder/40/40",
//       parentCommentId: commentId,
//     });

//     // Add reply to parent comment's replies array
//     await commentModel.findByIdAndUpdate(commentId, {
//       $push: { replies: newReply._id },
//     });

//     res.status(201).json({ 
//       success: true,
//       message: "Reply added successfully", 
//       data: newReply 
//     });

//   } catch (error) {
//     console.error("Error adding reply:", error);
//     res.status(500).json({ 
//       success: false,
//       message: "Server error while adding reply.",
//       error: error.message 
//     });
//   }
// };

const addReply = async (req, res) => {
  try {
    const { content, commentId } = req.body;
    const clerkId = req.user?.sub;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!content || !commentId) {
      return res.status(400).json({ 
        success: false,
        message: "Content and comment ID are required." 
      });
    }

    // Get user details
    const user = await userModel.findOne({ clerkId, isActive: true });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get parent comment to get proposalId
    const parentComment = await commentModel.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({
        success: false,
        message: 'Parent comment not found'
      });
    }

    const newReply = await commentModel.create({
      comment: content,
      proposalId: parentComment.proposalId,
      user: user.fullName,
      avatar: "/api/placeholder/40/40",
      parentCommentId: commentId,
    });

    // Add reply to parent comment's replies array
    await commentModel.findByIdAndUpdate(commentId, {
      $push: { replies: newReply._id },
    });

    // ✅ NEW: Get proposal and parent comment author for notifications
    const proposal = await proposalModel.findById(parentComment.proposalId);
    
    // ✅ NEW: Create notification for comment author (if not replying to own comment)
    if (parentComment.user !== user.fullName) {
      // Find the comment author's clerkId
      const commentAuthor = await userModel.findOne({ fullName: parentComment.user });
      
      if (commentAuthor) {
        const notification = await createNotification({
          userId: commentAuthor.clerkId,
          type: 'reply_received',
          title: 'New Reply to Your Comment',
          description: `${user.fullName} replied to your comment on "${proposal?.title || 'a proposal'}"`,
          proposalId: parentComment.proposalId,
          data: {
            proposalTitle: proposal?.title,
            constituency: proposal?.constituency,
            authorName: user.fullName,
            commentId: commentId,
            replyId: newReply._id
          }
        });

        // ✅ NEW: Emit real-time notification
        const io = req.app.get('io');
        io.to(`user_${commentAuthor.clerkId}`).emit('new_notification', {
          id: notification._id,
          type: notification.type,
          title: notification.title,
          description: notification.description,
          isRead: false,
          createdAt: notification.createdAt
        });
      }
    }

    // ✅ FIXED: Emit real-time reply with complete data structure
    const io = req.app.get('io');
    io.to(`proposal_${parentComment.proposalId}`).emit('new_reply', {
      commentId: commentId,
      reply: {
        id: newReply._id,           // Send as 'id'
        _id: newReply._id,          // Also send as '_id' for compatibility
        comment: newReply.comment,
        content: newReply.comment,  // Add both 'comment' and 'content' fields
        user: newReply.user,
        createdAt: newReply.createdAt,
        likes: 0,                   // Initialize likes
        avatar: "/api/placeholder/40/40",
        parentCommentId: commentId  // Include parent reference
      }
    });

    res.status(201).json({ 
      success: true,
      message: "Reply added successfully", 
      data: newReply 
    });

  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while adding reply.",
      error: error.message 
    });
  }
};


// Add New User Function
const addNewUser = async (req, res) => {
  try {
    const { clerkId, email, fullName, constituency, district, state, pincode } = req.body;

    // Validate required fields
    if (!clerkId || !email || !fullName || !constituency || !district || !state) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ clerkId });
    
    let user;
    if (existingUser) {
      // UPDATE existing user
      user = await userModel.findOneAndUpdate(
        { clerkId },
        {
          fullName: fullName.trim(),
          constituency: constituency.trim(),
          district: district.trim(),
          state: state.trim(),
          pincode: pincode?.trim() || '',
          onboardingCompleted: true,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );
    } else {
      // CREATE new user
      user = new userModel({
        clerkId,
        email: email.toLowerCase().trim(),
        fullName: fullName.trim(),
        constituency: constituency.trim(),
        district: district.trim(),
        state: state.trim(),
        pincode: pincode?.trim() || '',
        onboardingCompleted: true,
        isActive: true,
        role: 'citizen'
      });
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: existingUser ? 'Profile updated successfully' : 'Profile created successfully',
      data: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        fullName: user.fullName,
        constituency: user.constituency,
        district: user.district,
        state: user.state,
        pincode: user.pincode,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error in addNewUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save user profile',
      error: error.message
    });
  }
};


// Get User Profile Function
const getUserProfile = async (req, res) => {
  try {
    const { clerkId } = req.params;

    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: 'ClerkId is required'
      });
    }

    // Find user by clerkId and ensure they're active
    const user = await userModel.findOne({ 
      clerkId, 
      isActive: true 
    }).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    // Update last login time
    user.lastLoginAt = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        fullName: user.fullName,
        constituency: user.constituency,
        district: user.district,
        state: user.state,
        pincode: user.pincode,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt
      }
    });
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
};


// Get User Profile Function
const checkProfileCompletion = async (req, res) => {
  try {
    const { clerkId } = req.params;

    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: 'ClerkId is required'
      });
    }

    const user = await userModel.findOne({ 
      clerkId, 
      isActive: true 
    }).select('onboardingCompleted constituency district state');

    if (!user) {
      return res.status(200).json({
        success: true,
        data: {
          exists: false,
          onboardingCompleted: false,
          profileComplete: false
        }
      });
    }

    const profileComplete = !!(
      user.onboardingCompleted && 
      user.constituency && 
      user.district && 
      user.state
    );

    return res.status(200).json({
      success: true,
      data: {
        exists: true,
        onboardingCompleted: user.onboardingCompleted,
        profileComplete: profileComplete,
        constituency: user.constituency
      }
    });
  } catch (error) {
    console.error('Error in checkProfileCompletion:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check profile completion',
      error: error.message
    });
  }
};

// Validate User Exists Function
const validateUserExists = async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await userModel.findOne({ clerkId }).select('_id isActive');

    return res.status(200).json({
      success: true,
      data: {
        exists: !!user,
        isActive: user?.isActive || false,
        userId: user?._id || null
      }
    });
  } catch (error) {
    console.error('Error in validateUserExists:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to validate user',
      error: error.message
    });
  }
};


const markOnboardingComplete = async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await userModel.findOneAndUpdate(
      { clerkId, isActive: true },
      { 
        onboardingCompleted: true,
        updatedAt: new Date()
      },
      { new: true }
    ).select('onboardingCompleted');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Onboarding marked as complete',
      data: {
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    console.error('Error in markOnboardingComplete:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark onboarding complete',
      error: error.message
    });
  }
};


const updateLastLogin = async (req, res) => {
  try {
    const { clerkId } = req.params;

    await userModel.findOneAndUpdate(
      { clerkId, isActive: true },
      { 
        lastLoginAt: new Date()
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Last login updated'
    });
  } catch (error) {
    console.error('Error in updateLastLogin:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update last login',
      error: error.message
    });
  }
};

const getUsersByConstituency = async (req, res) => {
  try {
    const { constituency } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await userModel.findActive({ constituency })
      .select('fullName email createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalUsers = await userModel.countDocuments({ 
      constituency, 
      isActive: true 
    });

    return res.status(200).json({
      success: true,
      data: {
        users,
        constituency,
        pagination: {
          total: totalUsers,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalUsers / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Error in getUsersByConstituency:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get users by constituency',
      error: error.message
    });
  }
};


// In userController.js
const getProposalById = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const clerkId = req.user?.sub;

    if (!proposalId) {
      return res.status(400).json({
        success: false,
        message: 'Proposal ID is required'
      });
    }

    // Find proposal by ID
    const proposal = await proposalModel.findById(proposalId).lean();
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // Check if user owns this proposal
    if (proposal.author !== clerkId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own proposals.'
      });
    }

    // Transform data for frontend
    const transformedProposal = {
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
      votes: proposal.votes,
      upvotes: proposal.upvotes,
      downvotes: proposal.downvotes,
      status: proposal.status,
      progress: proposal.progress,
      estimatedDuration: proposal.estimatedDuration,
      image: proposal.image,
      author: proposal.author,
      authorName: proposal.authorName,
      authorEmail: proposal.authorEmail,
      reviewedBy: proposal.reviewedBy,
      reviewDate: proposal.reviewDate,
      reviewNotes: proposal.reviewNotes,
      approvalDate: proposal.approvalDate,
      startDate: proposal.startDate,
      expectedCompletion: proposal.expectedCompletion,
      viewCount: proposal.viewCount,
      createdAt: proposal.createdAt,
      updatedAt: proposal.updatedAt
    };

    return res.status(200).json({
      success: true,
      data: transformedProposal
    });
  } catch (error) {
    console.error('Error in getProposalById:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get proposal',
      error: error.message
    });
  }
};


// In userController.js
const getUserProposals = async (req, res) => {
  try {
    const clerkId = req.user?.sub;
    const { 
      page = 1, 
      limit = 10, 
      status = 'all',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query for user's proposals only
    const query = { author: clerkId };
    if (status !== 'all') {
      query.status = status;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const proposals = await proposalModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalProposals = await proposalModel.countDocuments(query);

    // Transform proposals for frontend
    const transformedProposals = proposals.map(proposal => ({
      id: proposal._id,
      title: proposal.title,
      description: proposal.description,
      category: proposal.category,
      budget: proposal.budget,
      priority: proposal.priority,
      status: proposal.status,
      progress: proposal.progress,
      votes: proposal.votes,
      constituency: proposal.constituency,
      district: proposal.district,
      submittedDate: new Date(proposal.createdAt).toISOString().split('T')[0],
      createdAt: proposal.createdAt
    }));

    return res.status(200).json({
      success: true,
      data: {
        proposals: transformedProposals,
        pagination: {
          total: totalProposals,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalProposals / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Error in getUserProposals:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get user proposals',
      error: error.message
    });
  }
};


// GET hero statistics for landing page
const getHeroStats = async (req, res) => {
  try {
    // Get total active users
    const totalUsers = await userModel.countDocuments({ isActive: true });
    
    // Get total proposals
    const totalProposals = await proposalModel.countDocuments();
    
    // Calculate success rate (approved + completed proposals)
    const successfulProposals = await proposalModel.countDocuments({
      status: { $in: ['approved', 'completed'] }
    });
    
    const successRate = totalProposals > 0 
      ? Math.round((successfulProposals / totalProposals) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      message: "Hero statistics fetched successfully",
      data: {
        totalUsers,
        totalProposals,
        successRate
      }
    });

  } catch (error) {
    console.error('Error fetching hero stats:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hero statistics",
      error: error.message
    });
  }
};

export { getHeroStats };


export { addProposal, addComment ,getAllProposals,getComments, voteOnProposal, toggleCommentLike, addReply,addNewUser,
  getUserProfile,
  checkProfileCompletion,
  validateUserExists,
  markOnboardingComplete,
  updateLastLogin,
  getUsersByConstituency,
  getProposalById,
  getUserProposals
 };
