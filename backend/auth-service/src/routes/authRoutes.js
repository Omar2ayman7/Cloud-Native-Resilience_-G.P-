import { Router } from 'express';
import { signup, signin } from '../controllers/authController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router = Router();
router.post('/signup', asyncHandler(signup));
router.post('/signin', asyncHandler(signin));
export default router;
