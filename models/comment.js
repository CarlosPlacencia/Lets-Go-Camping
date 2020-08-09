var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // The model we're going to refer to with this ID
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);