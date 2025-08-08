import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
// const BASE_URL = "http://localhost:5000/uploads/xverseo/"
const BASE_URL = "https://game-6g0j.onrender.com/uploads/xverseo/";
import Game from "../model/gameModel.js";
import Coin from "../model/coinModel.js";
import AppCode from "../model/appCode.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "365d",
  });
};

const googleAuth = async (req, res) => {
  try {
    const {
      registeredID,
      email,
      userName,
      value1,
      value2,
      value3,
      value4,
      value5,
      gameName
    } = req.body;

    if (!registeredID || !email || !gameName) {
      return res.status(400).json({ message: "registeredID and gameName are required" });
    }

    let game = await Game.findOne({ gameName });
    if (!game) {
      game = await Game.create({ gameName });
    }

    let user = await User.findOne({ registeredID });

    if (user) {
      const isAlreadyRegistered = user.games.some(g => g.toString() === game._id.toString());
      if (isAlreadyRegistered) {
        return res.status(409).json({
          message: `User already registered in ${gameName}`,
        });
      }

      user.games.push(game._id);
      await user.save();
    } else {
      const photo = req.file ? req.file.filename : undefined;
      user = new User({
        userName: userName || (email ? email.split("@")[0] : "Guest"),
        email,
        registeredID,
        photo,
        value1,
        value2,
        value3,
        value4,
        value5,
        games: [game._id]
      });
      await user.save();

      await Coin.create({ user: user._id, coins: 50 });
    }

    const token = generateToken(user._id);

    res.status(200).json({ message: "Registration successful", token, user });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const loginWithEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUsersBasicInfo = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token is missing or invalid" });
    }

    const user = await User.findById(userId, "userName email photo");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = {
      userName: user.userName,
      email: user.email,
      photo: user.photo ? BASE_URL + user.photo : null,
    };

    res.status(200).json({ user: result });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const slashScreen = async (req, res) => {
  try {
    const appcode = await AppCode.find();
    const app_code = appcode[0].app_code;
   
    return res.status(200).json({
      success: true,
      message: "Slash screen find successfully",
      data: {
        app_code: app_code,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { googleAuth, getUsersBasicInfo, loginWithEmail, slashScreen };
