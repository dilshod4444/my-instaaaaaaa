const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    followers: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],
    following: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],
});

module.exports = mongoose.model("User", userSchema);
