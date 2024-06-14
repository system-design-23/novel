const mongoose = require("mongoose");

const Prefs = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  supplier: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Supplier",
  },
  order: {
    type: mongoose.SchemaTypes.Number,
  },
});
module.exports = mongoose.model("Prefs", Prefs);
