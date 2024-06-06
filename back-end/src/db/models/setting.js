const mongoose = require("mongoose");

const Setting = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  configs: [
    {
      name: {
        type: mongoose.SchemaTypes.String,
      },
      value: {
        type: mongoose.SchemaTypes.String,
      },
    },
  ],
});
module.exports = mongoose.model("Setting", Setting);
