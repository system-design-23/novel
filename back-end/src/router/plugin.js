const { Router } = require("express");
const {
  getAllSuppliers,
  addNewSupplier,
  deleteSupplier,
} = require("../controller/plugin.js");
const pluginRouter = Router();

pluginRouter.get("", getAllSuppliers);
pluginRouter.post("/plug", addNewSupplier);
pluginRouter.delete("/unplug/:domain_name", deleteSupplier);

module.exports = pluginRouter;
