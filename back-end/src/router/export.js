const { Router } = require("express");
const {
  exportWithFormat,
  downloadTempfile,
  getAllFormat,
} = require("../controller/export");
const exportRouter = Router();

exportRouter.get("", getAllFormat);
exportRouter.post("", exportWithFormat);
exportRouter.get("/download", downloadTempfile);

module.exports = exportRouter;
