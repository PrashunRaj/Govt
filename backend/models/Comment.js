import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
  proposalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proposal",
    required: true, // Kis proposal pe comment/reply hai
  },
  user: {
    type: String,
    required: true, // User ka naam (Clerk se)
  },
  avatar: {
    type: String,
    default: "/api/placeholder/40/40", // Avatar image
  },
  comment: {
    type: String,
    required: true, // Comment text
  },
  likes: {
    type: Number,
    default: 0, // Total like count
  },
  likedBy: [{
    type: String, // User ID / email / username (Clerk ID preferred)
  }],
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null, // null => top-level comment, else reply
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment", // Nested replies
  }],
}, { timestamps: true });

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
