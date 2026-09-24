import express from 'express';
import { registerUser, loginUser, googleLoginUser, sendOtp, resetPassword, getUserProfile, updateUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLoginUser);
router.post('/send-otp', sendOtp);
router.post('/reset-password', resetPassword);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
