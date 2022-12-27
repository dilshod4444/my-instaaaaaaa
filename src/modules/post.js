const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 3,
        max: 120,
    },
    description: {
        type: String,
        max: 1200,
    },
    photo: {
        type: String,
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],
    comments: [
        {
            creator: {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
            message: {
                type: String,
                required: true,
                min: 3,
                max: 120,
            },
        },
    ],
});

module.exports = mongoose.model("Post", postSchema);
