const { v4: uuidv4 } = require("uuid");

class Formatter {
  constructor(format_name) {
    this.format_name = format_name;
  }

  async format(helper) {
    /*Trả về thông tin y chang trong file Novel Api*/
    await helper.getNovelDetail();
    /*Trả về thông tin y chang trong file Chapter Api*/
    await helper.getChapterDetail(chapterId);
    helper.onProgress(0.5);
    /*Trả về tempfile*/
    let tempfile = "./src/format/temp/" + uuidv4() + "." + format_name;
    /* Tạo tempfile và write vào tempfile này */
    return tempfile;
  }
}
