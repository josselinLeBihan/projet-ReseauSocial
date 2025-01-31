const { create } = require("domain");
const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  _id: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    require: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  child: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Comment", commentSchema);
