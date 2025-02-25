const mongoose = require("mongoose")
const Schema = mongoose.Schema

const uniqueValidator = require("mongoose-unique-validator")

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    trim: true,
  },

  avatar: {
    type: String,
    default: "https://www.gravatar.com/avatar/",
  },

  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  location: {
    type: String,
    default: "",
  },

  bio: {
    type: String,
    default: "",
  },

  interests: {
    type: String,
    default: "",
  },

  savedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: [],
    },
  ],
})

userSchema.plugin(uniqueValidator)
userSchema.index({ name: "text" })
module.exports = mongoose.model("User", userSchema)
