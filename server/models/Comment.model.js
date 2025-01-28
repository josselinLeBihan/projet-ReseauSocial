const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const commentSchema = new Schema({
    body:{
        type:String,
        require : true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    child:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})

module.exports = mongoose.model('Comment', userSchema);