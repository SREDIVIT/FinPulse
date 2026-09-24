import express from 'express';
import {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget
} from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBudgets)
  .post(createBudget);

router.route('/:id')
  .get(getBudgetById)
  .put(updateBudget)
  .delete(deleteBudget);

export default router;
