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

pluginRouter.get("/supplier", getAllSuppliers);
pluginRouter.get("/supplier/:domain_name", getImplementOfSuplier);
pluginRouter.post("/supplier/plug", addSupplier);
pluginRouter.delete("/supplier/unplug/:domain_name", removeSupplier);

pluginRouter.get("format/:format_name", getImplementOfFormatter);
pluginRouter.post("/format/plug", addFormatter);
pluginRouter.delete("/format/unplug/:format_name", removeFormatter);

module.exports = pluginRouter;
