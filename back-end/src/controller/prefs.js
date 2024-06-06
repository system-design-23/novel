const { novelManager } = require("../db/manager");
const Prefs = require("../db/models/preference");
const Supplier = require("../db/models/supplier");

async function setPref(req, res) {
  let { domain_names } = req.body;
  const auth = req.auth;

  try {
    await Prefs.deleteMany({ user: auth.id });
    let ord = 0;
    for (let domain_name of domain_names) {
      let supplier = await Supplier.findOne({ domain_name: domain_name });
      await Prefs.create({
        user: auth.id,
        supplier: supplier.id,
        order: ord--,
      });
    }
    res.send("Success");
    res.status(200);
  } catch (error) {
    res.send("Bad request");
    res.status(400);
    console.error(error);
  }
}
async function getPref(req, res) {
  const auth = req.auth;

  try {
    let prefs = (await Prefs.find({ user: auth.id })).map((p) => p.supplier);
    let domain_names = novelManager.findAll();
    let others = [];
    for (let domain_name of domain_names) {
      if (!prefs.includes(domain_name)) {
        others.push(domain_name);
      }
    }
    res.status(200);
    res.send({
      prefs: prefs,
      others: others,
    });
  } catch (error) {
    res.send("Bad request");
    res.status(400);
    console.error(error);
  }
}

module.exports = { setPref, getPref };
