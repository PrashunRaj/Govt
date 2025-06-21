// import mongoose from "mongoose";

// const proposalSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   image: { type: String, required: true },
//   upvotes: { type: Number, default: 0 },
//   downvotes: { type: Number, default: 0 },
//   likedBy: [{ type: String }],     // 👈 stores user IDs / Clerk usernames
//   dislikedBy: [{ type: String }],  // 👈 stores user IDs / Clerk usernames
//   comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
//   author: { type: String, required: true },
//   date: { type: Date, default: Date.now },
//   status: {
//     type: String,
//     enum: ["Under Review", "Approved", "Rejected"],
//     default: "Under Review"
//   }
// });

// const proposalModel = mongoose.models.proposal || mongoose.model('proposal', proposalSchema);

// export default proposalModel;




//complex one
import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema({
  // Basic Information
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  
  // Categorization (for Analytics & Filtering)
  category: { 
    type: String, 
    required: true,
    enum: ["Infrastructure", "Healthcare", "Education", "Environment", "Transportation", "Public Safety", "Other"]
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  
  // Budget & Impact
  budget: { type: Number, required: true }, // Estimated cost
  beneficiaries: { type: Number, default: 0 }, // People affected
  
  // Location (for Mapping - Simplified)
  constituency: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  location: { type: String }, // Address description
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  
  // Voting System
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  votes: { type: Number, default: 0 }, // Net votes (upvotes - downvotes)
  likedBy: [{ type: String }],
  dislikedBy: [{ type: String }],
  
  // Comments & Engagement
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  viewCount: { type: Number, default: 0 },
  
  // Author Information (from User Model)
  author: { type: String, required: true }, // Clerk user ID
  authorEmail: { type: String },
  authorName: { type: String },
  
  // Status Management (Simplified for MLA workflow)
  status: {
    type: String,
    enum: ["pending", "under_review", "approved", "rejected", "in_progress", "completed"],
    default: "pending"
  },
  
  // Project Management (Simplified)
  estimatedDuration: { type: String }, // "3 months", "1 year", etc.
  startDate: { type: Date },
  expectedCompletion: { type: Date },
  progress: { type: Number, default: 0 }, // Percentage 0-100
  
  // MLA Actions
  reviewedBy: { type: String }, // MLA who reviewed
  reviewDate: { type: Date },
  reviewNotes: { type: String },
  approvalDate: { type: Date },
  
  // Analytics Data
  submissionMonth: { type: Number }, // For monthly analytics
  submissionYear: { type: Number }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for better performance
proposalSchema.index({ constituency: 1 });
proposalSchema.index({ status: 1 });
proposalSchema.index({ category: 1 });
proposalSchema.index({ createdAt: -1 });
proposalSchema.index({ coordinates: "2dsphere" }); // For geo queries

// Pre-save middleware to set analytics fields
proposalSchema.pre('save', function(next) {
  if (this.isNew) {
    const date = new Date();
    this.submissionMonth = date.getMonth() + 1;
    this.submissionYear = date.getFullYear();
    this.votes = this.upvotes - this.downvotes;
  }
  next();
});

// Instance methods for MLA actions
proposalSchema.methods.approveProposal = function(mlaId, notes = '') {
  this.status = 'approved';
  this.reviewedBy = mlaId;
  this.reviewDate = new Date();
  this.approvalDate = new Date();
  this.reviewNotes = notes;
  return this.save();
};

proposalSchema.methods.rejectProposal = function(mlaId, reason = '') {
  this.status = 'rejected';
  this.reviewedBy = mlaId;
  this.reviewDate = new Date();
  this.reviewNotes = reason;
  return this.save();
};

proposalSchema.methods.updateProgress = function(progressPercent) {
  this.progress = Math.min(100, Math.max(0, progressPercent));
  if (this.progress === 100) {
    this.status = 'completed';
  } else if (this.progress > 0 && this.status === 'approved') {
    this.status = 'in_progress';
  }
  return this.save();
};

const proposalModel = mongoose.models.proposal || mongoose.model('proposal', proposalSchema);

export default proposalModel;
