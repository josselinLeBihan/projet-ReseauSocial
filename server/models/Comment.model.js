const { create } = require("domain")
const mongoose = require("mongoose")
const { type } = require("os")
const Schema = mongoose.Schema

const commentSchema = new Schema({
  _id: {
    type: String,
    require: true,
    trim: true,
  },
  content: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    require: true,
  },
  modifiedAt: {
    type: Date,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
})

module.exports = mongoose.model("Comment", commentSchema)
