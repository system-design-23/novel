const Novel = require("../db/models/novel.js");
const Prefs = require("../db/models/preference.js");
const { plugger } = require("../db/plugger.js");

async function novelsToJson(novels) {
  return Promise.all(
    novels.map(async (novel) => {
      return novelToJson(novel);
    })
  );
}
async function novelToJson(novel) {
  let body = {
    id: novel.id,
    name: novel.name,
    author: novel.author.name,
    url: novel.thumbnail,
    categories: novel.categories,
  };
  return body;
}

async function defaultDomain(userId, domains) {
  if (!domains) {
    throw "List of domain should be defined";
  }
  let prefs = await Prefs.find({ user: userId })
    .sort({ order: -1 })
    .populate("supplier");
  for (let pref of prefs) {
    let domain_name = pref.supplier.domain_name;
    if (domains.includes(domain_name)) {
      return domain_name;
    }
  }
  return domains[0];
}

module.exports = {
  novelsToJson,
  novelToJson,
  defaultDomain,
};
