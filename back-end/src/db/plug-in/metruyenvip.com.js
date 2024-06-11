
const { assert } = require("assert");
class Crawler {
  constructor(browser) {
    this.browser = browser;
    this.url = "https://metruyenvip.com";
    this.domain_name = new URL(this.url).hostname;
  }

  async crawlNovelType(url) {
    const page = await this.browser.newPage();
  
    await page.goto(url, { waitUntil: "domcontentloaded" });
  
    const dropdowns = await page.$$("a[title='Menu Thể loại']");
    for (let dropdown of dropdowns) {
      let get = await page.evaluate((dropdown) => {
        let text = dropdown.textContent;
        if (text.includes("Thể Loại")) {
          let container = dropdown.nextElementSibling;
          let listItems = {};
          let links = container.querySelectorAll("a");
  
          let limit = 5;
          for (let link of links) {
            listItems[link.textContent.trim()] = link.href;
            if (--limit <= 0) {
              break;
            }
          }
  
          return listItems;
        }
        return null;
      }, dropdown);
  
      if (get != null) {
        await page.close();
        return get;
      }
    }
    await page.close();
    return null;
  }
  
  async crawlNovelsByType(url) {
    const page = await this.browser.newPage();
  
    await page.goto(url, { waitUntil: "domcontentloaded" });
  
    const res = await page.evaluate(() => {
      let res = [];
      let divs = document.querySelectorAll("div.w3-row.list-row-img");
  
      const limit = 10;
      for (let d of divs) {
        let h3 = d.querySelector("h3");
        if (!h3) {
          continue;
        }
        let a = h3.querySelector("a");
        res.push(a.href);
        if (res.length >= limit) {
          break;
        }
      }
      return res;
    });
  
    await page.close();
    return res;
  }
  
  
  async crawlChapter(page, limit) {
    const chapDivs = await page.$$("#divtab.list-chapter ul.w3-ul");
    let chaps = {};
    for (let chapDiv of chapDivs) {
      chaps = {
        ...chaps,
        ...(await chapDiv.evaluate((chapDiv) => {
          let getChaps = {};
          let lis = chapDiv.querySelectorAll("li");
          for (li of lis) {
            let a = li.querySelector("a");
            let content = a.textContent;
            
            const match = content.match(/\d+/);
            let numChap;
            let pos_sep;
            if (match) {
              numChap = parseInt(match[0], 10);
              pos_sep = match.index + match[0].length;
            }
            
            let title = content.substring(pos_sep + 1).trim();
            getChaps[numChap] = { url: a.href, title: title };
          }
          return getChaps;
        }, chapDiv)),
      };
      if (Object.keys(chaps).length >= limit) {
        break;
      }
    }
    return chaps;
  }
  
  
  async crawlDesc(url) {
      const page = await this.browser.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded" });
  
      const div = await page.$("div.w3-justify");
      if (!div) {
          console.log(url);
          console.log(this.url);
      }
      const res = await page.evaluate((div) => {
          return div.textContent;
      }, div);
      page.close();
      return res;
  }
  
  async crawlChapterContent(url) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded" });
  
      let res = await page.evaluate(() => {
        const contentElement = document.querySelector(".chapter-content"); 
        return contentElement ? contentElement.innerText : '';
      });
      page.close();
      return res;
  }
  
  async crawlNovel(url) {
    const page = await this.browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
  
    
    const infoDoc = await page.$("div.w3-row.detail");
  
    const res = await page.evaluate((info) => {
      let name = info.querySelector("div.detail-right h1 a").textContent;

      let thumbnailUrl = info.querySelector("div.detail-thumbnail").querySelector("img").src;

      let infoDiv = info.querySelector("div.detail-info").querySelectorAll("li");
      if (!infoDiv[0].querySelector("a")) {
        return null;
      }
      let authorDiv = infoDiv[0].querySelector("a");
      if (!authorDiv) {
        return null;
      }
      let author = authorDiv.textContent;
      let categories = Array.from(infoDiv[1].querySelectorAll("a")).map(
        (a) => a.textContent
      );
  
      return {
        name: name,
        author: author,
        thumbnailUrl: thumbnailUrl,
        categories: categories,
      };
    }, infoDoc);
  
    if (res == null) {
      return null;
    }
  
    /* crawl all chapters */
    let listChap = {};
    const limit = 10;
    while (true) {
      listChap = {
        ...listChap,
        ...(await this.crawlChapter(
          page,
          limit - Object.keys(listChap).length
        )),
      };
      if (Object.keys(listChap).length >= limit) {
        break;
      }
      const pageBar = await page.$("ul.w3-pagination.paging");
      if (pageBar == null) {
        break;
      }
      let nextPage = await page.evaluate((pageBar) => {
        let span = pageBar.querySelector("li.next");
        if (span == null) {
          return null;
        }
        return span.href;
      }, pageBar);
      if (nextPage == null) {
        break;
      }
  
      await page.goto(nextPage, {
        waitUntil: "domcontentloaded",
      });
    }
    res.chapters = listChap;
    page.close();
    return res;
  }
}

module.exports = Crawler;
