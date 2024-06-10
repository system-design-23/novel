const { Helper } = require("../format/helper.js");
const fs = require("fs");
const Chapter = require("../db/models/chapter.js");
const { formatManager } = require("../format/manager.js");
const { formatFactory } = require("../format/factory.js");

async function getAllFormat(req, res) {
  try {
    let formats = formatManager.findAll();
    res.status(200);
    res.send(formats);
  } catch (error) {
    console.error(error);
    res.status(400);
    res.send("Bad request");
  }
}

async function exportWithFormat(req, res) {
  const { file_format, chapterId, supplier } = req.body;
  try {
    let formatter = formatFactory.get(file_format);
    if (!formatter) {
      res.status(400);
      res.send("Format is not supported");
    }
    const chapter = await Chapter.findOne({
      _id: chapterId,
    })
      .populate("suppliers.supplier")
      .populate({
        path: "novel",
        populate: {
          path: "author",
        },
      });
    const helper = new Helper(chapter, supplier);
    let tempfile = await formatter.format(helper);
    res.send({
      tempfile: tempfile,
      timeout: "5 minutes",
    });
    deleteTempfile(tempfile);
  } catch (error) {
    console.error(error);
    res.status(400);
    res.send("Bad request");
  }
}

function deleteTempfile(tempfile) {
  setTimeout(() => {
    try {
      fs.unlink(tempfile);
    } catch (error) { }
  }, 1000 * 60 * 5);
}
async function downloadTempfile(req, res) {
  const { tempfile } = req.query;
  if (!fs.existsSync(tempfile)) {
    res.status(400);
    res.send("The file is no longer exist");
    return;
  }
  res.download(filePath, function (err) {
    if (err) {
      console.error(err);
    }
    try {
      fs.unlink(tempfile);
    } catch (error) { }
  });
}
module.exports = {
  exportWithFormat,
  downloadTempfile,
  getAllFormat,
};
