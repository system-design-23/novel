const express = require("express");
const mongoose = require("mongoose");
const { authenRouter, fitler } = require("./router/authen.js");
const novelRouter = require("./router/novels.js");
const userRouter = require("./router/user.js");
const pluginRouter = require("./router/plugin.js");
const prefsRouter = require("./router/prefs.js");
require("dotenv").config();

const app = express();
const PORT = 8080;

app.listen(PORT, () => console.log("Server started"));
mongoose
  .connect(process.env.DB_HOST)
  .then(() => console.log("Novel database connected"))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use(fitler);
app.use("/u", userRouter);
app.use("/auth", authenRouter);
app.use("/novels", novelRouter);
app.use("/admin/plugins", pluginRouter);
app.use("/preference", prefsRouter);
