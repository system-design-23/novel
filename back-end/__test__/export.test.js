const { default: mongoose } = require("mongoose");
const { signup, login, refreshToken } = require("../src/controller/authen");
const User = require("../src/db/models/user");
const { fitler } = require("../src/router/authen");
const { Helper } = require("../src/format/helper.js");
const browser = require("../src/db/domain/browser.js");
const DocxFormatter = require("../src/format/plug-in/docx.js").Formatter;
const PdfFormatter = require("../src/format/plug-in/pdf.js").Formatter;
const EpubFormatter = require("../src/format/plug-in/epub.js").Formatter;
const Chapter = require("../src/db/models/chapter.js");
const { novelManager } = require("../src/db/manager.js");
const fs = require("fs");


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
      let formatter = new PdfFormatter("pdf");
      await formatter.format(helper);
    },
    10000
  );
  test(
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
      let formatter = new DocxFormatter("docx");
      await formatter.format(helper);
    }, 10000
  );


  test(
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
      let formatter = new EpubFormatter("epub");
      await formatter.format(helper);
    }, 10000
  );
});
