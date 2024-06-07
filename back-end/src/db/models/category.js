const mongoose = require("mongoose");

const Category = new mongoose.Schema({
  novel: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Novel",
  },
  name: {
    type: mongoose.SchemaTypes.String,
  },
});
module.exports = mongoose.model("Category", Category);
