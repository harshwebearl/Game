import Game from "../model/gameModel.js";
import User from "../model/userModel.js";
import Coin from "../model/coinModel.js";

export const createGame = async (req, res) => {
    try {
        const { gameName } = req.body;
        if (!gameName) {
            return res.status(400).json({ message: "gameName is required" });
        }
        const game = new Game({ gameName });
        await game.save();
        res.status(201).json({ message: "Game created", game });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAllGames = async (req, res) => {
    try {
        const games = await Game.find();
        res.status(200).json({ games });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getGameById = async (req, res) => {
    try {
        const { id } = req.params;
        const game = await Game.findById(id);
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        res.status(200).json({ game });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateGame = async (req, res) => {
    try {
        const { id } = req.params;
        const { gameName } = req.body;
        const game = await Game.findByIdAndUpdate(
            id,
            { gameName },
            { new: true, runValidators: true }
        );
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        res.status(200).json({ message: "Game updated", game });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteGame = async (req, res) => {
    try {
        const { id } = req.params;
        const game = await Game.findByIdAndDelete(id);
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        res.status(200).json({ message: "Game deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUsersForGame = async (req, res) => {
  const { id } = req.params;

  try {
    const game = await Game.findOne(id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const users = await User.find({ games: game._id });

    const userIds = users.map(u => u._id);

    const coins = await Coin.find({ user: { $in: userIds } });

    const coinMap = {};
    coins.forEach(c => {
      coinMap[c.user.toString()] = c.coins;
    });

    const usersWithCoins = users.map(u => ({
      ...u.toObject(),
      coins: coinMap[u._id.toString()] || 0
    }));

    res.status(200).json(usersWithCoins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};