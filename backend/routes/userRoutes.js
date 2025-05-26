import express from 'express'
import { login, signup, logout, getAllUsers, getProfile, updateProfile } from '../controllers/userController.js';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)


router.get('/userslist',authenticate, authorizeAdmin, getAllUsers)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router