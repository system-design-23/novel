const { Router } = require("express");
const { setPref, delPref } = require("../controller/prefs");
const prefsRouter = Router();
prefsRouter.post("", setPref);
prefsRouter.delete("/:domain_name", delPref);

module.exports = prefsRouter;
