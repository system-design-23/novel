const { Router } = require("express");
const Novel = require("../db/models/novel.js");
const User = require("../db/models/user.js");
const Author = require("../db/models/author.js");
const { novelToJson, novelsToJson, defaultDomain } = require("./utils.js");
const Chapter = require("../db/models/chapter.js");
const UserRead = require("../db/models/userread.js");
const { plugger } = require("../db/plugger.js");
const Category = require("../db/models/category.js");
/* Update lượt xem của tiểu thuyết*/
async function updateViews(novelId) {
  return Novel.updateOne({ _id: novelId }, { $inc: { views: 1 } });
}

/* Cập nhật lịch sử đọc */
async function updateRead(chapter, user) {
  let novelId = chapter.novel.id;
  let chapterId = chapter.id;
  await UserRead.deleteOne({
    user: user.id,
    novel: novelId,
  });
  await UserRead.create({ user: user.id, chapter: chapterId, novel: novelId });
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
  let crawler = await plugger.get(domain_name);
  let desc = await crawler.crawlDesc(url);
  body.description = desc;
  body.supplier = domain_name;
  body.suppliers = novel.suppliers.map((z) => z.supplier.domain_name);
  return body;
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
  let crawler = await plugger.get(domain_name);

  /* Tìm url tương ứng nguồn được chọn và cào */
  let url = chapter.suppliers.find(
    (z) => z.supplier.domain_name === domain_name
  ).url;
  body.supplier = domain_name;
  body.content = await crawler.crawlChapterContent(url);
  return body;
}

async function findNovelsByAuthor(req, res, next) {
  const authorName = req.query.author;
  if (!authorName) {
    next();
    return;
  }
  try {
    const author = await Author.findOne({ name: authorName });
    if (!author) {
      res.status(400);
      res.send("Author does not exist.");
      return;
    }
    const fetchedNovels = await Novel.find({ author: author.id }).populate(
      "author"
    );
    const novels = await novelsToJson(fetchedNovels);
    res.status(200);
    res.send(novels);
  } catch (err) {
    console.error(err);
    res.status(400);
  }
}

async function findNovelsByCategory(req, res, next) {
  let { category, offset } = req.query;
  if (!category) {
    next();
    return;
  }
  if (!offset) {
    offset = 0;
  }
  try {
    const fetched = await Category.find({ name: category })
      .skip(offset)
      .limit(10)
      .populate({
        path: "novel",
        populate: {
          path: "author",
        },
      });
    let body = {};
    body.novels = await novelsToJson(fetched.map((z) => z.novel));
    body.info = {
      offset: offset,
      length: fetched.length,
      category: category,
      total: await Category.countDocuments({ name: category }),
    };
    res.status(200);
    res.send(body);
  } catch (err) {
    console.error(err);
    res.status(400);
  }
}
async function findNovelsByName(req, res, next) {
  let { title, offset } = req.query;
  if (!title) {
    next();
    return;
  }
  if (!offset) {
    offset = 0;
  }
  let query = {
    name: { $regex: title, $options: "i" },
  };
  try {
    const fetchedNovels = await Novel.find(query)
      .skip(offset)
      .limit(10)
      .populate("author");
    let body = {};
    body.novels = await novelsToJson(fetchedNovels);
    body.info = {
      offset: offset,
      length: fetchedNovels.length,
      title: title,
      total: await Novel.countDocuments(query),
    };
    res.status(200);
    res.send(body);
  } catch (err) {
    console.error(err);
    res.status(400);
  }
}
async function getRecommendation(req, res) {
  try {
    const fetchedNovels = await Novel.find()
      .sort({ views: -1 })
      .limit(20)
      .populate("author");
    const novels = await novelsToJson(fetchedNovels);
    res.status(200);
    res.send(novels);
  } catch (err) {
    console.error(err);
    res.status(400);
  }
}
async function getNovelDetail(req, res) {
  const novelId = req.params.novelId;
  const { domain_name } = req.query;
  const auth = req.auth;
  try {
    const novel = await Novel.findById(novelId).populate("author");
    if (!novel) {
      res.status(400);
      res.send("Novel does not exist");
      return;
    }
    let novelJson = await parseNovelContent({
      novel: novel,
      user: auth,
      domain_name: domain_name,
    });

    /* Lấy các chương */
    let chaps = await Chapter.find({ novel: novel.id }).sort({ number: 1 });
    novelJson.chapters = chaps.map((chap) => {
      return {
        id: chap.id,
        number: chap.number,
        title: chap.title,
      };
    });
    await updateViews(novelId);

    res.status(200);
    res.send(novelJson);
  } catch (err) {
    console.error(err);
    res.status(400);
  }
}
async function getChapterDetail(req, res) {
  const { novelId, chapterId } = req.params;
  const auth = req.auth;
  let { domain_name } = req.query;

  try {
    let chapter = await Chapter.findOne({
      _id: chapterId,
      novel: novelId,
    })
      .sort({
        number: 1,
      })
      .populate("suppliers.supplier")
      .populate({
        path: "novel",
        populate: {
          path: "author",
        },
      });
    if (!chapter) {
      res.status(400);
      res.send("Chapter does not exist");
      return;
    }

    let novel = chapter.novel;
    if (novelId != novel.id) {
      res.status(400);
      res.send("Novel does not exist.");
      return;
    }

    /* body thông tin cơ bản*/
    let body = {};
    let novelJson = await novelToJson(novel);
    body.novel_id = novelJson.id;
    body.chapter_id = chapter.id;
    body.author = novelJson.author;
    body.novel_name = novelJson.name;
    body.chapter_name = chapter.title;
    body.chapter_index = chapter.number;
    body.chapter_name = chapter.title;
    body.categories = novelJson.categories;
    body.total_chapter = await Chapter.countDocuments({ novel: novelId });

    let nextChap = await Chapter.findOne({
      novel: novelId,
      number: chapter.number + 1,
    });
    let preChap = await Chapter.findOne({
      novel: novelId,
      number: chapter.number - 1,
    });

    body.next_chapter = !nextChap
      ? null
      : {
          id: nextChap.id,
          name: nextChap.title,
        };
    body.pre_chapter = !preChap
      ? null
      : {
          id: preChap.id,
          name: preChap.title,
        };

    let content_body = await parseChapterContent({
      chapter: chapter,
      user: auth,
      domain_name: domain_name,
    });
    body = { ...body, ...content_body };
    if (auth) {
      await updateRead(chapter, auth);
    }
    await updateViews(novelId);

    res.status(200);
    res.send(body);
  } catch (err) {
    console.error(err);
    res.status(400);
  }
}

module.exports = {
  findNovelsByName,
  getNovelDetail,
  findNovelsByAuthor,
  getChapterDetail,
  getRecommendation,
  findNovelsByCategory,
};
