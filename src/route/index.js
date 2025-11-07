// src/route/index.js
import { Router } from 'express';
import { auth, requireRole } from '../middlewares/auth.js';
import { register, login, me, listUsers, updateMe } from '../controllers/auth.controller.js';

const router = Router();

// Auth
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', auth(), me);
router.patch('/auth/me', auth(), updateMe);

// Admin (tuỳ chọn)
router.get('/users', auth(), requireRole('admin'), listUsers);

export default router;
