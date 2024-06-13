const getNewSampleCode = (domainUrl) => {
  const sampleCode = `class Crawler {
    constructor(browser) {
      this.browser = browser;
      this.url = '${domainUrl}';
      this.domain_name = new URL(this.url).hostname;
    }
  
    async crawlChapterContent(url) {
    }
  
    async crawlDesc(url) {
    }
  
    async crawlNovel(url) {
    }
  }
  
  module.exports = Crawler;`;
  return sampleCode;
};
export default getNewSampleCode;
