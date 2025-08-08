import express from 'express';
import { 
    googleAuth,
    getUsersBasicInfo,
    loginWithEmail,
    slashScreen
 } from '../controller/user.Controller.js';
import upload from '../middleware/multer.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/google', upload.single('photo'), googleAuth);
router.get('/getInfo', protect, getUsersBasicInfo);
router.post('/login', loginWithEmail);
router.get('/slash', slashScreen)

export default router;