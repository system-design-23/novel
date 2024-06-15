const User = require("../db/models/user.js");
const Supplier = require("../db/models/supplier.js");
const Chapter = require("../db/models/chapter.js");
const Novel = require("../db/models/novel.js");
const fs = require("fs");
const { novelManager } = require("../db/manager.js");
const { formatManager } = require("../format/manager.js");

async function getProgress(req, res) {
  const { progress_id } = req.query;
  let prog = await novelManager.findProgress(progress_id);
  if (!prog) {
    res.status(400);
    res.send("Bad request");
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  prog.onLog((s) => {
    res.write("data: {" + s + "}\n\n");
    console.log(s);
  });
  prog.onEnd(() => {
    console.log("End");
    res.end();
  });
}
async function addSupplier(req, res) {
  const { domain_name, payload } = req.body;
  let progress_id = await novelManager.plugIn(domain_name, payload);
  if (!progress_id) {
    res.status(400);
    res.send("Internal Error in Server, see log");
    return;
  } else if (progress_id.startsWith("Error")) {
    res.status(400);
    res.send(progress_id);
    return;
  }
  res.status(200);
  res.send(progress_id);
}
async function removeSupplier(req, res) {
  const { domain_name } = req.params;

  let progress_id = await novelManager.plugOut(domain_name);
  if (!progress_id) {
    res.status(400);
    res.send("Bad request");
    return;
  }
  res.status(200);
  res.send(progress_id);
}

async function getAllSuppliers(req, res) {
  let sups = await Supplier.find();
  let body = [];
  for (let sup of sups) {
    body.push({
      domain_name: sup.domain_name,
      url: sup.url,
    });
  }
  res.status(200);
  res.send(body);
}

async function getImplementOfSuplier(req, res) {
  const { domain_name } = req.params;
  try {
    let code = novelManager.findCode(domain_name);
    if (code) {
      res.status(200);
      res.send(code);
    } else {
      res.status(404);
      res.send("Supplier is no longer available");
    }
  } catch (error) {
    console.error(error);
    res.status(400);
    res.send("Bad request");
  }
}

async function addFormatter(req, res) {
  const { format_name, dependency, payload } = req.body;
  try {
    if (await formatManager.plugIn(format_name, payload, dependency)) {
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
    if (await formatManager.plugOut(format_name)) {
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
  const { format_name } = req.params;
  try {
    let code = formatManager.findCode(format_name);
    if (code) {
      res.status(200);
      res.send(code);
    } else {
      res.status(404);
      res.send("Supplier is no longer available");
    }
  } catch (error) {
    console.error(error);
  }
}
module.exports = {
  addSupplier,
  removeSupplier,
  getImplementOfSuplier,
  getImplementOfFormatter,
  addFormatter,
  removeFormatter,
  getAllSuppliers,
  getProgress,
};
