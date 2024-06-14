const mongoose = require("mongoose");

const User = new mongoose.Schema({
  username: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  password: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  fullname: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  role: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
});
module.exports = mongoose.model("User", User);
