const getNewExportCode = (dependency) => {
  const sampleCode = `const { v4: uuidv4 } = require("uuid");
const Epub = require('${dependency}');
const fs = require("fs");

class Formatter {
  constructor(format_name) {
    this.format_name = format_name;
  }

  async format(helper) {
    let tempfile = "./src/format/temp/" + uuidv4() + "." + this.format_name;
    let novel = await helper.getNovelDetail();
    let chapter = await helper.getChapterDetail();
    //...
    return tempfile;
  }
}

module.exports = Formatter;
`;

  return sampleCode;
};

export default getNewExportCode;
