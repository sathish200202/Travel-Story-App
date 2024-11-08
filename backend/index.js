const express = require("express");
const cors = require("cors");
// const config = require("./config.json");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");

const UserRoute = require("./Routes/user.route");
const TravelStoryRoute = require("./Routes/travelstory.route");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/auth", UserRoute);
app.use("/story", TravelStoryRoute);

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "dist", "index.html"));
// });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.listen(process.env.PORT);
console.log(`server is running on PORT: ${process.env.PORT}`);
mongoose.connect(process.env.DB_LINK);
console.log("DB connected successfully..");

module.exports = app;
