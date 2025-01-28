const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communitySchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

module.exports = mongoose.model("Community", communitySchema);