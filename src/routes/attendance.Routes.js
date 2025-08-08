import express from 'express';
import { 
    createAttendance,
    getAllAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    getByDate,
    rangeOfDate,
} from '../controller/attendance.Controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/create", protect, createAttendance);
router.get("/getAllAttendance", protect, getAllAttendance);
router.get("/getAttendanceById/:id", protect, getAttendanceById);
router.put("/updateAttendance/:id", protect, updateAttendance);
router.delete("/deleteAttendance/:id", protect, deleteAttendance);
router.post("/getByDate", protect, getByDate);
router.post("/dateRange", protect, rangeOfDate);

export default router;