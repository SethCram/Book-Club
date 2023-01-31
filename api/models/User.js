const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        profilePicture: {
            type: String, //path to image
            default: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
        },
        bio: {
            type: String,
            default: ""
        }
    },
    { timestamps: true } //for updated and created at timestamps
);

module.exports = mongoose.model("User", UserSchema);