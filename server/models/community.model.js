const mongoose = require("mongoose");

const communitySchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
});

module.exports = mongoose.model("Community", communitySchema);