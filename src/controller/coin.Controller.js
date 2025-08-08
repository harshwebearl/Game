import Coin from "../model/coinModel.js";

export const coinUndo = async (req, res) => {
  try {
    const userId = req.user;
    const { coin } = req.body;

    const userCoin = await Coin.findOne({ user: userId });
    if (!userCoin) {
      return res.status(404).json({ message: "User coin record not found" });
    }

    if (userCoin.coins < coin) {
      return res
        .status(400)
        .json({
          message:
            "Insufficient coins. You cannot spend more coins than you have.",
        });
    }

    userCoin.coins -= coin;
    await userCoin.save();

    res.status(200).json({ message: "Coins updated", coins: userCoin.coins });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addCoin = async (req, res) => {
  try {
    const userId = req.user;
    const { coin } = req.body;

    let userCoin = await Coin.findOne({ user: userId });
    if (!userCoin) {
      userCoin = new Coin({ user: userId, coins: 0 });
    }

    userCoin.coins += coin;
    await userCoin.save();

    res.status(200).json({ message: "Coins added", coins: userCoin.coins });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const displayCoin = async (req, res) => {
  try {
    const userId = req.user;

    const userCoin = await Coin.findOne({ user: userId });
    if (!userCoin) {
      return res.status(404).json({ message: "User coin record not found" });
    }

    res.status(200).json({ success: true, coins: userCoin.coins });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
