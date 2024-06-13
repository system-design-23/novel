const fs = require("fs");
const browser = require("./domain/browser.js");
const Novel = require("./models/novel.js");
const Author = require("./models/author.js");
const Chapter = require("./models/chapter.js");
const Supplier = require("./models/supplier.js");
const Category = require("./models/category.js");
const { v4: uuidv4 } = require("uuid");

class NovelManager {
  constructor() {
    this.observers = [];
    this.initiated = this.init();
    this.progress_store = new Map();
  }
  async init() {
    this.plugins = new Map();
    let dbReady = new Promise((resolve, reject) => {
      mongoose.connection.on("connected", resolve);
    });
    await dbReady;
    let sups = await Supplier.find();
    for (let sup of sups) {
      let domain_name = sup.domain_name;
      let Crawler = require("./plug-in/" + domain_name + ".js");
      this.plugins.set(domain_name, Crawler);
      this.update({ domain_name, Crawler });
    }
  }
  update(plugin) {
    for (let observer of this.observers) {
      observer.onPlugIn(plugin);
    }
  }
  observe(observer) {
    this.observers.push(observer);
    this.plugins.forEach((value, key) => {
      observer.onPlugIn({ domain_name: key, Crawler: value });
    });
  }

  async plugIn(domain_name, jsfile) {
    await this.initiated;

    let plugins = this.plugins;
    if (plugins.has(domain_name)) {
      return null;
    }

    try {
      fs.writeFileSync("./src/db/plug-in/" + domain_name + ".js", jsfile);

      let Crawler = require("./plug-in/" + domain_name + ".js");
      plugins.set(domain_name, Crawler);

      let prog = new Progress();
      let plugin = { domain_name, Crawler };
      _includeToDb(new Crawler(await browser), prog)
        .then(() => {
          this.update(plugin);
        })
        .catch((error) => {
          console.error(error);
        });
      return prog;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
  async plugOut(domain_name) {
    await this.initiated;
    let plugins = this.plugins;
    try {
      const Crawler = plugins.get(domain_name);

      if (!Crawler) {
        return null;
      }

      for (let observer of this.observers) {
        observer.onPlugOut({ domain_name, Crawler });
      }

      plugins.delete(domain_name);
      /* unplug completely the module, using common js instead of ES6 
      becase ES6 makes the module static, can't be removed until the end of the app
       */
      delete require.cache[require.resolve("./plug-in/" + domain_name + ".js")];

      try {
        fs.unlinkSync("./src/db/plug-in/" + domain_name + ".js");
      } catch (error) {}
      let prog = {
        log: console.log,
        onLog: function (x) {
          this.log = x;
        },
      };
      _excludeFromDb(domain_name, prog);

      return progress_id;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
  findAll() {
    return this.plugins.keys();
  }

  findCode(domain_name) {
    if (this.plugins.has(domain_name)) {
      let file = fs.readFileSync(
        "./src/db/plug-in/" + domain_name + ".js",
        "utf8"
      );
      return file;
    }
    return null;
  }

  findProgress(progress_id) {
    return this.progress_store.get(progress_id);
  }
}

async function _includeToDb(crawler, prog) {
  let url = crawler.url;
  let domain_name = crawler.domain_name;

  let supplier = await Supplier.create({
    url: url,
    domain_name: domain_name,
  });

  let cates = await crawler.crawlNovelType(url);
  let cached = new Set();
  let step = 0;
  let total = Object.keys(cates).length;
  for (let [key, value] of Object.entries(cates)) {
    let this_prog = (step++ / total) * 100;
    prog.log(Math.floor(this_prog));
    console.log(Math.floor(this_prog));
    let getNovelUrls = await crawler.crawlNovelsByType(value);
    for (let i = 0; i < getNovelUrls.length; i++) {
      this_prog += (1 / getNovelUrls.length / total) * 100;
      prog.log(Math.floor(this_prog));
      let novelUrl = getNovelUrls[i];
      if (cached.has(novelUrl)) {
        continue;
      }
      cached.add(novelUrl);
      await _includeNovel(supplier, crawler, novelUrl);
    }
    await supplier.save();
  }
  prog.log("End");
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
    });
    for (let category of novelData.categories) {
      await Category.create({ name: category, novel: novel.id });
    }
  }
  for (let [numChap, info] of Object.entries(chapters)) {
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
    await chapter.save();
  }
  novel.suppliers.push({ supplier: supplier.id, url: novelUrl });
  await novel.save();
}

async function _excludeFromDb(domain_name, prog) {
  let supplier = await Supplier.findOne({ domain_name: domain_name });
  if (!supplier) {
    return;
  }
  let novels = await Novel.find({ "suppliers.supplier": supplier.id });
  let chapters = await Chapter.find({ "suppliers.supplier": supplier.id });
  let total = novels.length + chapters.length;
  let p = 0;
  prog.log("0");

  for (let novel of novels) {
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
    prog.log("" + Math.floor((++p / total) * 100));
  }

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
    prog.log("" + Math.floor((++p / total) * 100));
  }
  await supplier.deleteOne();
  prog.log("End");
}
const novelManager = new NovelManager();

module.exports = {
  _includeNovel,
  _includeToDb,
  _excludeFromDb,
  novelManager,
};
