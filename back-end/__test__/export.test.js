const { default: mongoose } = require("mongoose");
const { signup, login, refreshToken } = require("../src/controller/authen");
const User = require("../src/db/models/user");
const { fitler } = require("../src/router/authen");
const { Helper } = require("../src/format/helper.js");
const browser = require("../src/db/domain/browser.js");
const { Formatter } = require("../src/format/vcl/pdf.js");
const Chapter = require("../src/db/models/chapter.js");
describe("Authentication test", function () {
  beforeAll(() => {
    mongoose
      .connect("mongodb://127.0.0.1:27017/novel")
      .then(() => console.log("Novel database connected"))
      .catch((err) => console.error(err));
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
      let formatter = new Formatter("pdf");
      await formatter.format(helper);
    },
    15 * 1000
  );
});
