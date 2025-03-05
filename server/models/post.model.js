const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
  _id: {
    type: String,
    require,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  community: {
    type: Schema.Types.ObjectId,
    ref: "Community",
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  modifiedAt: {
    type: Date,
  },
  fileUrl: {
    type: String,
    trim: true,
  },
  fileType: {
    type: String,
  },
})

module.exports = mongoose.model("Post", postSchema)
