const { default: mongoose } = require("mongoose");
const { signup, login, refreshToken } = require("../src/controller/authen");
const { fitler } = require("../src/router/authen");
const User = require("../src/db/models/user");
const Prefs = require("../src/db/models/preference");
const { getNovelDetail } = require("../src/controller/novel");
const Novel = require("../src/db/models/novel");
const Supplier = require("../src/db/models/supplier");
const { setPref, delPref } = require("../src/controller/prefs");
const browser = require("../src/db/domain/browser");
const { novelManager } = require("../src/db/manager");

describe("Read novel by Preference flow", function () {
  async function expectOnPrefs(length, topDomain) {
    let prefs = await Prefs.find({ user: req.auth.id })
      .sort({ order: -1 })
      .populate("supplier");

    expect(prefs.length).toEqual(length);
    if (topDomain) {
      expect(prefs[0].supplier.domain_name).toEqual(topDomain);
    }
  }
  function expectSupplier(domain_name, supplier) {
    expect(domain_name).toEqual(supplier);
  }

  async function deleteOldMock() {
    let user = await User.findOne({ username: "admin_prefs" });
    if (user) {
      await Prefs.deleteMany({ user: user.id });
      await user.deleteOne();
    }
  }

  beforeAll(async () => {
    require("dotenv").config();
    mongoose
      .connect("mongodb://127.0.0.1:27017/novel")
      .then(() => console.log("Novel database connected"))
      .catch((err) => console.error(err));
    await novelManager.initiated;

    await deleteOldMock();
  });

  afterAll(async () => {
    await deleteOldMock();
    mongoose.disconnect();
    await (await browser).close();
  });

  let res,
    req = {};
  beforeEach(() => {
    res = {
      status: jest.fn(),
      send: jest.fn(),
    };
  });

  test("Try to SignUp with Admin account.", async () => {
    req.body = {
      username: "admin_prefs",
      password: "admin_prefs",
      role: "admin",
      fullname: "admin_prefs",
    };
    await signup(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    let tokens = res.send.mock.calls[0][0];

    req.headers = {
      authorization: "Bearer " + tokens.accessToken,
    };
    req.originalUrl = "/u";
    res = {
      status: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
    await fitler(req, res, next);
    expect(next).toHaveBeenCalledWith();
  }, 3000);

  let suppliers, novelId;
  test("Try to read Novel without Preferences", async () => {
    let novel = await Novel.findOne({ $where: 'this.suppliers.length > 1' })
      .populate("suppliers.supplier");
    novelId = novel.id;
    suppliers = novel.suppliers.map((z) => z.supplier);

    req.params = {
      novelId: novelId,
    };
    req.query = {};
    await getNovelDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  }, 10000);

  test("Try to read Novel with a specified domain", async () => {
    req.params = {
      novelId: "666338c08ce7d80488b8e7ac",
    };
    req.query = {
    };
    await getNovelDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  }, 10000);


  test("Try to read Novel with a specified domain", async () => {
    req.params = {
      novelId: novelId,
    };
    req.query = {
      domain_name: suppliers[0].domain_name,
    };
    await getNovelDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    let novelDetail = res.send.mock.calls[0][0];

    expectSupplier(novelDetail.supplier, suppliers[0].domain_name);
  }, 10000);

  test("Try to set a Preference", async () => {
    req.body = {
      domain_names: [suppliers[0].domain_name],
    };
    await setPref(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    await expectOnPrefs(1, suppliers[0].domain_name);
  }, 10000);

<<<<<<< HEAD
<<<<<<< HEAD
=======
  test("Try to delete a Preference.", async () => {
    req.params = {
      domain_name: suppliers[0].domain_name,
    };
    await delPref(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    await delPref(req, res);
    expect(res.status).toHaveBeenCalledWith(400);

    await expectOnPrefs(0);
  }, 10000);
=======
>>>>>>> fc89e633 (dang test phan plugin export)

>>>>>>> 0febdf36 (refactor code)
  test("Set 2 Preferences", async () => {
    req.body = {
      domain_names: [suppliers[1].domain_name, suppliers[0].domain_name],
    };
    await setPref(req, res);
    await expectOnPrefs(2, suppliers[1].domain_name);
  }, 10000);

  test("Try to read Novel base on preference", async () => {
    req.params = {
      novelId: novelId,
    };
    req.query = {};
    await getNovelDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    let novelDetail = res.send.mock.calls[0][0];
    expectSupplier(novelDetail.supplier, suppliers[1].domain_name);
  }, 10000);
<<<<<<< HEAD
<<<<<<< HEAD

  test("Swap 2 Preferences", async () => {
=======
  test("Swapt 2 Preferences", async () => {
>>>>>>> 0febdf36 (refactor code)
=======

  test("Swap 2 Preferences", async () => {
>>>>>>> 0b26abfa (tích hợp phần export vô plugin ok)
    req.body = {
      domain_names: [suppliers[0].domain_name, suppliers[1].domain_name],
    };
    await setPref(req, res);
    await expectOnPrefs(2, suppliers[0].domain_name);
  }, 10000);

  test("Try to read Novel with preference of a", async () => {
    req.params = {
      novelId: novelId,
    };
    await getNovelDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    let novelDetail = res.send.mock.calls[0][0];
    expectSupplier(novelDetail.supplier, suppliers[0].domain_name);
  }, 10000);

  test("Try to read Novel with a specified domain", async () => {
    req.params = {
      novelId: novelId,
    };
    req.query = {
      domain_name: suppliers[1].domain_name,
    };
    await getNovelDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    let novelDetail = res.send.mock.calls[0][0];

    expectSupplier(novelDetail.supplier, suppliers[1].domain_name);
<<<<<<< HEAD
=======

>>>>>>> 0b26abfa (tích hợp phần export vô plugin ok)
  }, 10000);
});
