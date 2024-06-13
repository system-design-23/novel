const { Router } = require("express");
const {
  getAllSuppliers,
  addSupplier,
  removeSupplier,
  getImplementOfSuplier,
  getImplementOfFormatter,
  addFormatter,
  removeFormatter,
  getAddingProgress,
} = require("../controller/plugin.js");
const { getAllFormat } = require("../controller/export.js");
const pluginRouter = Router();

pluginRouter.get("/supplier/progress", getAddingProgress);
pluginRouter.get("/supplier", getAllSuppliers);
<<<<<<< HEAD
<<<<<<< HEAD
pluginRouter.post("/supplier", addSupplier);
pluginRouter.get("/supplier/:domain_name", getImplementOfSuplier);
pluginRouter.delete("/supplier/:domain_name", removeSupplier);
=======
pluginRouter.get("/supplier/:domain_name", getImplementOfSuplier);
pluginRouter.post("/supplier/plug", addSupplier);
pluginRouter.delete("/supplier/unplug/:domain_name", removeSupplier);
>>>>>>> 0febdf36 (refactor code)
=======
pluginRouter.post("/supplier", addSupplier);
pluginRouter.get("/supplier/:domain_name", getImplementOfSuplier);
pluginRouter.delete("/supplier/:domain_name", removeSupplier);
>>>>>>> fc89e633 (dang test phan plugin export)

pluginRouter.get("/format", getAllFormat);
pluginRouter.post("/format", addFormatter);
pluginRouter.get("/format/:format_name", getImplementOfFormatter);
pluginRouter.delete("/format/:format_name", removeFormatter);

module.exports = pluginRouter;
