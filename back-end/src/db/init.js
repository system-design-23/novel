const puppeteer = require("puppeteer");
const Supplier = require("./models/supplier");
const LightnovelCrawler = require("./domain/lightnovel/crawler.js");
const { _includeNovel, _includeToDb } = require("./plugger.js");
const TruyenfullCrawler = require("./domain/truyenfull/crawler.js");
const TangThuVienCrawler = require("./domain/truyentangthuvien/crawler.js");
const MeTruyenVipCrawler = require("./domain/metruyenvip/crawler.js");
const { default: mongoose } = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/novel")
  .then(() => {
    console.log("Novel database connected");
    mongoose.connection.db.dropDatabase();
  })
  .catch((err) => console.log(err));

async function init() {
  let browser1 = await puppeteer.launch();
  let crawler1 = new TruyenfullCrawler(browser1);
  let browser2 = await puppeteer.launch();
  let crawler2 = new TangThuVienCrawler(browser2);
  let crawlers = [crawler2];
  
  for(let crawler of crawlers){
    await _includeToDb(crawler);
  }
  await dupCrawlFromOtherDomain(browser1);

  mongoose.disconnect();
  browser1.close();
  browser2.close();
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
