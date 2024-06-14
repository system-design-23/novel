const { default: mongoose } = require("mongoose");
const { signup, login, refreshToken } = require("../src/controller/authen");
const { fitler } = require("../src/router/authen");
const User = require("../src/db/models/user");
const browser = require("../src/db/domain/browser");
const {
  getAllSuppliers,
  removeSupplier,
  addSupplier,
  getImplementOfSuplier,
} = require("../src/controller/plugin");
const fs = require("fs");
const { error } = require("console");
const { getNovelDetail } = require("../src/controller/novel");
const Novel = require("../src/db/models/novel");
const Supplier = require("../src/db/models/supplier");
const { novelManager } = require("../src/db/manager");

describe("Read novel by Preference flow", function () {
  async function deleteOldMock() {
    await User.deleteOne({ username: "mock_admin" });
    await new Promise(async (resolve, reject) => {
      let mockLog = function (s) {
        if (s == "End") {
          resolve();
        }
      };
      let prog = await novelManager.plugOut("truyen.tangthuvien.vn");
      if (!prog) {
        resolve();
        return;
      }
      prog.onLog(mockLog);
    });
  }
  beforeAll(async () => {
    require("dotenv").config();
    mongoose
      .connect("mongodb://127.0.0.1:27017/novel")
      .then(() => console.log("Novel database connected"))
      .catch((err) => console.log(err));
    await novelManager.initiated;
    await deleteOldMock();
  });

  afterAll(async () => {
    await deleteOldMock();
    mongoose.disconnect();
    await (await browser).close();
  }, 10000);

  let res,
    req = {};
  beforeEach(() => {
    res = {
      status: jest.fn(),
      send: jest.fn(),
    };
  });

  test(
    "Try to SignUp with as admin.",
    async () => {
      req.body = {
        username: "mock_admin",
        password: "mock_admin",
        role: "admin",
        fullname: "mock_admin",
      };
      await signup(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      let tokens = res.send.mock.calls[0][0];

      req.headers = {
        authorization: "Bearer " + tokens.accessToken,
      };
      req.originalUrl = "/admin/plugin";
      res = {
        status: jest.fn(),
        send: jest.fn(),
      };
      next = jest.fn();
      await fitler(req, res, next);
      expect(next).toHaveBeenCalledWith();
    },
    10 * 60000
  );
  test(
    "Get all suppliers",
    async () => {
      await getAllSuppliers(req, res);
      let body = res.send.mock.calls[0][0];
      expect(body.length).toEqual(2);
      console.log(body);
    },
    10 * 60000
  );
  test(
    "Unplug on a non-exist domain",
    async () => {
      req.params = {
        domain_name: "vcl.vn",
      };
      await removeSupplier(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    },
    10 * 60000
  );
  test(
    "Plug 'truyen.tangthuvien.vn'",
    async () => {
      req.body = {
        domain_name: "truyen.tangthuvien.vn",
        payload: fs.readFileSync(
          "./src/db/domain/truyentangthuvien/crawler.js",
          "utf8"
        ),
      };
      res.setHeader = jest.fn();
      res.write = function (s) {
        console.log(s);
      };
      await new Promise((resolve, reject) => {
        res.end = function () {
          resolve();
        };
        addSupplier(req, res).catch((error) => {
          console.error(error);
          reject();
        });
      });
    },
    10 * 60000
  );
  test(
    "Get a novel from 'truyen.tangthuvien.vn'",
    async () => {
      let supplier = await Supplier.findOne({
        domain_name: "truyen.tangthuvien.vn",
      });
      let novel = await Novel.findOne({ "suppliers.supplier": supplier.id });
      req.query = {};
      req.params = {
        novelId: novel.id,
      };
      await getNovelDetail(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      let novelDetail = res.send.mock.calls[0][0];
      console.log(novelDetail);
    },
    10 * 60000
  );

  test(
    "Get implementation from 'lightnovel.vn'",
    async () => {
      req.params = {
        domain_name: "lightnovel.vn",
      };
      await getImplementOfSuplier(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      let code = res.send.mock.calls[0][0];
    },
    10 * 60000
  );
  test(
    "Calling unplug on 'truyen.tangthuvien.vn'",
    async () => {
      req.params = {
        domain_name: "truyen.tangthuvien.vn",
      };
      res.setHeader = jest.fn();
      res.write = function (s) {
        console.log(s);
      };
      await new Promise((resolve, reject) => {
        res.end = function () {
          resolve();
        };
        removeSupplier(req, res);
      });
    },
    10 * 60000
  );
});
