import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  // User who receives the notification
  userId: { 
    type: String, 
    required: true 
  },
  
  // Type of notification
  type: {
    type: String,
    required: true,
    enum: [
      'new_proposal',        // New proposal in user's constituency
      'proposal_approved',   // User's proposal approved
      'proposal_rejected',   // User's proposal rejected
      'proposal_completed',  // User's proposal completed
      'upvote_received',     // User's proposal got upvoted
      'comment_received',    // Someone commented on user's proposal
      'reply_received'       // Someone replied to user's comment
    ]
  },
  
  // Notification content
  title: { 
    type: String, 
    required: true 
  },
  
  description: { 
    type: String, 
    required: true 
  },
  
  // Related proposal (if applicable)
  proposalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'proposal',
    required: false 
  },
  
  // Additional data for context
  data: {
    proposalTitle: String,
    constituency: String,
    authorName: String,
    commentId: String
  },
  
  // Notification status
  isRead: { 
    type: Boolean, 
    default: false 
  },
  
  // Auto-delete old notifications (optional)
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // 30 days in seconds
  }
}, {
  timestamps: true
});

// Indexes for better performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ type: 1 });

const notificationModel = mongoose.models.notification || mongoose.model('notification', notificationSchema);

export default notificationModel;
