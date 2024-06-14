class Crawler {
  constructor(browser) {
    this.browser = browser;
    this.url = "https://lightnovel.vn/";
    this.domain_name = new URL(this.url).hostname;
  }

  async crawlChapterContent(url) {
    const page = await this.browser.newPage();
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });
    let div = await page.$("div#chapterContent");
    let res = await page.evaluate((div) => {
      let ps = div.querySelectorAll("p");
      let content = [];
      for (const p of ps) {
        let child = p.firstChild;

        while (child) {
          if (child.nodeType === Node.TEXT_NODE) {
            content.push(child.textContent);
          }
          child = child.nextSibling;
        }
      }
      return content.join("");
    }, div);
    page.close();
    return res;
  }

  async crawlDesc(url) {
    const page = await this.browser.newPage();
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });
    let div = await page.$("div#bookIntro");
    let res = await page.evaluate((div) => div.textContent, div);
    page.close();
    return res;
  }

  async crawlNovel(url) {
    const page = await this.browser.newPage();
    await page.goto(url + "/danh-sach-chuong", {
      waitUntil: "domcontentloaded",
    });

    /* crawl book's info */
    let div = await page.$("div.pl-2.flex.flex-col");
    const name = await page.evaluate(
      (div) => div.querySelector("a").textContent,
      div
    );

    let res = {
      name: name,
    };

    /* crawl all chapters */
    div = await page.$(
      "div.mb-5.flex.justify-end.items-center.gap-3.flex-wrap"
    );
    res.chapters = await page.evaluate((div) => {
      let ul = div.parentElement.querySelector("ul");
      let lis = ul.querySelectorAll("li");
      let chaps = {};
      let limit = 10;

      for (li of lis) {
        let a = li.querySelector("a");
        let content = a.textContent;
        let pos_sep = content.indexOf(":");
        let numChap = (
          pos_sep == -1 ? content : content.substring(0, pos_sep)
        ).match(/\d+$/);
        chaps[numChap] = { url: a.href };
        if (--limit <= 0) {
          break;
        }
      }
      return chaps;
    }, div);

    page.close();
    console.log(res);
    return res;
  }
}

module.exports = Crawler;
