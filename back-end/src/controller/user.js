const Novel = require("../db/models/novel.js");
const User = require("../db/models/user.js");
const Author = require("../db/models/author.js");
const UserRead = require("../db/models/userread.js");
const { novelToJson } = require("../controller/utils.js");
const Setting = require("../db/models/setting.js");

async function getReadHistory(req, res) {
  const auth = req.auth;
  try {
    let reads = await UserRead.find({ user: auth.id })
      .sort({ readAt: -1 })
      .populate("chapter")
      .populate({
        path: "novel",
        populate: {
          path: "author",
        },
      });
    let novels = await Promise.all(
      reads.map(async (read) => {
        let chapter = read.chapter;
        let novel = read.novel;

        let body = await novelToJson(novel);
        body.chapter = {
          id: chapter.id,
          title: chapter.title,
          number: chapter.number,
          url: chapter.url,
        };
        body.time = read.readAt;
        return body;
      })
    );
    res.status(200);
    res.send(novels);
  } catch (error) {
    console.error(error);
    res.status(400);
    res.send("Bad request");
  }
}

async function getSettings(req, res) {
  const auth = req.auth;
  try {
    let setting = await Setting.findOne({ user: auth.id });
    if (setting) {
      let configs = setting.configs;
      let body = {};
      for (let config of configs) {
        body[config.name] = config.value;
      }
      res.send(body);
    } else {
      res.send({});
    }
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(400);
    res.send("Bad request");
  }
}

async function setSettings(req, res) {
  const auth = req.auth;
  let _configs = req.body;
  try {
    let setting = await Setting.findOne({ user: auth.id });
    if (!setting) {
      setting = await Setting.create({ user: auth.id });
    }
    let configs = new Map();
    for (let config of setting.configs) {
      configs.set(config.name, config.value);
    }
    for (let config_key of Object.keys(_configs)) {
      configs.set(config_key, _configs[config_key]);
    }
    setting.configs = [];
    for (let [config_key, value] of configs) {
      setting.configs.push({ name: config_key, value: value });
    }
    await setting.save();
    res.status(200);
    res.send("Success");
  } catch (error) {
    console.error(error);
    res.status(400);
    res.send("Bad request");
  }
}

module.exports = { getReadHistory, getSettings, setSettings };
