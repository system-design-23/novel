const { default: mongoose } = require("mongoose");
const { getChapterDetail, getNovelDetail } = require("../src/controller/novel");
const Chapter = require("../src/db/models/chapter");
const Supplier = require("../src/db/models/supplier");
const browser = require("../src/db/domain/browser");
const Novel = require("../src/db/models/novel");
const { novelManager } = require("../src/db/manager");

describe("Supplier test", function () {
  beforeAll(async () => {
    mongoose
      .connect("mongodb://127.0.0.1:27017/novel")
      .then(() => console.log("Novel database connected"))
      .catch((err) => console.error(err));
    await novelManager.initiated;
  });

  afterAll(async () => {
    mongoose.disconnect();
    await (await browser).close();
  });
  test("Get content of a chapter for each supplier", async () => {
    let chapter = await Chapter.findOne({
      $where: "this.suppliers.length > 1",
    }).populate(["suppliers.supplier", "novel"]);

    for (let z of chapter.suppliers) {
      res = {
        status: jest.fn(),
        send: jest.fn(),
      };
      await getChapterDetail(
        {
          params: {
            novelId: chapter.novel.id,
            chapterId: chapter.id,
          },
          query: {
            domain_name: z.supplier.domain_name,
          },
        },
        res
      );
      expect(res.status).toHaveBeenCalledWith(200);
    }
  }, 20000);

  test("Get content of a novel for each supplier", async () => {
    let novel = await Novel.findOne({
      $where: "this.suppliers.length > 1",
    }).populate(["suppliers.supplier"]);

    for (let z of novel.suppliers) {
      res = {
        status: jest.fn(),
        send: jest.fn(),
      };
      await getNovelDetail(
        {
          params: {
            novelId: novel.id,
          },
          query: {
            domain_name: z.supplier.domain_name,
          },
        },
        res
      );
      expect(res.status).toHaveBeenCalledWith(200);
    }
  }, 20000);
});
