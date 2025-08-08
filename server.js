// server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

// Route imports
import UserRoutes from "./src/routes/user.Routes.js";
import CoinRoutes from "./src/routes/coin.Routes.js";
import GameRoutes from "./src/routes/game.Routes.js";
import AdminRoutes from "./src/routes/admin.Routes.js";
import GameLevelRoutes from "./src/routes/gameLevl.Routes.js";
import AttendanceRoutes from "./src/routes/attendance.Routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Log all requests
app.use((req, res, next) => {
  const currentTime = new Date().toLocaleString();
  console.log(`[${currentTime}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use("/api/user", UserRoutes);
app.use("/api/coin", CoinRoutes);
app.use("/api/game", GameRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/gameLevel", GameLevelRoutes);
app.use("/api/attendance", AttendanceRoutes);

// Welcome route with API listing
app.get("/", (req, res) => {
  const baseUrl = req.protocol + "://" + req.get("host");
  res.json({
    message: "Welcome to the Game API!",
    apis: [
      {
        group: "user",
        endpoints: [
          { method: "POST", url: `${baseUrl}/api/user/google` },
          { method: "GET", url: `${baseUrl}/api/user/getInfo` },
          { method: "POST", url: `${baseUrl}/api/user/login` },
          { method: "GET", url: `${baseUrl}/api/user/slash` }
        ]
      },
      {
        group: "coin",
        endpoints: [
          { method: "POST", url: `${baseUrl}/api/coin/undo` },
          { method: "POST", url: `${baseUrl}/api/coin/add` },
          { method: "GET", url: `${baseUrl}/api/coin/display` }
        ]
      },
      {
        group: "game",
        endpoints: [
          { method: "POST", url: `${baseUrl}/api/game/add` },
          { method: "GET", url: `${baseUrl}/api/game/getAll` },
          { method: "GET", url: `${baseUrl}/api/game/getGame/:id` },
          { method: "PUT", url: `${baseUrl}/api/game/update/:id` },
          { method: "DELETE", url: `${baseUrl}/api/game/delete/:id` },
          { method: "GET", url: `${baseUrl}/api/game/getUsers/:gameName` }
        ]
      },
      {
        group: "admin",
        endpoints: [
          { method: "POST", url: `${baseUrl}/api/admin/login` },
          { method: "GET", url: `${baseUrl}/api/admin/getadminprofile` },
          { method: "PUT", url: `${baseUrl}/api/admin/updateprofile` },
          { method: "PUT", url: `${baseUrl}/api/admin/changepassword` },
          { method: "GET", url: `${baseUrl}/api/admin/getallusers` },
          { method: "GET", url: `${baseUrl}/api/admin/getuser/:id` },
          { method: "GET", url: `${baseUrl}/api/admin/totaluser` },
          { method: "POST", url: `${baseUrl}/api/admin/gameuser` },
          { method: "POST", url: `${baseUrl}/api/admin/getbydate` },
          { method: "POST", url: `${baseUrl}/api/admin/filter` }
        ]
      },
      {
        group: "gameLevel",
        endpoints: [
          { method: "POST", url: `${baseUrl}/api/gameLevel/update` },
          { method: "GET", url: `${baseUrl}/api/gameLevel/data` }
        ]
      },
       {
        group: "attendance",
        endpoints: [
          { method: "POST", url: `${baseUrl}/api/attendance/create` },
          { method: "GET", url: `${baseUrl}/api/attendance/getAllAttendance` },
          { method: "GET", url: `${baseUrl}/api/attendance/getAttendanceById/:id` },
          { method: "PUT", url: `${baseUrl}/api/attendance/updateAttendance/:id` },
          { method: "DELETE", url: `${baseUrl}/api/attendance/deleteAttendance/:id` },
          { method: "POST", url: `${baseUrl}/api/attendance/getByDate` },
          { method: "POST", url: `${baseUrl}/api/attendance/dateRange` }
        ]
      }
    ],
    totalApis: 32
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: `🔍 Route not found: ${req.originalUrl}` });
});

// Start server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
  