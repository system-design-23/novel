const { Router } = require("express");
const {
  getReadHistory,
  getSettings,
  setSettings,
} = require("../controller/user.js");

const userRouter = Router();

userRouter.get("/recent", getReadHistory);
userRouter.get("/setting", getSettings);
userRouter.post("/setting", setSettings);

module.exports = userRouter;
