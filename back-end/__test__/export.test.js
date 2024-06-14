const { default: mongoose } = require("mongoose");
const { signup, login, refreshToken } = require("../src/controller/authen");
const User = require("../src/db/models/user");
const { fitler } = require("../src/router/authen");
const { Helper } = require("../src/format/helper.js");
const browser = require("../src/db/domain/browser.js");
const Chapter = require("../src/db/models/chapter.js");
const { novelManager } = require("../src/db/manager.js");
const fs = require("fs");
const {
  addFormatter,
  removeFormatter,
} = require("../src/controller/plugin.js");
const { formatFactory } = require("../src/format/factory.js");
const { formatManager } = require("../src/format/manager.js");

describe("Export test", function () {
  async function cleanUp() {
    fs.readdir("./src/format/temp", (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink("./src/format/temp/" + file, (err) => {
          if (err) throw err;
        });
      }
    });
    await formatManager.plugOut("docx");
  }

  beforeAll(async () => {
    require("dotenv").config();

    mongoose
      .connect(process.env.DB_HOST)
      .then(() => console.log("Novel database connected"))
      .catch((err) => console.error(err));
    await novelManager.initiated;
    await cleanUp();
  });

  afterAll(async () => {
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

  test("Export Pdf", async () => {
    let chapter = await Chapter.findOne()
      .populate("suppliers.supplier")
      .populate({
        path: "novel",
        populate: {
          path: "author",
        },
      });

    const helper = new Helper(chapter, "truyenfull.vn");
    let formatter = formatFactory.create("pdf");
    await formatter.format(helper);
  }, 60000);
  test(
    "Plug Docx",
    async () => {
      req.body = {
        format_name: "docx",
        dependency: "docx",
        payload: fs.readFileSync("./src/format/zzzzz/docx.docx.js", "utf8"),
      };
      res.setHeader = jest.fn();
      await addFormatter(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    },
    10 * 60000
  );
  test("Export Docx", async () => {
    let chapter = await Chapter.findOne()
      .populate("suppliers.supplier")
      .populate({
        path: "novel",
        populate: {
          path: "author",
        },
      });

    const helper = new Helper(chapter, "truyenfull.vn");
    let formatter = formatFactory.create("docx");
    await formatter.format(helper);
  }, 60000);

  test(
    "Calling unplug on 'docx'",
    async () => {
      req.params = {
        format_name: "docx",
      };
      await removeFormatter(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    },
    10 * 60000
  );
});
