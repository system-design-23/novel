const { Router } = require("express");
const { setPref, getPref } = require("../controller/prefs");
const prefsRouter = Router();
prefsRouter.post("", setPref);
prefsRouter.get("", getPref);

module.exports = prefsRouter;
