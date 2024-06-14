const { default: mongoose } = require("mongoose");
const {
  getRecommendation,
  findNovelsByName,
  getNovelDetail,
  findNovelsByAuthor,
  getChapterDetail,
  findNovelsByCategory,
} = require("../src/controller/novel");
const browser = require("../src/db/domain/browser");
const { novelManager } = require("../src/db/manager");

describe("Novel usecase flow test", function () {
  beforeAll(async () => {
    require("dotenv").config();

    mongoose
      .connect(process.env.DB_HOST)
      .then(() => console.log("Novel database connected"))
      .catch((err) => console.error(err));
    await novelManager.initiated;
  });

  afterAll(async () => {
    mongoose.disconnect();
    await (await browser).close();
  });

  let res, req;
  beforeEach(() => {
    res = {
      status: jest.fn(),
      send: jest.fn(),
    };
    req = {};
  });
  let novel, novelDetail, chapter, chapterDetail;
  test("Take a novel from recommendation", async () => {
    req.query = {
      offset: 1,
    };
    await getRecommendation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    let novels = res.send.mock.calls[0][0].novels;
    novel = novels[5];
  }, 5000);
  test("Get all novels by name", async () => {
    req.query = {
      title: "Tiên",
    };
    await findNovelsByName(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  }, 5000);

  test("Get all novels by type", async () => {
    req.query = {
      genre: "Tiên Hiệp",
      offset: 1,
    };
    await findNovelsByCategory(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  }, 5000);

  test("Get all novels by author", async () => {
    req.query = {
      author: "SS Hà Thần",
    };
    next = jest.fn();
    await findNovelsByAuthor(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    let novels = res.send.mock.calls[0][0].novels;
    console.log(novels);
  }, 5000);
  test("Get novel detail", async () => {
    req.params = {
      novelId: novel.id,
    };
    req.query = {};

    await getNovelDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    novelDetail = res.send.mock.calls[0][0];
  }, 5000);
  test("Get chapter detail", async () => {
    chapter = novelDetail.chapters[2];
    req.params = {
      novelId: novel.id,
      chapterId: chapter.id,
    };
    req.query = {};
    await getChapterDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    chapterDetail = res.send.mock.calls[0][0];
    console.log(chapterDetail);
  }, 5000);
});
