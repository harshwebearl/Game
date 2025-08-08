import express from "express";
import {
  coinUndo,
  addCoin,
  displayCoin,
} from "../controller/coin.Controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/undo", protect, coinUndo);
router.post("/add", protect, addCoin);
router.get("/display", protect, displayCoin);

export default router;