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
  let { domain_name, upper_domain } = req.body;
  const auth = req.auth;

  try {
    if (!domain_name) {
      throw "Domain should be defined";
    }
    let supplier = await Supplier.findOne({ domain_name: domain_name });
    let old = await Prefs.findOne({ user: auth.id, supplier: supplier.id });
    if (old) {
      await old.deleteOne();
    }
    let ord_of_pref;
    if (!upper_domain) {
      let top = await Prefs.findOne({ user: auth.id })
        .sort({ order: -1 })
        .populate("supplier");
      ord_of_pref = top ? top.order + 1 : 0;
    } else {
      let upper_supplier = await Supplier.findOne({
        domain_name: upper_domain,
      });
      let upper_pref = await Prefs.findOne({
        user: auth.id,
        supplier: upper_supplier.id,
      });
      ord_of_pref = upper_pref.order;
      await Prefs.updateMany(
        {
          user: auth.id,
          order: { $gte: upper_pref.order },
        },
        {
          $inc: { order: 1 },
        }
      );
    }
    await Prefs.create({
      user: auth.id,
      supplier: supplier.id,
      order: ord_of_pref,
    });
    res.send("Success");
    res.status(200);
  } catch (error) {
    res.send("Bad request");
    res.status(400);
    console.error(error);
  }
}

module.exports = { setPref, delPref };
