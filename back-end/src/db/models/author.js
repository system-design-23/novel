const mongoose = require("mongoose");

const Author = new mongoose.Schema({
  name: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
});

module.exports = mongoose.model("Author", Author);
