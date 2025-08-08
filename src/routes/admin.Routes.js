import express, { Router } from 'express';
import { 
    // appAdminSignUp,
    appAdminSignIn,
    getappAdminProfile,
    updateappAdminProfile,
    appAdminchangePassword,
    getAllusers,
    getUserById,
    totalUser,
    gameUser,
    getByDate,
    RegistrationsByMonthOrYear
} from '../controller/admin.Controller.js';
import { AppAdminprotect } from '../middleware/authMiddleware.js';

const router = express.Router();

// router.post('/register', appAdminSignUp);
router.post('/login', appAdminSignIn);
router.get('/getadminprofile', AppAdminprotect, getappAdminProfile);
router.put('/updateprofile', AppAdminprotect, updateappAdminProfile);
router.put('/changepassword', AppAdminprotect, appAdminchangePassword);
router.get('/getallusers', AppAdminprotect, getAllusers);
router.get('/getuser/:id', AppAdminprotect, getUserById);
router.get('/totaluser', AppAdminprotect, totalUser);
router.post('/gameuser', AppAdminprotect, gameUser);
router.post('/getbydate', AppAdminprotect, getByDate);
router.post('/filter', AppAdminprotect, RegistrationsByMonthOrYear);

export default router;