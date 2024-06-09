const { v4: uuidv4 } = require("uuid");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const axios = require("axios");

class Formatter {
  constructor(format_name) {
    this.format_name = format_name;
  }
  async fetchImage(url) {
    const image = await axios.get(url, { responseType: "arraybuffer" });
    return image.data;
  }

  async format(helper) {
    let tempfile = "./src/format/temp/" + uuidv4() + "." + this.format_name;
    let novel = await helper.getNovelDetail();
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(tempfile));

    let width = doc.page.width;

    /* Drawing thumbnail */
    let thumbnail = await this.fetchImage(novel.url);
    doc.image(thumbnail, width / 2 - 125, 50, {
      fit: [250, 300],
      align: "center",
    });

    /* Drawing title*/
    doc
      .fontSize(30)
      .text(novel.name, (width - doc.widthOfString(novel.name)) / 2, 400);

    /* Drawing description*/
    doc.fontSize(14).text(novel.description, 50, 450, {
      align: "left",
      width: doc.page.width - 200,
    });
    doc.addPage();
    let chapter = await helper.getChapterDetail();
    let title = chapter.chapter_name;
    doc.fontSize(40).text(title, 50, 100);
    let content = chapter.content;
    doc.fontSize(14).text(content, 50, 180, {
      width: width - 200,
    });

    doc.end();
    return tempfile;
  }
}

module.exports = { Formatter };
