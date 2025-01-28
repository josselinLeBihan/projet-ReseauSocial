const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    body:{
        type : String,
        required : true,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
})