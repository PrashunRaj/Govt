import express from 'express';
import { 
  registerMla, 
  getMlaProfile, 
  checkMlaProfileCompletion, 
  updateMlaProfile, 
  getAllMlas, 
  getMlaById ,
    uploadDocument,
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
    getHeatmapProposals

} from '../controllers/MlaController.js';
import { 
  clerkMlaAuth, 
  requireMlaAuth, 
  verifyMlaToken, 
  requireMlaVerification,
    requireAdminAccess
    
} from '../middlewares/authMla.js';
import upload2, { handleMulter2Error } from '../middlewares/multer2.js';

const mlaRouter = express.Router();

// Apply Clerk middleware to all MLA routes
mlaRouter.use(clerkMlaAuth);

// Basic MLA routes (require auth but not verification)
mlaRouter.post('/register', verifyMlaToken, registerMla);
mlaRouter.get('/profile/:clerkId', verifyMlaToken, getMlaProfile);
mlaRouter.get('/check-completion/:clerkId', verifyMlaToken, checkMlaProfileCompletion);
mlaRouter.post('/profile/update/:clerkId', verifyMlaToken, updateMlaProfile);

// Document upload route (require auth but not verification)
mlaRouter.post('/upload-document', 
  verifyMlaToken, 
  upload2.single('document'), 
  handleMulter2Error, 
  uploadDocument
);

// Verified MLA routes (require verification)
mlaRouter.get('/all', requireMlaVerification, getAllMlas);
mlaRouter.get('/mla/:id', requireMlaVerification, getMlaById);

// MLA proposal management routes (require verification)
mlaRouter.get('/proposals', verifyMlaToken,requireMlaVerification, getMlaProposals);
mlaRouter.get('/proposals/:proposalId',verifyMlaToken, requireMlaVerification, getProposalDetails);
mlaRouter.post('/proposals/:proposalId/approve',verifyMlaToken, requireMlaVerification, approveProposal);
mlaRouter.post('/proposals/:proposalId/reject',verifyMlaToken, requireMlaVerification, rejectProposal);
mlaRouter.post('/proposals/:proposalId/update-status',verifyMlaToken, requireMlaVerification, updateProposalStatus);

// MLA analytics routes (require verification)
mlaRouter.get('/analytics/constituency',verifyMlaToken, requireMlaVerification, getConstituencyAnalytics);
//mlaRouter.get('/analytics/proposals',verifyMlaToken, requireMlaVerification, getProposalAnalytics);
// Admin routes for MLA management (require admin access)
mlaRouter.post('/verify/:clerkId', verifyMlaToken, requireAdminAccess, verifyMla);
mlaRouter.post('/reject/:clerkId', verifyMlaToken, requireAdminAccess, rejectVerification);
mlaRouter.post('/ban/:clerkId', verifyMlaToken, requireAdminAccess, banMla);
mlaRouter.post('/unban/:clerkId', verifyMlaToken, requireAdminAccess, unbanMla);
mlaRouter.get('/heatmap-proposals', verifyMlaToken, requireAdminAccess, getHeatmapProposals);
export default mlaRouter;