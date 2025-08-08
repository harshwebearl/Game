import express from "express";
import {
    createGame,
    getAllGames,
    getGameById,
    updateGame,
    deleteGame,
    getUsersForGame
} from "../controller/game.Controller.js";
import { AppAdminprotect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", AppAdminprotect, createGame);
router.get("/getAll", AppAdminprotect, getAllGames);
router.get("/getGame/:id", AppAdminprotect, getGameById);
router.put("/update/:id", AppAdminprotect, updateGame);
router.delete("/delete/:id", AppAdminprotect, deleteGame);
router.get("/getUsers/:gameName", AppAdminprotect, getUsersForGame);

export default router;