import express from 'express';
import {
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSubscriptions)
  .post(createSubscription);

router.route('/:id')
  .get(getSubscriptionById)
  .put(updateSubscription)
  .delete(deleteSubscription);

export default router;
