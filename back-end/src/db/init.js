const puppeteer = require("puppeteer");
const Supplier = require("./models/supplier");
const LightnovelCrawler = require("./domain/lightnovel/crawler.js");
const { _includeNovel, _includeToDb } = require("./plugger.js");
const TruyenfullCrawler = require("./domain/truyenfull/crawler.js");
const { default: mongoose } = require("mongoose");
const User = require("./models/user.js");

mongoose
  .connect("mongodb://127.0.0.1:27017/novel")
  .then(() => {
    console.log("Novel database connected");
    mongoose.connection.db.dropDatabase();
  })
  .catch((err) => console.error(err));

async function init() {
  await User.create({
    username: "admin",
    password: "admin",
    role: "admin",
    fullname: "admin",
  });
  let browser = await puppeteer.launch();
  let crawler = new TruyenfullCrawler(browser);
  await _includeToDb(crawler, console);
  await dupCrawlFromOtherDomain(browser);

  mongoose.disconnect();
  browser.close();
  process.exit();
}

/* Manually crawl dupliation for multi-source option from the client side */
async function dupCrawlFromOtherDomain(browser) {
  let supplier = new Supplier({
    url: "https://lightnovel.vn",
    domain_name: "lightnovel.vn",
  });
  await supplier.save();

  let novelUrls = [
    "https://lightnovel.vn/truyen/chin-vi-tien-nu-xinh-dep-cua-toi",
    "https://lightnovel.vn/truyen/thien-tai-tien-dao",
    "https://lightnovel.vn/truyen/chi-ton-kiem-de",
    "https://lightnovel.vn/truyen/ta-co-he-thong-than-cap-vo-dich",
    "https://lightnovel.vn/truyen/hong-mon-chi-ton",
  ];
  let crawler = new LightnovelCrawler(browser);
  for (let novelUrl of novelUrls) {
    let start = new Date();
    console.log("Start parsing " + novelUrl);
    await _includeNovel(supplier, crawler, novelUrl);
    console.log(
      "End parsing " +
        novelUrl +
        " in " +
        (new Date() - start) / 1000 +
        " seconds"
    );
  }
  console.log("....................End.....................");
}

init();
