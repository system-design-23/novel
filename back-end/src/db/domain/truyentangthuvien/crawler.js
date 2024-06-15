class Crawler {
  constructor(browser) {
    this.browser = browser;
    this.url = "https://truyen.tangthuvien.vn/";
    this.domain_name = new URL(this.url).hostname;
  }
  async crawlNovelType(url) {
    const page = await this.browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const link = await page.$("div.classify-list.fl.so-awesome#classify-list");
    let get = await page.evaluate((link) => {
      let crawled = {};
      let as = link.querySelectorAll("a");
      let limit = 2;
      for (a of as) {
        let type = a.querySelector("i").textContent;
        if (type == "Tất cả") {
          continue;
        }
        crawled[type] = a.href;
        if (--limit < 0) {
          break;
        }
      }
      return crawled;
    }, link);
    page.close();
    return get;
  }

  async crawlNovelsByType(url) {
    const page = await this.browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const more = await (await page.$("div.update-tab.cf")).$("a");
    let moreHref = await page.evaluate((a) => a.href, more);
    await page.goto(moreHref, {
      waitUntil: "domcontentloaded",
    });
    const div = await (
      await page.$("div.rank-view-list#rank-view-list")
    ).$("ul");

    const res = await page.evaluate((div) => {
      let res = [];
      let lis = div.querySelectorAll("li");

      const limit = 5;
      for (li of lis) {
        let a = li.querySelector("div.book-mid-info").querySelector("a");
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

  async crawlChapterContent(url) {
    const page = await this.browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    let div = await page.$("div.chapter-c-content");
    let content = await page.evaluate((div) => {
      let divContent = div.querySelector("div.box-chap");
      return divContent.textContent;
    }, div);
    page.close();
    return content;
  }

  async crawlDesc(url) {
    const page = await this.browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    /* crawl book's description */
    const descDoc = await page.$("div.book-intro");
    const res = await page.evaluate((descDoc) => {
      let p = descDoc.querySelector("p");
      let content = [];
      let child = p.firstChild;

      while (child) {
        if (child.nodeType === Node.TEXT_NODE) {
          if (child.textContent.includes("-------")) {
            break;
          }
          if (child.textContent.includes("=======")) {
            break;
          }
          if (child.textContent.includes("bank")) {
            break;
          }
          content.push(child.textContent);
        }
        child = child.nextSibling;
      }
      return content.join("");
    }, descDoc);
    page.close();
    return res;
  }

  async crawlChapter(page, chapDiv, limit) {
    let chaps = page.evaluate(
      (chapDiv, limit) => {
        let lis = chapDiv.querySelector("ul.cf").querySelectorAll("li");
        let getChaps = {};
        for (li of lis) {
          let a = li.querySelector("a");
          if (a == null) {
            continue;
          }
          let content = a.title;
          let pos_sep = content.indexOf(":");
          let numChap = (
            pos_sep == -1 ? content : content.substring(0, pos_sep).trim()
          ).match(/\d+$/);

          if (numChap === null) continue;

          let title = content.substring(pos_sep + 1).trim();
          getChaps[numChap] = { url: a.href, title: title };

          if (Object.keys(getChaps).length >= limit) {
            break;
          }
        }
        return getChaps;
      },
      chapDiv,
      limit
    );
    return chaps;
  }
  async crawlNovel(url) {
    const page = await this.browser.newPage();
    await page.goto(url);

    /* crawl book's info */
    let div = await page.$("div.book-information.cf");
    const res = await page.evaluate((div) => {
      let divInfo = div.querySelector("div.book-info");
      let name = divInfo.querySelector("h1").textContent;
      //remove chinese
      name = name.replace(/[\u4e00-\u9fa5]/g, "").trim();
      name = name.replace(/ -\s*$/, "").trim();

      let thumbnailUrl = div
        .querySelector("div.book-img")
        .querySelector("img").src;

      let tags = divInfo.querySelector("p.tag").querySelectorAll("a");
      let author = "";
      let types = [];
      for (let tag of tags) {
        if (tag.href.includes("the-loai")) {
          types.push(tag.textContent);
        } else if (tag.href.includes("tac-gia")) {
          author = tag.textContent;
        }
      }

      return {
        name: name,
        author: author,
        thumbnailUrl: thumbnailUrl,
        categories: types,
      };
    }, div);

    /* crawl all chapters */
    await page.click("#j-bookCatalogPage");
    div = await page.$("#max-volume");
    let listChap = {};
    const limit = 5;
    while (true) {
      listChap = {
        ...listChap,
        ...(await this.crawlChapter(
          page,
          div,
          limit - Object.keys(listChap).length
        )),
      };
      if (Object.keys(listChap).length >= limit) {
        break;
      }
      const pageBar = await page.$(
        'nav.nav-pagination[aria-label="Chapter navigation"]'
      );
      if (pageBar == null) {
        break;
      }
      let nextPage = await page.evaluate((pageBar) => {
        let nxt = pageBar.querySelector('a[aria-label="Next"]');
        if (nxt == null) {
          return false;
        }
        nxt.click();
        return true;
      }, pageBar);
      if (!nextPage) {
        break;
      }
    }
    res.chapters = listChap;
    page.close();
    return res;
  }
}
module.exports = Crawler;
