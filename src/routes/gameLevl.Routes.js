import express from 'express';
import { 
    updateUserGameData, getUserGameData 
} from '../controller/gameLevel.Controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/update', protect, updateUserGameData);
router.get('/data', protect, getUserGameData);

export default router;