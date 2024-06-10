const { Router } = require("express");
const Novel = require("../db/models/novel.js");
const User = require("../db/models/user.js");
const Author = require("../db/models/author.js");
const {
  novelToJson,
  novelsToJson,
  defaultDomain,
  parseNovelContent,
  parseChapterContent,
  parseChapterInfo,
  parseNovelChapList,
} = require("./utils.js");
const Chapter = require("../db/models/chapter.js");
const UserRead = require("../db/models/userread.js");
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
  let { genre, offset } = req.query;
  if (!genre) {
    next();
    return;
  }
  if (!offset) {
    offset = 0;
  }
  try {
    const fetched = await Category.find({ name: genre })
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
      category: genre,
      total: await Category.countDocuments({ name: genre }),
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
  const { offset } = req.query;
  try {
    const fetchedNovels = await Novel.find()
      .sort({ views: -1 })
      .skip(offset)
      .limit(20)
      .populate("author");
    let body = {}
    body.novels = await novelsToJson(fetchedNovels);
    body.info = {
      offset: offset,
      length: fetchedNovels.length,
      total: await Novel.countDocuments(),
    };
    res.status(200);
    res.send(body);
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
    novelJson.chapters = await parseNovelChapList(novel);
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

    let info_body = await parseChapterInfo(chapter);
    let content_body = await parseChapterContent({
      chapter: chapter,
      user: auth,
      domain_name: domain_name,
    });
    if (auth) {
      await updateRead(chapter, auth);
    }
    await updateViews(novelId);

    res.status(200);
    res.send({ ...info_body, ...content_body });
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
