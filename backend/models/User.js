import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Clerk Integration
  clerkId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  
  // Basic Information
  fullName: { 
    type: String, 
    required: true 
  },
  
  // Location Information (for area-based filtering)
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
  pincode: { 
    type: String 
  },
  
  // User Role & Status
  role: {
    type: String,
    enum: ["citizen", "admin"],
    default: "citizen"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Admin Control Fields
  disabledBy: {
    type: String, // Admin's clerkId who disabled this user
    default: null
  },
  disabledAt: {
    type: Date,
    default: null
  },
  disableReason: {
    type: String,
    default: null
  },
  
  // Simple status tracking
  onboardingCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for fast filtering
userSchema.index({ constituency: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ role: 1 });

// Instance method to check if user is admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Instance method to disable user (called by admin)
userSchema.methods.disableUser = function(adminClerkId, reason = 'No reason provided') {
  this.isActive = false;
  this.disabledBy = adminClerkId;
  this.disabledAt = new Date();
  this.disableReason = reason;
  return this.save();
};

// Instance method to enable user (called by admin)
userSchema.methods.enableUser = function() {
  this.isActive = true;
  this.disabledBy = null;
  this.disabledAt = null;
  this.disableReason = null;
  return this.save();
};

// Static method to find only active users
userSchema.statics.findActive = function(query = {}) {
  return this.find({ ...query, isActive: true });
};

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
