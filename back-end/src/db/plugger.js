const fs = require("fs");
const browser = require("./domain/browser.js");
const Novel = require("./models/novel.js");
const Author = require("./models/author.js");
const Chapter = require("./models/chapter.js");
const Supplier = require("./models/supplier.js");

class Plugger {
  constructor() {
    this.plugins = this.init();
  }
  async init() {
    let sups = await Supplier.find();
    let plugins = {};
    for (let sup of sups) {
      let domain_name = sup.domain_name;
      let Crawler = require("./plug-in/" + domain_name + ".js");
      let crawler = new Crawler(await browser);

      plugins[domain_name] = crawler;
    }
    return plugins;
  }
  async includePlugin(domain_name, jsfile) {
    let plugins = await this.plugins;
    try {
      fs.writeFileSync("./src/db/plug-in/" + domain_name + ".js", jsfile);

      let Crawler = require("./plug-in/" + domain_name + ".js");
      let crawler = new Crawler(await browser);

      plugins[domain_name] = crawler;
      await _includeToDb(crawler);
    } catch (error) {
      console.error(error);
    }
  }
  async excludePlugin(domain_name) {
    let plugins = await this.plugins;
    try {
      let crawler = plugins[domain_name];
      if (crawler) {
        console.log("Okk");
        delete plugins[domain_name];
        /* unplug completely the module, using common js instead of ES6 
      becase ES6 makes the module static, can't be removed until the end of the app
       */
        delete require.cache[
          require.resolve("./plug-in/" + domain_name + ".js")
        ];
        await _excludeFromDb(crawler);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async get(domain_name) {
    let plugins = await this.plugins;
    if (!domain_name) {
      return Object.values(plugins)[0];
    }
    return plugins[domain_name];
  }
}

async function _includeToDb(crawler) { 
  
  let url = crawler.url;
  let domain_name = crawler.domain_name;

  let supplier = new Supplier({
    url: url,
    domain_name: domain_name,
  });
  await supplier.save();

  console.log("Start crawling from " + url);
  let cates = await crawler.crawlNovelType(url);
  let cached = new Set();
  for (let [key, value] of Object.entries(cates)) {
    let getNovelUrls = await crawler.crawlNovelsByType(value);
    let start = new Date();
    for (let novelUrl of getNovelUrls) {
      if (cached.has(novelUrl)) {
        continue;
      }
      cached.add(novelUrl);
      await _includeNovel(supplier, crawler, novelUrl);
    }
    await supplier.save();
    console.log(
      "End parsing " + key + " in " + (new Date() - start) / 1000 + " seconds"
    );
  }
  console.log("....................End.....................");
  
}

async function _includeNovel(supplier, crawler, novelUrl) {
  let novelData = await crawler.crawlNovel(novelUrl);
  if (!novelData) {
    return;
  }
  let novel = await Novel.findOne({ name: novelData.name });
  let chapters = novelData.chapters;

  if (!novel) {
    let name = novelData.name;
    let thumbnail = novelData.thumbnailUrl;
    let categories = novelData.categories;
    let author = await Author.findOne({ name: novelData.author });
    if (!author) {
      author = new Author({ name: novelData.author });
      await author.save();
    }

    novel = new Novel({
      name: name,
      author: author.id,
      thumbnail: thumbnail,
      url: novelUrl,
      categories: categories,
    });
  }
  for (let [numChap, info] of Object.entries(chapters)) {
    console.log(novel.name+"  -  "+numChap+"  :  "+ info.title);
    let chapter = await Chapter.findOne({
      number: Number(numChap),
      novel: novel.id,
    });
    if (!chapter) {
      chapter = new Chapter({
        number: Number(numChap),
        title: info.title,
        url: info.url,
        novel: novel.id,
      });
    }
    chapter.suppliers.push({ supplier: supplier.id, url: info.url });
    _includeSuppliers(chapter, novelData);
    await chapter.save();
  }
  novel.suppliers.push({ supplier: supplier.id, url: novelUrl });
  await novel.save();
}

async function _includeSuppliers(chapter, novelData){
  let novelList = await Novel.find({ name: novelData.name });
  for(let novel of novelList){
    let chapterTempList = await Chapter.find({
      number: chapter.number,
      novel: novel.id,
    });
    for(let chapterTemp of chapterTempList){
      chapter.suppliers.push({ supplier: chapterTemp.suppliers.supplier, url: chapterTemp.suppliers.url });
    }    
  }
}


async function _excludeFromDb(crawler) {
  let supplier = await Supplier.findOne({ url: crawler.url })
    .populate("novels")
    .populate("chapters");
  for (let novel of supplier.novels) {
    for (let i = 0; i < novel.suppliers.length; i++) {
      let s = novel.suppliers[i];
      if (s.supplier == supplier.id) {
        novel.suppliers.splice(i, 1);
        break;
      }
    }
    if (novel.suppliers.length == 0) {
      await novel.deleteOne();
    } else {
      await novel.save();
    }
  }
  let chapters = Chapter.find({ suppliers: supplier.id });

  for (let chapter of chapters) {
    for (let i = 0; i < chapter.suppliers.length; i++) {
      let s = chapter.suppliers[i];
      if (s.supplier == supplier.id) {
        chapter.suppliers.splice(i, 1);
        break;
      }
    }
    if (chapter.suppliers.length == 0) {
      await chapter.deleteOne();
    } else {
      await chapter.save();
    }
  }
  await supplier.deleteOne();
}
const plugger = new Plugger();

module.exports = {
  _includeNovel,
  _includeToDb,
  plugger,
};
