const { default: mongoose } = require("mongoose");
const { signup, login, refreshToken } = require("./src/controller/authen");
const { fitler } = require("./src/router/authen");
const User = require("./src/db/models/user");
const browser = require("./src/db/domain/browser");
const {
  getAllSuppliers,
  removeSupplier,
  addSupplier,
  getImplementOfSuplier,
} = require("./src/controller/plugin");
const fs = require("fs");
const { error } = require("console");
const { getNovelDetail } = require("./src/controller/novel");
const Novel = require("./src/db/models/novel");
const Supplier = require("./src/db/models/supplier");
const { novelManager } = require("./src/db/manager");

async function deleteOldMock() {
  await new Promise(async (resolve, reject) => {
    let progress_id = await novelManager.plugOut("truyen.tangthuvien.vn");
    if (!progress_id) {
      resolve();
      return;
    }
    let prog = novelManager.findProgress(progress_id);
    prog.onEnd(() => {
      resolve();
    });
  });
}
async function clean() {
  require("dotenv").config();
  mongoose
    .connect(process.env.DB_HOST)
    .then(() => console.log("Novel database connected"))
    .catch((err) => console.log(err));
  await novelManager.initiated;
  await deleteOldMock();
  mongoose.disconnect();
  await (await browser).close();
  process.exit();
}

clean();
