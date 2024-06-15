const { Router } = require("express");
const jwt = require("jsonwebtoken");
const {
  refreshToken,
  login,
  signup,
  getInfo,
} = require("../controller/authen.js");

const authenRouter = Router();

async function fitler(req, res, next) {
  console.log(req.originalUrl);
  const header = req.headers["authorization"];
  const token = header ? header.split(" ")[1] : undefined;
  try {
    req.auth = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET, (err, user) => {
        if (req.originalUrl.startsWith("/u")) {
          if (err) {
            console.log(req.headers);
            console.log(err);
            reject("Un-Authorzied");
            return;
          }
        }
        if (req.originalUrl.startsWith("/admin")) {
          if (err || user.role != "admin") {
            reject("Un-Authorzied");
            return;
          }
        }
        resolve(user);
      });
    });
    next();
  } catch (error) {
    res.status(401);
    res.send(error);
  }
}
authenRouter.post("/refresh_token", refreshToken);
authenRouter.post("/login", login);
authenRouter.get("/info", getInfo);
authenRouter.post("/signup", signup);
authenRouter.post("/logout", (req, res) => {
  res.status(200).send("Logout successfully");
});

module.exports = { authenRouter, fitler };
