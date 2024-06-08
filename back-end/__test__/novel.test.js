const { default: mongoose } = require("mongoose");
const {
  getRecommendation,
  findNovelsByName,
  getNovelDetail,
  findNovelsByAuthor,
  getChapterDetail,
} = require("../src/controller/novel");
const browser = require("../src/db/domain/browser");
describe("Novel usecase flow test", function () {
  beforeAll(() => {
    mongoose
      .connect("mongodb://127.0.0.1:27017/novel")
      .then(() => console.log("Novel database connected"))
      .catch((err) => console.log(err));
  });

  afterAll(async () => {
    mongoose.disconnect();
    (await browser).close();
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
    await getRecommendation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    let novels = res.send.mock.calls[0][0];
    novel = novels[5];
  }, 5000);
  test("Get the novel by name", async () => {
    req.query = {
      title: "Tiên",
    };
    await findNovelsByName(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    let novels = res.send.mock.calls[0][0];
  }, 5000);

  test("Get the novel by author", async () => {
    req.query = {
      author: "Bông Lan",
    };
    next = jest.fn();
    await findNovelsByAuthor(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);

    let novels = res.send.mock.calls[0][0];
    console.log(novels);
  }, 5000);
  test("Get the novel detail", async () => {
    req.params = {
      novelId: novel.id,
    };
    req.query = {};

    await getNovelDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    novelDetail = res.send.mock.calls[0][0];
  }, 5000);
  test("Get chapter detail", async () => {
    chapter = novelDetail.chapters[0];
    req.params = {
      novelId: novel.id,
      chapterId: chapter.id,
    };
    req.query = {};
    await getChapterDetail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    chapterDetail = res.send.mock.calls[0][0];
  }, 5000);
});

test("Find novels by year", async () => {
  req.query = {
    year: 2020,
  };
  await findNovelsByYear(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  const novels = res.send.mock.calls[0][0];
  expect(novels).toBeInstanceOf(Array);
  novels.forEach(novel => {
    expect(novel.year).toBe(2020);
  });
}, 5000);

test("Find novels by genre", async () => {
  req.query = {
    genre: "Fantasy",
  };
  await findNovelsByGenre(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  const novels = res.send.mock.calls[0][0];
  expect(novels).toBeInstanceOf(Array);
  novels.forEach(novel => {
    expect(novel.genre).toBe("Fantasy");
  });
}, 5000);
