import { Router } from 'express'; import { getUserOrders } from '../controllers/orderController.js'; import { requireAuth } from '../middleware/auth.js'; import { asyncHandler } from '../utils/asyncHandler.js';
const router=Router(); router.use(requireAuth); router.get('/user/:userId',asyncHandler(getUserOrders)); export default router;
