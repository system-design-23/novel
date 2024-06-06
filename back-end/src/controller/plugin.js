const { plugger } = require("../db/plugger.js");
const User = require("../db/models/user.js");
const Supplier = require("../db/models/supplier.js");
const Chapter = require("../db/models/chapter.js");
const Novel = require("../db/models/novel.js");

async function getAllSuppliers(req, res) {
  let pluggins = Object.keys(await plugger.plugins);
  let body = [];
  for (let pluggin of pluggins) {
    let supplier = await Supplier.findOne({ domain_name: pluggin });
    let total_chapter = await Chapter.countDocuments({
      "suppliers.supplier": supplier.id,
    });
    let total_novel = await Novel.countDocuments({
      "suppliers.supplier": supplier.id,
    });
    body.push({
      supplier: supplier.url,
      total_chapter: total_chapter,
      total_novel: total_novel,
    });
  }
  res.status(200);
  res.send(body);
}

/* SSE */
async function addNewSupplier(req, res) {
  const { domain_name, payload } = req.body;

  let prog = await plugger.includePlugin(domain_name, payload);
  if (!prog) {
    res.status(400);
    res.send("Bad request");
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  prog.onLog((s) => {
    res.write(s);
    if (s.includes("End")) {
      res.end();
    }
  });
}
async function deleteSupplier(req, res) {
  const { domain_name } = req.params;

  let prog = await plugger.excludePlugin(domain_name);
  if (!prog) {
    res.status(400);
    res.send("Bad request");
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  prog.onLog((s) => {
    res.write(s);
    if (s.includes("End")) {
      res.end();
    }
  });
}

module.exports = { getAllSuppliers, addNewSupplier, deleteSupplier };
