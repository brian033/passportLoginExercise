const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 6,
        maxLength: 255,
    },
    googleID: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    thumbnail: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
});

module.exports = mongoose.model("User", userSchema);
