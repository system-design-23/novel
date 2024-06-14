const browser = require("./domain/browser.js");
const { novelManager } = require("./manager.js");
class CrawlerFactory {
  constructor() {
    this.crawlers = new Map();
  }
  onPlugIn(data) {
    const { domain_name, Crawler } = data;
    this.crawlers.set(domain_name, Crawler);
  }
  onPlugOut(data) {
    const { domain_name } = data;
    this.crawlers.delete(domain_name);
  }
  async create(domain_name) {
    const Crawler = this.crawlers.get(domain_name);
    if (!Crawler) {
      return null;
    }
    return new Crawler(await browser);
  }
}
const crawlerFactory = new CrawlerFactory();
novelManager.observe(crawlerFactory);
module.exports = {
  crawlerFactory,
};
