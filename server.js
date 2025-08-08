import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";

import GameRoutes from "./src/routes/user.Routes.js"
import coinRouter from "./src/routes/coin.Routes.js"
import Games from "./src/routes/game.Routes.js"
import AppAdmin from "./src/routes/admin.Routes.js"
import GameLevel from "./src/routes/gameLevl.Routes.js"

dotenv.config();

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
// app.use('/plan', express.static('uploads/plans'));
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", GameRoutes);
app.use("/api/coin", coinRouter);
app.use("/api/game", Games);
app.use("/api/admin", AppAdmin);
app.use("/api/gameLevel", GameLevel)

// Print all registered API routes with base URLs
const registeredRoutes = [
  { base: "/api/user", name: "user" },
  { base: "/api/coin", name: "coin" },
  { base: "/api/game", name: "game" },
  { base: "/api/admin", name: "admin" },
  { base: "/api/gameLevel", name: "gameLevel" }
];
console.log("Registered API Endpoints:");
registeredRoutes.forEach(route => {
  console.log(`Base URL: ${route.base} | API: ${route.name}`);
});

// IN case Fail Config db.js
connectDB()
    .then(() => {
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log("SERVER RUNNING ON PORT:", port);
            // Print all API endpoints with method and URL
            const apiEndpoints = [
              { method: "POST", url: "/api/admin/login" },
              { method: "GET", url: "/api/admin/getadminprofile" },
              { method: "PUT", url: "/api/admin/updateprofile" },
              { method: "PUT", url: "/api/admin/changepassword" },
              { method: "GET", url: "/api/admin/getallusers" },
              { method: "GET", url: "/api/admin/getuser/:id" },
              { method: "GET", url: "/api/admin/totaluser" },
              { method: "POST", url: "/api/admin/gameuser" },
              { method: "POST", url: "/api/admin/getbydate" },
              { method: "POST", url: "/api/admin/filter" },
              { method: "POST", url: "/api/coin/undo" },
              { method: "POST", url: "/api/coin/add" },
              { method: "GET", url: "/api/coin/display" },
              { method: "POST", url: "/api/game/add" },
              { method: "GET", url: "/api/game/getAll" },
              { method: "GET", url: "/api/game/getGame/:id" },
              { method: "PUT", url: "/api/game/update/:id" },
              { method: "DELETE", url: "/api/game/delete/:id" },
              { method: "GET", url: "/api/game/getUsers/:gameName" },
              { method: "POST", url: "/api/gameLevel/update" },
              { method: "GET", url: "/api/gameLevel/data" },
              { method: "POST", url: "/api/user/google" },
              { method: "GET", url: "/api/user/getInfo" },
              { method: "POST", url: "/api/user/login" },
              { method: "GET", url: "/api/user/slash" },
              { method: "POST", url: "/api/attendance/create" },
              { method: "GET", url: "/api/attendance/getAllAttendance" },
              { method: "GET", url: "/api/attendance/getAttendanceById/:id" },
              { method: "PUT", url: "/api/attendance/updateAttendance/:id" },
              { method: "DELETE", url: "/api/attendance/deleteAttendance/:id" },
              { method: "POST", url: "/api/attendance/getByDate" },
              { method: "POST", url: "/api/attendance/dateRange" }
            ];
            console.log("All API Endpoints:");
            apiEndpoints.forEach(api => {
              const baseUrl = api.url.split('/').slice(0, 3).join('/');
              console.log(`${api.method}\t http://localhost:${port}${api.url} \t Base URL: ${baseUrl}`);
            });
        });
    })
    .catch((err) => {
        console.log("MONGODB CONNECTION FAILED: ", err);
    });