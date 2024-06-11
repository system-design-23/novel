const { default: mongoose } = require("mongoose");
const { signup, login, refreshToken } = require("../src/controller/authen");
const User = require("../src/db/models/user");
const { fitler } = require("../src/router/authen");
const { Helper } = require("../src/format/helper.js");
const browser = require("../src/db/domain/browser.js");
const Chapter = require("../src/db/models/chapter.js");
const { novelManager } = require("../src/db/manager.js");
const fs = require("fs");
const { addFormatter } = require("../src/controller/plugin.js");
const { formatFactory } = require("../src/format/factory.js");


describe("Export test", function () {

  function cleanUpTemp() {
    fs.readdir("./src/format/temp", (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink("./src/format/temp/" + file, err => {
          if (err) throw err;
        });
      }
    });
  }

  beforeAll(async () => {
    mongoose
      .connect("mongodb://127.0.0.1:27017/novel")
      .then(() => console.log("Novel database connected"))
      .catch((err) => console.error(err));
    await novelManager.initiated;
    cleanUpTemp();
  });

  afterAll(async () => {
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
    "Plug 'pdf",
    async () => {
      req.body = {
        format_name: "pdf",
        dependency: "pdfkit",
        payload: fs.readFileSync(
          "./src/format/zzzzz/pdf.js",
          "utf8"
        ),
      };
      res.setHeader = jest.fn();
      await addFormatter(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    },
    10 * 60000
  );

  test(
    "Pdf",
    async () => {
      let chapter = await Chapter.findOne({
        _id: "666338c08ce7d80488b8e7c6",
      })
        .populate("suppliers.supplier")
        .populate({
          path: "novel",
          populate: {
            path: "author",
          },
        });

      const helper = new Helper(chapter, "truyenfull.vn");
      let formatter = formatFactory.get("pdf");
      await formatter.format(helper);
    },
    60000
  );
  test.skip(
    "Docx",
    async () => {
      let chapter = await Chapter.findOne({
        _id: "666338c08ce7d80488b8e7c6",
      })
        .populate("suppliers.supplier")
        .populate({
          path: "novel",
          populate: {
            path: "author",
          },
        });

      const helper = new Helper(chapter, "truyenfull.vn");
      let formatter = formatFactory.get("dox");
      await formatter.format(helper);
    }, 60000
  );


  test.skip(
    "Epub",
    async () => {
      let chapter = await Chapter.findOne({
        _id: "666338c08ce7d80488b8e7c6",
      })
        .populate("suppliers.supplier")
        .populate({
          path: "novel",
          populate: {
            path: "author",
          },
        });

      const helper = new Helper(chapter, "truyenfull.vn");
      let formatter = formatFactory.get("Epub");
      await formatter.format(helper);
    }, 60000
  );
});
