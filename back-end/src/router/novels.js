const { Router } = require("express");
const {
  findNovelsByName,
  findNovelsByAuthor,
  getRecommendation,
  getNovelDetail,
  getChapterDetail,
  findNovelsByCategory,
} = require("../controller/novel");
const novelRouter = Router();
novelRouter.get("", findNovelsByAuthor);
novelRouter.get("", findNovelsByCategory);
novelRouter.get("", findNovelsByName);
novelRouter.get("", getRecommendation);
novelRouter.get("/detail/:novelId", getNovelDetail);
novelRouter.get("/detail/:novelId/:chapterId", getChapterDetail);

module.exports = novelRouter;
