const { default: mongoose } = require("mongoose");
const { signup, login, refreshToken } = require("../src/controller/authen");
const { fitler } = require("../src/router/authen");
const User = require("../src/db/models/user");
const browser = require("../src/db/domain/browser");
const {
  getAllSuppliers,
  deleteSupplier,
  addNewSupplier,
} = require("../src/controller/plugin");
const fs = require("fs");
const { plugger } = require("../src/db/plugger");
const { error } = require("console");
const { getNovelDetail } = require("../src/controller/novel");
const Novel = require("../src/db/models/novel");
const Supplier = require("../src/db/models/supplier");

describe("Read novel by Preference flow", function () {
  async function deleteOldMock() {
    await User.deleteOne({ username: "mock_admin" });
    await new Promise(async (resolve, reject) => {
      let mockLog = function (s) {
        console.log(s);
        if (s.includes("...End...")) {
          resolve();
        }
      };
      let prog = await plugger.excludePlugin("truyen.tangthuvien.vn");
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

    await deleteOldMock();
  });

  afterAll(async () => {
    await deleteOldMock();
    mongoose.disconnect();
    (await browser).close();
  });

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
    "Calling get all suppliers",
    async () => {
      await getAllSuppliers(req, res);
      let body = res.send.mock.calls[0][0];
      expect(body.length).toEqual(2);
      console.log(body);
    },
    10 * 60000
  );
  test(
    "Calling unplug on a non-exist domain",
    async () => {
      req.params = {
        domain_name: "vcl.vn",
      };
      await deleteSupplier(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    },
    10 * 60000
  );
  test(
    "Calling plug on a 'truyen.tangthuvien.vn'",
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
        addNewSupplier(req, res).catch((error) => {
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
        deleteSupplier(req, res);
      });
    },
    10 * 60000
  );
});
