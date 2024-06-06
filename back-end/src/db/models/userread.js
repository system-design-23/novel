const mongoose = require("mongoose");

const UserRead = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  chapter: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Chapter",
  },
  novel: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Novel",
  },
  readAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserRead", UserRead);
