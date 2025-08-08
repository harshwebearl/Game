import mongoose from 'mongoose';
import UserGameData from '../model/gameLevelModel.js';
import Game from '../model/gameModel.js';

const updateUserGameData = async (req, res) => {
    try {
        const userId = req.user._id;
        const { gameName, gameLevel, gridSize } = req.body;

        if (!gameName) {
            return res.status(400).json({ message: "gameName is required" });
        }

        const trimmedGameName = gameName.trim();

        const game = await Game.findOne({ gameName: trimmedGameName });

        if (!game) {
            return res.status(404).json({ message: `Game not found with name: ${trimmedGameName}` });
        }

        const filter = {
            user: new mongoose.Types.ObjectId(userId),
            game: new mongoose.Types.ObjectId(game._id)
        };

        const update = {
            $set: { gameLevel, gridSize },
            $setOnInsert: {
                user: filter.user,
                game: filter.game
            }
        };

        const options = { upsert: true, new: true, runValidators: true };

        const data = await UserGameData.findOneAndUpdate(filter, update, options);

        res.status(200).json({ message: "Game data saved", data });

    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getUserGameData = async (req, res) => {
    try {
        const userId = req.user._id;
        const { gameName } = req.query;

        if (!gameName) {
            return res.status(400).json({ message: "gameName is required" });
        }

        const trimmedGameName = gameName.trim();

        const game = await Game.findOne({ gameName: trimmedGameName });

        if (!game) {
            return res.status(404).json({ message: `Game not found with name: ${trimmedGameName}` });
        }

        const data = await UserGameData.findOne({
            user: userId,
            game: game._id
        }).populate('game', 'gameName');

        if (!data) {
            return res.status(404).json({ message: "Game data not found for this user." });
        }

        res.status(200).json({ data });

    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export {
    updateUserGameData,
    getUserGameData
};