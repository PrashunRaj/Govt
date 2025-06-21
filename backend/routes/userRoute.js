import express from 'express'
import upload from '../middlewares/multer.js'
import { 
  // Existing proposal functions
  addProposal, 
  addComment, 
  getAllProposals, 
  getComments, 
  voteOnProposal, 
  toggleCommentLike, 
  addReply,
  // New user profile functions
  addNewUser,
  getUserProfile,
  checkProfileCompletion,
  getProposalById,
  getUserProposals,
  getHeroStats

} from '../controllers/UserController.js'
import { verifyClerkToken } from '../middlewares/authUser.js'
const userRouter = express.Router()

// User Profile Management Routes
userRouter.post('/register', addNewUser) // Create/update user profile + mark onboarding complete
userRouter.get('/profile/:clerkId', getUserProfile) // Get user profile by clerkId
userRouter.get('/check-completion/:clerkId', checkProfileCompletion) // Check if profile is complete

// Existing Proposal Routes
userRouter.get('/proposals/:proposalId', verifyClerkToken, getProposalById);
userRouter.get('/my-proposals', verifyClerkToken, getUserProposals);
userRouter.post('/add-proposals', verifyClerkToken,upload.single('image'), addProposal)
userRouter.post('/add-comment', verifyClerkToken, addComment)
userRouter.get('/all-proposals',verifyClerkToken,getAllProposals)
userRouter.get('/get-comments/:proposalId', getComments) // Get comments for a specific proposal
userRouter.post('/vote',  verifyClerkToken,voteOnProposal) // Vote on a proposal (upvote/downvote)
userRouter.post('/comment-like', verifyClerkToken, toggleCommentLike) // Like/unlike a comment
userRouter.post('/add-reply', verifyClerkToken, addReply) // Add a reply to a comment
userRouter.get('/hero-stats', getHeroStats);
export default userRouter
