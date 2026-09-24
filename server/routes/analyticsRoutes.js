import express from 'express';
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getAnomalies
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/categories', getCategoryBreakdown);
router.get('/monthly-trends', getMonthlyTrends);
router.get('/anomalies', getAnomalies);

export default router;
