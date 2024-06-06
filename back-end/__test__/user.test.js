const { default: mongoose } = require("mongoose");
const { signup, login, refreshToken } = require("../src/controller/authen");
const { fitler } = require("../src/router/authen");
const User = require("../src/db/models/user");
const Prefs = require("../src/db/models/preference");
const { getNovelDetail, getChapterDetail } = require("../src/controller/novel");
const Novel = require("../src/db/models/novel");
const supplier = require("../src/db/models/supplier");
const { setPref, delPref } = require("../src/controller/prefs");
const browser = require("../src/db/domain/browser");
const {
  getReadHistory,
  setSettings,
  getSettings,
} = require("../src/controller/user");
const UserRead = require("../src/db/models/userread");
const Setting = require("../src/db/models/setting");

describe("Read novel by Preference flow", function () {
  async function deleteOldMock() {
    let user = await User.findOne({ username: "mock_user" });
    if (user) {
      await user.deleteOne();
      await UserRead.deleteMany({ user: user.id });
      await Prefs.deleteMany({ user: user.id });
      await Prefs.deleteMany({ user: user.id });
      await Setting.deleteMany({ user: user.id });
    }
  }
  async function expectReadHistory(size, topId) {
    res = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await getReadHistory(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    let history = res.send.mock.calls[0][0];
    expect(history.length).toEqual(size);
    if (topId) {
      expect(history[0].chapter.id).toEqual(topId);
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

  test("Try to SignUp with an account.", async () => {
    req.body = {
      username: "mock_user",
      password: "mock_user",
      role: "user",
      fullname: "mock_user",
    };
    await signup(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    let tokens = res.send.mock.calls[0][0];

    req.headers = {
      authorization: "Bearer " + tokens.accessToken,
    };
    req.originalUrl = "/u/";
    res = {
      status: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
    await fitler(req, res, next);
    expect(next).toHaveBeenCalledWith();
  }, 3000);

  test("Try to Access admin page with an user account.", async () => {
    req.originalUrl = "/admin";
    next = jest.fn();
    await fitler(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  }, 3000);

  test("Set a Preferences", async () => {
    req.body = {
      domain_name: "truyenfull.vn",
    };
    await setPref(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    req.body = {
      domain_name: "lightnovel.vn",
    };
    res = {
      status: jest.fn(),
      send: jest.fn(),
    };
    await setPref(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect((await Prefs.find({ user: req.auth.id })).length).toEqual(2);
  }, 10000);

  test("Read history list", async () => {
    await expectReadHistory(0);
  }, 10000);

  let novelDetail;
  test("Get a novel detail", async () => {
    req.params = {
      novelId: "6661862bd90bdf5655428847",
    };
    req.query = {};
    await getNovelDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    novelDetail = res.send.mock.calls[0][0];
    expect(novelDetail.supplier).toEqual("lightnovel.vn");
  }, 5000);

  test("Get a novel detail by domain", async () => {
    req.params = {
      novelId: "6661862bd90bdf5655428847",
    };
    req.query = {
      domain_name: "truyenfull.vn",
    };

    await getNovelDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    let body = res.send.mock.calls[0][0];
    expect(body.supplier).toEqual("truyenfull.vn");

    await expectReadHistory(0);
  }, 10000);

  test("Get a chapter detail", async () => {
    let chapter = novelDetail.chapters[0];
    req.params = {
      novelId: novelDetail.id,
      chapterId: chapter.id,
    };
    req.query = {};
    await getChapterDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    let chapterDetail = res.send.mock.calls[0][0];
    expect(chapterDetail.supplier).toEqual("lightnovel.vn");
    await expectReadHistory(1, chapter.id);
  }, 5000);

  test("Get a chapter detail by domain_name", async () => {
    req.query = {
      domain_name: "truyenfull.vn",
    };
    await getChapterDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    let chapterDetail = res.send.mock.calls[0][0];
    expect(chapterDetail.supplier).toEqual("truyenfull.vn");
    await expectReadHistory(1, chapterDetail.id);
  }, 5000);

  test("Read another novel", async () => {
    req.params = {
      novelId: "6661862bd90bdf56554287dc",
    };
    req.query = {};
    await getNovelDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    novelDetail = res.send.mock.calls[0][0];
    expect(novelDetail.supplier).toEqual("truyenfull.vn");
  }, 5000);

  test("Read a chapter of the other novel", async () => {
    let chapter = novelDetail.chapters[0];
    req.params = {
      novelId: novelDetail.id,
      chapterId: chapter.id,
    };
    req.query = {};
    await getChapterDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    let chapterDetail = res.send.mock.calls[0][0];
    expect(chapterDetail.supplier).toEqual("truyenfull.vn");
    await expectReadHistory(2, chapter.id);
  }, 5000);

  test("Read the old novel", async () => {
    req.params = {
      novelId: "6661862bd90bdf5655428847",
    };
    req.query = {};
    await getNovelDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    novelDetail = res.send.mock.calls[0][0];
    expect(novelDetail.supplier).toEqual("lightnovel.vn");
  }, 5000);

  test("Read the old chapter", async () => {
    let chapter = novelDetail.chapters[0];
    req.params = {
      novelId: novelDetail.id,
      chapterId: chapter.id,
    };
    req.query = {};
    await getChapterDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    await expectReadHistory(2, chapter.id);
  }, 5000);

  test("Update settings", async () => {
    req.body = {
      margin: 12,
      theme: "Rainbow",
    };
    await setSettings(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  }, 5000);

  test("Get settings", async () => {
    await getSettings(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    let settings = res.send.mock.calls[0][0];
    expect(settings.margin).toEqual("12");
    expect(settings.theme).toEqual("Rainbow");
  }, 5000);
});
