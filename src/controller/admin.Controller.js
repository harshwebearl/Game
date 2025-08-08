import AppAdmin from "../model/adminModel.js";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import Game from "../model/gameModel.js";
import Coin from "../model/coinModel.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ADMIN_SECRET, {
    expiresIn: "1d",
  });
};

// const appAdminSignUp = async (req, res) => {
//     const { email, phoneNumber, password } = req.body;

//     const phoneRegex = /^[6-9]\d{9}$/; // Typical Indian mobile number pattern
//     if (!phoneRegex.test(phoneNumber)) {
//         return res.status(400).json({ message: 'Invalid phone number format' });
//     }

//     try {
//         const adminExists = await AppAdmin.findOne({ $or: [{ email }, { phoneNumber }] });

//         if (adminExists) {
//             return res.status(400).json({ message: 'AppAdmin already exists with this email/phone number' });
//         }

//         const admin = await AppAdmin.create({
//             email,
//             phoneNumber,
//             password, // plain text
//         });

//         res.status(201).json({
//             _id: admin._id,
//             email: admin.email,
//             phoneNumber: admin.phoneNumber,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error registering user' });
//     }
// };

// SIGN IN
const appAdminSignIn = async (req, res) => {
  const { email, phoneNumber, password } = req.body;

  try {
    const user = await AppAdmin.findOne({ $or: [{ email }, { phoneNumber }] });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email/phone number or password" });
    }

    if (password !== user.password) {
      return res
        .status(401)
        .json({ message: "Invalid email/phone number or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};

// PROFILE
const getappAdminProfile = async (req, res) => {
  try {
    const user = await AppAdmin.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      _id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching Admin profile" });
  }
};

// UPDATE PROFILE
const updateappAdminProfile = async (req, res) => {
  const { email, phoneNumber } = req.body;

  try {
    const user = await AppAdmin.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (phoneNumber) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number format" });
      }
      user.phoneNumber = phoneNumber;
    }

    user.email = email || user.email;

    await user.save();

    res.status(200).json({
      _id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

const appAdminchangePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await AppAdmin.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (oldPassword !== user.password) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllusers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    const users = await User.find()
      .populate("games", "gameName")
      .skip(skip)
      .limit(limit);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    const userIds = users.map((u) => u._id);
    const coins = await Coin.find({ user: { $in: userIds } });

    const coinMap = {};
    coins.forEach((c) => {
      coinMap[c.user.toString()] = c.coins;
    });

    const usersWithCoins = users.map((u) => ({
      ...u.toObject(),
      coins: coinMap[u._id.toString()] || 0,
    }));

    res.status(200).json({
      users: usersWithCoins,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("games", "gameName");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const coinDoc = await Coin.findOne({ user: user._id });
    const coins = coinDoc ? coinDoc.coins : 0;

    res.status(200).json({
      ...user.toObject(),
      coins,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

const totalUser = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching total users" });
  }
};

const gameUser = async (req, res) => {
  try {
    const { gameId } = req.body;
    if (!gameId) {
      return res.status(400).json({ message: "Game ID is required" });
    }

    const users = await User.find({ games: gameId }).select(
      "userName email createdAt updatedAt"
    );
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found for this game" });
    }

    const userIds = users.map((u) => u._id);

    const coins = await Coin.find({ user: { $in: userIds } });
    const coinMap = {};
    coins.forEach((c) => {
      coinMap[c.user.toString()] = c.coins;
    });

    const usersWithCoins = users.map((u) => ({
      ...u.toObject(),
      coins: coinMap[u._id.toString()] || 0,
    }));

    res.status(200).json({
      users: usersWithCoins,
      totalUsers: users.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users for game" });
  }
};

const getByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const users = await User.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).populate("games");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    const userIds = users.map((u) => u._id);
    const coins = await Coin.find({ user: { $in: userIds } });
    const coinMap = {};

    coins.forEach((c) => {
      coinMap[c.user.toString()] = c.coins;
    });
    const usersWithCoins = users.map((u) => ({
      ...u.toObject(),
      coins: coinMap[u._id.toString()] || 0,
    }));

    res.status(200).json({
      users: usersWithCoins,
      totalUsers: users.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users by date" });
  }
};

const RegistrationsByMonthOrYear = async (req, res) => {
  try {
    const { month, year } = req.body;
    let startDate, endDate;

    if (year && month) {
      startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
      endDate = new Date(year, month, 1, 0, 0, 0, 0);
    } else if (year) {
      startDate = new Date(year, 0, 1, 0, 0, 0, 0);
      endDate = new Date(year + 1, 0, 1, 0, 0, 0, 0);
    } else {
      return res
        .status(400)
        .json({
          message: "Please provide at least year or both month and year.",
        });
    }

    const users = await User.find({
      createdAt: { $gte: startDate, $lt: endDate },
    }).populate("games", "gameName");

    const gameCounts = {};
    users.forEach((user) => {
      user.games.forEach((game) => {
        gameCounts[game.gameName] = (gameCounts[game.gameName] || 0) + 1;
      });
    });

    const response = {
      registrations: gameCounts,
      totalUsers: users.length,
    };
    if (year && month) {
      response.month = month;
      response.year = year;
    } else if (year) {
      response.year = year;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching registrations" });
  }
};

export {
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
  RegistrationsByMonthOrYear,
};
