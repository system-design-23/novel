const mongoose = require("mongoose");

const Supplier = new mongoose.Schema({
  domain_name: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  url: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
});
module.exports = mongoose.model("Supplier", Supplier);
