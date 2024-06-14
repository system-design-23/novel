const { Document, Packer, Paragraph, TextRun, Media, ImageRun } = require('docx');
const { v4: uuidv4 } = require("uuid");
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

      const doc = new Document({
         sections: [],
      });

      let tempfile = "./src/format/temp/" + uuidv4() + "." + this.format_name;
      let novel = await helper.getNovelDetail();
      let chapter = await helper.getChapterDetail();
      let thumbnail = await this.fetchImage(novel.url);

      const imageBuffer = Buffer.from(thumbnail, 'binary');
      doc.addSection({
         properties: {},
         children: [
            new Paragraph({
               children: [
                  new ImageRun({
                     data: imageBuffer,
                     transformation: {
                        width: 215,
                        height: 322,
                     },
                  }),
               ],
               alignment: 'center',
            }),
            new Paragraph({
               children: [
                  new TextRun({
                     text: novel.name,
                     bold: true,
                     size: 48,
                     font: 'Calibri',
                  }),
               ],
               alignment: 'center',
            }),
            new Paragraph({
               children: [
                  new TextRun({
                     text: `Chapter ${chapter.chapter_index}: ${chapter.chapter_name}`,
                     bold: true,
                     size: 32,
                     font: 'Calibri',
                  }),
               ],
               alignment: 'center',
            }),
            new Paragraph({
               children: [
                  new TextRun({
                     text: `Author: ${novel.author}`,
                     italics: true,
                     size: 24,
                     font: 'Calibri',
                  }),
               ],
               alignment: 'center',
            }),
            new Paragraph({
               children: [
                  new TextRun({
                     text: chapter.content,
                     size: 24,
                     font: 'Calibri',
                  }),
               ],
               alignment: 'justify',
            }),
         ],
      });

      const buffer = await Packer.toBuffer(doc);
      fs.writeFileSync(tempfile, buffer);
      return tempfile;
   }
}

module.exports = Formatter;
