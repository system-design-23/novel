const { Router } = require("express");
const {
  getAllSuppliers,
  addSupplier,
  removeSupplier,
  getImplementOfSuplier,
  getImplementOfFormatter,
  addFormatter,
  removeFormatter,
} = require("../controller/plugin.js");
const pluginRouter = Router();

pluginRouter.get("/domain", getAllSuppliers);
pluginRouter.get("/domain/:domain_name", getImplementOfSuplier);
pluginRouter.post("/domain/plug", addSupplier);
pluginRouter.delete("/domain/unplug/:domain_name", removeSupplier);

pluginRouter.get("format/:format_name", getImplementOfFormatter);
pluginRouter.post("/format/plug", addFormatter);
pluginRouter.delete("/format/unplug/:format_name", removeFormatter);

module.exports = pluginRouter;
