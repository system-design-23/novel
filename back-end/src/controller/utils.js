const { crawlerFactory } = require("../db/factory.js");
const Category = require("../db/models/category.js");
const Chapter = require("../db/models/chapter.js");
const Novel = require("../db/models/novel.js");
const Prefs = require("../db/models/preference.js");
const Supplier = require("../db/models/supplier.js");
async function novelsToJson(novels) {
  return Promise.all(
    novels.map(async (novel) => {
      return novelToJson(novel);
    })
  );
}
async function novelToJson(novel) {
  let cates = await Category.find({ novel: novel.id });
  let body = {
    id: novel.id,
    name: novel.name,
    author: novel.author.name,
    url: novel.thumbnail,
    categories: cates.map((c) => c.name),
  };
  return body;
}

async function parseNovelContent({ novel, user, domain_name }) {
  let body = await novelToJson(novel);
  await novel.populate("suppliers.supplier");
  if (!domain_name) {
    let domains = novel.suppliers.map((sup) => sup.supplier.domain_name);
    domain_name = await defaultDomain(user ? user.id : undefined, domains);
  }
  let url = novel.suppliers.find(
    (z) => z.supplier.domain_name === domain_name
  ).url;
  let crawler = await crawlerFactory.get(domain_name);
  let desc = await crawler.crawlDesc(url);
  body.description = desc;
  body.supplier = domain_name;
  body.suppliers = novel.suppliers.map((z) => z.supplier.domain_name);
  return body;
}
async function parseNovelChapList(novel) {
  let chaps = await Chapter.find({ novel: novel.id }).sort({ number: 1 });
  return chaps.map((chap) => {
    return {
      id: chap.id,
      number: chap.number,
      title: chap.title,
    };
  });
}

async function parseChapterContent({ chapter, user, domain_name }) {
  let body = {};
  let suppliers = chapter.suppliers.map((z) => z.supplier.domain_name);
  body.suppliers = suppliers;

  /* Cào nội dung về */
  /* Xác định nguồn sẽ cào về */
  if (!domain_name) {
    domain_name = await defaultDomain(user ? user.id : undefined, suppliers);
  }
  /* Lấy crawler tương ứng nguồn được chọn*/
  let crawler = await crawlerFactory.get(domain_name);

  /* Tìm url tương ứng nguồn được chọn và cào */
  let url = chapter.suppliers.find(
    (z) => z.supplier.domain_name === domain_name
  ).url;
  body.supplier = domain_name;
  body.content = await crawler.crawlChapterContent(url);
  return body;
}

/* Thông tin cơ bản*/
async function parseChapterInfo(chapter) {
  let novel = chapter.novel;
  let novelId = novel.id;
  let infoBody = {};
  let novelJson = await novelToJson(novel);
  infoBody.novel_id = novelJson.id;
  infoBody.chapter_id = chapter.id;
  infoBody.author = novelJson.author;
  infoBody.novel_name = novelJson.name;
  infoBody.chapter_name = chapter.title;
  infoBody.chapter_index = chapter.number;
  infoBody.chapter_name = chapter.title;
  infoBody.categories = novelJson.categories;
  infoBody.total_chapter = await Chapter.countDocuments({ novel: novelId });

  let nextChap = await Chapter.findOne({
    novel: novelId,
    number: chapter.number + 1,
  });
  let preChap = await Chapter.findOne({
    novel: novelId,
    number: chapter.number - 1,
  });

  infoBody.next_chapter = !nextChap
    ? null
    : {
      id: nextChap.id,
      name: nextChap.title,
    };
  infoBody.pre_chapter = !preChap
    ? null
    : {
      id: preChap.id,
      name: preChap.title,
    };

  return infoBody;
}

async function defaultDomain(userId, domains) {
  if (!domains) {
    throw "List of domain should be defined";
  }
  let prefs = await Prefs.find({ user: userId })
    .sort({ order: -1 })
    .populate("supplier");
  for (let pref of prefs) {
    let domain_name = pref.supplier.domain_name;
    if (domains.includes(domain_name)) {
      return domain_name;
    }
  }
  return domains[0];
}

module.exports = {
  novelsToJson,
  novelToJson,
  defaultDomain,
  parseNovelContent,
  parseNovelChapList,
  parseChapterContent,
  parseChapterInfo,
};
