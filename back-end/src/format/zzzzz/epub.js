const { v4: uuidv4 } = require("uuid");
const Epub = require('epub-gen');
const fs = require("fs");

class Formatter {
  constructor(format_name) {
    this.format_name = format_name;
  }

  async format(helper) {
    let tempfile = "./src/format/temp/" + uuidv4() + "." + this.format_name;
    let novel = await helper.getNovelDetail();
    let chapter = await helper.getChapterDetail();

    const fontPathRegular = "./src/format/font/Roboto-Regular.ttf";
    const fontPathBold = './src/format/font/Roboto-Bold.ttf';


    const options = {
      title: novel.name,
      author: novel.author,
      content: [
        {
          data: `
          <html>
            <head>
              <meta charset="UTF-8">
              <style>
                @font-face {
                  font-family: 'Roboto';
                  src: url('${fontPathRegular}') format('truetype');
                  font-weight: normal;
                  font-style: normal;
                }
                @font-face {
                  font-family: 'Roboto';
                  src: url('${fontPathBold}') format('truetype');
                  font-weight: bold;
                  font-style: normal;
                }
                body {
                  font-family: 'Roboto', sans-serif;
                  line-height: 1.6;
                  text-align: justify;
                  margin: 0;
                  padding: 1em;
                }
                h1, h2 {
                  margin: 0.5em 0;
                }
                p {
                  text-align: left;
                  margin: 1em 0;
                  word-break: keep-all;
                  overflow-wrap: normal;
                }
              </style>
            </head>
            <body>
              <img src="${novel.url}" alt="thumbnail"> 
              <h1>${novel.name}</h1>
              <h2>Chapter ${chapter.chapter_index}: ${chapter.chapter_name}</h2>
              <p>${chapter.content}</p>
            </body>
          </html>
        `,
        }
      ]
    };
    await new Epub(options, tempfile).promise;
    return tempfile;
  }
}

module.exports = Formatter;
