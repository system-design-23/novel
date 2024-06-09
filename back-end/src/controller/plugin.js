const { code_plugger } = require("../db/plugger.js");
const User = require("../db/models/user.js");
const Supplier = require("../db/models/supplier.js");
const Chapter = require("../db/models/chapter.js");
const Novel = require("../db/models/novel.js");
const fs = require("fs");
const { format_plugger } = require("../format/plugger.js");
async function getAllSuppliers(req, res) {
  let pluggins = Object.keys(await code_plugger.plugins);
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

async function getImplementOfSuplier(req, res) {
  const { domain_name } = req.params;
  if (await code_plugger.get(domain_name)) {
    let file = fs.readFileSync(
      "./src/db/plug-in/" + domain_name + ".js",
      "utf8"
    );
    res.status(200);
    res.send(file);
  } else {
    res.status(400);
    res.send("Bad request");
  }
}

/* SSE */
async function addSupplier(req, res) {
  const { domain_name, payload } = req.body;

  let prog = await code_plugger.includePlugin(domain_name, payload);

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
    if (s.includes("...End...")) {
      res.end();
    }
  });
}
async function removeSupplier(req, res) {
  const { domain_name } = req.params;

  let prog = await code_plugger.excludePlugin(domain_name);
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

async function addFormatter(req, res) {
  const { format_name, payload } = req.body;
  try {
    if (await format_plugger.includePlugin(format_name, payload)) {
      res.send("Success");
      res.status(200);
      return;
    }
  } catch (error) {
    console.error(error);
  }
  res.send("Bad request");
  res.status(400);
}
async function removeFormatter(req, res) {
  const { format_name } = req.params;

  try {
    if (await format_plugger.excludePlugin(format_name, payload)) {
      res.send("Success");
      res.status(200);
      return;
    }
  } catch (error) {
    console.error(error);
  }
  res.send("Bad request");
  res.status(400);
}
async function getImplementOfFormatter(req, res) {
  const { format_name } = req.query;
  if (await format_plugger.get(format_name)) {
    let file = fs.readFileSync(
      "./src/format/plug-in/" + format_name + ".js",
      "utf8"
    );
    res.status(200);
    res.send(file);
  } else {
    res.status(400);
    res.send("Bad request");
  }
}

module.exports = {
  getAllSuppliers,
  addSupplier,
  removeSupplier,
  getImplementOfSuplier,
  getImplementOfFormatter,
  addFormatter,
  removeFormatter,
};
