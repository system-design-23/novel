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

    const writeStream = fs.createWriteStream(tempfile);
    doc.pipe(writeStream);
    const fontPath = "./src/format/font/Roboto-Regular.ttf"
    doc.registerFont('Roboto', fontPath);

    let width = doc.page.width;

    let thumbnail = await this.fetchImage(novel.url);
    doc.image(thumbnail, width / 2 - 125, 50, {
      fit: [215, 322],
      align: "center",
    });

    doc
      .fontSize(32)
      .font('Roboto')
      .text(novel.name, (width - doc.widthOfString(novel.name)) / 2, 400);

    doc.fontSize(16).text(novel.description, 50, 450, {
      align: "left",
      width: doc.page.width - 100,
    });
    doc.addPage();
    let chapter = await helper.getChapterDetail();
    let title = "Chapter " + chapter.chapter_index + ": " + chapter.chapter_name;
    doc.fontSize(32)
      .font('Roboto')
      .text(title, 50, 100);
    let content = chapter.content;
    doc.fontSize(16)
      .font('Roboto')
      .text(content, 50, 180, {
        width: width - 100,
      });

    doc.end();
    return tempfile;
  }
}

module.exports = Formatter;
