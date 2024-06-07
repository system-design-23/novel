const { assert } = require("assert");
class Crawler {
  constructor(browser) {
    this.browser = browser;
    this.url = "https://truyenfull.vn/";
    this.domain_name = new URL(this.url).hostname;
  }

  async crawlNovelType(url) {
    const page = await this.browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });
    const links = await page.$$("a.dropdown-toggle");
    for (let link of links) {
      let get = await page.evaluate((link) => {
        let text = link.textContent;
        if (text.replace(/[^\x00-\x7F]/g, "").trim() == "Th loi") {
          let uls = link.parentElement.querySelectorAll("ul");
          let listItems = {};
          let limit = 5;
          for (ul of uls) {
            for (li of ul.querySelectorAll("li")) {
              let a = li.querySelector("a");
              listItems[a.textContent] = a.href;
              if (--limit <= 0) {
                break;
              }
            }
            if (limit <= 0) {
              break;
            }
          }
          return listItems;
        }
        return null;
      }, link);
      if (get != null) {
        page.close();
        return get;
      }
    }
    return null;
  }

  async crawlNovelsByType(url) {
    const page = await this.browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const div = await page.$(".list-truyen.col-xs-12");
    const res = await page.evaluate((div) => {
      let res = [];
      let divs = div.querySelectorAll("div.row");

      const limit = 10;
      for (d of divs) {
        let h3 = d.querySelector('h3.truyen-title[itemprop="name"]');
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
    }, div);
    page.close();
    return res;
  }

  async crawlChapter(page, limit) {
    const chapDivs = await page.$$(".col-xs-12.col-sm-6.col-md-6");
    let chaps = {};
    for (let chapDiv of chapDivs) {
      chaps = {
        ...chaps,
        ...(await page.evaluate(
          (chapDiv, limit) => {
            let getChaps = {};
            let lis = chapDiv.querySelectorAll("li");
            for (li of lis) {
              let a = li.querySelector("a");
              let content = a.textContent;
              let pos_sep = content.indexOf(":");
              let numChap = (
                pos_sep == -1 ? content : content.substring(0, pos_sep)
              ).match(/\d+$/);
              let title = content.substring(pos_sep + 1).trim();
              getChaps[numChap] = { url: a.href, title: title };
              if (Object.keys(getChaps).length >= limit) {
                break;
              }
            }
            return getChaps;
          },
          chapDiv,
          limit - Object.keys(chaps).length
        )),
      };
      if (Object.keys(chaps).length >= limit) {
        break;
      }
    }
    return chaps;
  }
  async crawlChapterContent(url) {
    const page = await this.browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    let res = await page.$$eval("p", (elements) => {
      let content = [];
      for (const p of elements) {
        let child = p.firstChild;

        while (child) {
          if (child.nodeType === Node.TEXT_NODE) {
            content.push(child.textContent);
          }
          child = child.nextSibling;
        }
      }
      return content.join("");
    });
    page.close();
    return res;
  }

  async crawlDesc(url) {
    const page = await this.browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    /* crawl book's description */
    const div = await page.$('div.desc-text[itemprop="description"]');
    const res = await page.evaluate((div) => {
      return div.textContent;
    }, div);
    page.close();
    return res;
  }

  async crawlNovel(url) {
    const page = await this.browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    /* crawl book's info */
    const infoDoc = await page.$(".title-list.book-intro");
    const res = await page.evaluate((info) => {
      let div = info.parentElement;
      let name = div.querySelector("h3.title[itemprop='name']").textContent;
      let thumbnailUrl = div.querySelector("div.book").querySelector("img").src;

      let infoDiv = div.querySelector("div.info").querySelectorAll("div");
      if (!infoDiv[0].querySelector("a")) {
        return null;
      }
      let authorDiv = infoDiv[0].querySelector("a");
      if (!authorDiv) {
        return null;
      }
      let author = authorDiv.textContent;
      let types = Array.from(infoDiv[1].querySelectorAll("a")).map(
        (a) => a.textContent
      );

      return {
        name: name,
        author: author,
        thumbnailUrl: thumbnailUrl,
        categories: types,
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
      const pageBar = await page.$("ul.pagination.pagination-sm");
      if (pageBar == null) {
        break;
      }
      let nextPage = await page.evaluate((pageBar) => {
        let span = pageBar.querySelector("span.glyphicon.glyphicon-menu-right");
        if (span == null) {
          return null;
        }
        return span.parentElement.href;
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
