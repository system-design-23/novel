const Prefs = require("../db/models/preference");
const Supplier = require("../db/models/supplier");

async function delPref(req, res) {
  const { domain_name } = req.params;
  try {
    if (!domain_name) {
      throw "Domain should be defined";
    }
    let sup = await Supplier.findOne({ domain_name: domain_name });
    const auth = req.auth;

    let old = await Prefs.findOne({ user: auth.id, supplier: sup.id });
    if (old) {
      await old.deleteOne();
      res.send("Success");
      res.status(200);
    } else {
      res.send("Preference does not exist");
      res.status(400);
    }
  } catch (error) {
    res.send("Bad request");
    res.status(400);
  }
}

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

module.exports = { setPref, delPref };
