const express = require("express");
const mongoose = require("mongoose");
const { authenRouter, fitler } = require("./router/authen.js");
const novelRouter = require("./router/novels.js");
const userRouter = require("./router/user.js");
const pluginRouter = require("./router/plugin.js");
const exportRouter = require("./router/export.js");
const cors = require("cors");
const browser = require("./db/domain/browser.js");
const { getProgress } = require("./controller/plugin.js");

process.on("SIGINT", async function () {
  await (await browser).close();
  process.exit();
});

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
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(fitler);
app.use("/u", userRouter);
app.use("/auth", authenRouter);
app.use("/novels", novelRouter);
app.use("/admin/plugins", pluginRouter);
app.use("/export", exportRouter);
app.get("/progress", getProgress);
