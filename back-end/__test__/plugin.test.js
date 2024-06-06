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

describe("Read novel by Preference flow", function () {
  async function deleteOldMock() {
    let user = await User.findOne({ username: "mock_admin" });
    if (user) {
      await user.deleteOne();
    }
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

  test("Try to SignUp with as admin.", async () => {
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
  }, 3000);
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
          "../src/db/domain/truyentangthuvien/crawler.js",
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
        addNewSupplier(req, res);
      });
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
