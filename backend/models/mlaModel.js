import mongoose from "mongoose";

const mlaSchema = new mongoose.Schema({
  // Clerk Integration
  clerkId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true
  },
  
  // Basic Information
  fullName: { 
    type: String, 
    required: true 
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  phoneNumber: {
    type: String,
    required: true
  },
  
  // Political Information
  constituency: { 
    type: String, 
    required: true 
  },
  district: { 
    type: String, 
    required: true 
  },
  state: { 
    type: String, 
    required: true 
  },
  politicalParty: {
    type: String,
    required: true
  },
  termStartDate: {
    type: Date,
    required: true
  },
  termEndDate: {
    type: Date,
    required: true
  },
  
  // Verification Status
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending"
  },
  verifiedBy: {
    type: String, // Admin's clerkId who verified
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  verificationNotes: {
    type: String,
    default: ''
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  
  // Admin Control Fields
  bannedBy: {
    type: String, // Admin's clerkId who banned this MLA
    default: null
  },
  bannedAt: {
    type: Date,
    default: null
  },
  banReason: {
    type: String,
    default: null
  },
  
  // Documents for Verification
  documents: {
    identityProof: {
      type: String, // Cloudinary URL
      required: true
    },
    electionCertificate: {
      type: String, // Cloudinary URL
      required: true
    },
    additionalDocuments: [{
      name: String,
      url: String
    }]
  },
  
  // Profile Completion
  profileCompleted: {
    type: Boolean,
    default: false
  },
  
  // Activity Tracking
  lastLoginAt: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
mlaSchema.index({ constituency: 1 });
mlaSchema.index({ isVerified: 1 });
mlaSchema.index({ isActive: 1 });
mlaSchema.index({ verificationStatus: 1 });
mlaSchema.index({ state: 1 });

// Instance method to check if MLA can access system
mlaSchema.methods.canAccess = function() {
  return this.isVerified && this.isActive && !this.isBanned && this.profileCompleted;
};

// Instance method to verify MLA (called by admin)
mlaSchema.methods.verifyMLA = function(adminClerkId, notes = '') {
  this.isVerified = true;
  this.verificationStatus = 'verified';
  this.verifiedBy = adminClerkId;
  this.verifiedAt = new Date();
  this.verificationNotes = notes;
  return this.save();
};

// Instance method to reject MLA verification (called by admin)
mlaSchema.methods.rejectVerification = function(adminClerkId, reason = '') {
  this.isVerified = false;
  this.verificationStatus = 'rejected';
  this.verifiedBy = adminClerkId;
  this.verifiedAt = new Date();
  this.verificationNotes = reason;
  return this.save();
};

// Instance method to ban MLA (called by admin)
mlaSchema.methods.banMLA = function(adminClerkId, reason = 'No reason provided') {
  this.isBanned = true;
  this.isActive = false;
  this.bannedBy = adminClerkId;
  this.bannedAt = new Date();
  this.banReason = reason;
  return this.save();
};

// Instance method to unban MLA (called by admin)
mlaSchema.methods.unbanMLA = function() {
  this.isBanned = false;
  this.isActive = true;
  this.bannedBy = null;
  this.bannedAt = null;
  this.banReason = null;
  return this.save();
};

// Instance method to complete profile
mlaSchema.methods.completeProfile = function() {
  this.profileCompleted = true;
  return this.save();
};

// Static method to find only verified and active MLAs
mlaSchema.statics.findVerifiedActive = function(query = {}) {
  return this.find({ 
    ...query, 
    isVerified: true, 
    isActive: true, 
    isBanned: false 
  });
};

// Static method to find MLAs pending verification
mlaSchema.statics.findPendingVerification = function() {
  return this.find({ 
    verificationStatus: 'pending',
    isActive: true 
  });
};

// Static method to find MLAs by constituency
mlaSchema.statics.findByConstituency = function(constituency) {
  return this.findOne({ 
    constituency, 
    isVerified: true, 
    isActive: true, 
    isBanned: false 
  });
};

// Pre-save middleware to set profile completion
mlaSchema.pre('save', function(next) {
  if (this.fullName && this.constituency && this.district && this.state && 
      this.politicalParty && this.phoneNumber && this.documents.identityProof && 
      this.documents.electionCertificate) {
    this.profileCompleted = true;
  }
  next();
});

const mlaModel = mongoose.models.mla || mongoose.model('mla', mlaSchema);

export default mlaModel;
