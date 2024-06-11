const User = require("../db/models/user.js");
const jwt = require("jsonwebtoken");

function createToken(user) {
  const jwtToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      fullname: user.fullname,
    },
    process.env.SECRET,
    {
      expiresIn: "10h",
    }
  );
  const refreshToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      fullname: user.fullname,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return [jwtToken, refreshToken];
}
function sendToken(res, user) {
  res.status(200);
  let tokens = createToken(user);
  let body = {
    userInfo: {
      fullname: user.fullname,
      role: user.role,
    },
    accessToken: tokens[0],
    refreshToken: tokens[1],
    expiresIn: 10 * 60 * 60,
    tokenType: "Bearer",
    authorization: user.role,
  };
  res.send(body);
}

async function refreshToken(req, res) {
  let token = req.body;
  try {
    let user = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.REFRESH_SECRET, (err, user) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
    });
    sendToken(res, user);
  } catch (error) {
    console.error(error);
    res.status(401);
    res.send("Un-Authorzied.");
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (!user) {
    res.status(401);
    res.send("Username does not exist");
    return;
  }
  if (user.password != password) {
    res.status(401);
    res.send("Wrong password");
    return;
  }
  sendToken(res, user);
}

async function getInfo(req, res) {
  const header = req.headers["authorization"];
  const token = header ? header.split(" ")[1] : undefined;
  try {
    let user = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
          reject("Invalid token");
          return;
        }
        resolve(user);
      });
    });
    res.send({ fullname: user.fullname, role: user.role });
    res.status(200);
  } catch (error) {
    res.status(401);
    res.send(error);
  }
}
async function signup(req, res) {
  const { username, password, fullname, role } = req.body;
  console.log(req.body);
  let user = await User.findOne({ username: username });
  if (user) {
    res.status(400);
    res.send("Username exists");
    return;
  }
  user = await User.create({
    username: username,
    password: password,
    fullname: fullname,
    role: role,
  });
  sendToken(res, user);
}

module.exports = { login, signup, refreshToken, getInfo };
