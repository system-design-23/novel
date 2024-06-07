const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { refreshToken, login, signup } = require("../controller/authen.js");

const authenRouter = Router();

async function fitler(req, res, next) {
  const header = req.headers["authorization"];
  const token = header ? header.split(" ")[1] : undefined;
  try {
    req.auth = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
          if (req.originalUrl.startsWith("/u/")) {
            reject(err);
            return;
          }
        }
        resolve(user);
      });
    });
    next();
  } catch (error) {
    console.log(error);
    res.status(401);
    res.send("Un-Authorzied.");
  }
}
authenRouter.post("/refresh_token", refreshToken);
authenRouter.post("/login", login);
authenRouter.post("/signup", signup);
authenRouter.post("/logout", (req, res) => {
  res.status(200).send("Logout successfully");
});

module.exports = { authenRouter, fitler };