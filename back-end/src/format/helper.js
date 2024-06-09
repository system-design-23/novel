const {
  parseNovelContent,
  parseNovelChapList,
  parseChapterInfo,
  parseChapterContent,
} = require("../controller/utils");
const Chapter = require("../db/models/chapter");
const Novel = require("../db/models/novel");
class Helper {
  constructor(chapter, domain_name, response) {
    this.chapter = chapter;
    this.domain_name = domain_name;
    this.response = response;
  }
  async getNovelDetail() {
    let novel = this.chapter.novel;
    let domain_name = this.domain_name;
    let novelJson = await parseNovelContent({
      novel: novel,
      domain_name: domain_name,
    });
    return novelJson;
  }

  async getChapterDetail() {
    let domain_name = this.domain_name;
    let chapInfo = await parseChapterInfo(this.chapter);
    let chapContent = await parseChapterContent({
      chapter: this.chapter,
      domain_name: domain_name,
    });
    let body = { ...chapInfo, ...chapContent };
    return body;
  }

  onProgress(p) {
    let z = Math.floor(p * 100);
    this.response.write(z);
  }
}
module.exports = { Helper };
