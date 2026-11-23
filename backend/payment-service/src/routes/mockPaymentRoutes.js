import { Router } from 'express';
import {
  cancelMockCheckout,
  payMockCheckout,
  showMockCheckout
} from '../controllers/mockPaymentController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/checkout/:sessionId', asyncHandler(showMockCheckout));
router.post('/pay/:sessionId', asyncHandler(payMockCheckout));
router.get('/cancel/:sessionId', asyncHandler(cancelMockCheckout));

export default router;
