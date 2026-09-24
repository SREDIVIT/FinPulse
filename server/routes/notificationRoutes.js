import express from 'express';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNotifications);

router.put('/mark-all-read', markAllNotificationsRead);

router.route('/:id/read')
  .put(markNotificationRead);

router.route('/:id')
  .delete(deleteNotification);

export default router;
