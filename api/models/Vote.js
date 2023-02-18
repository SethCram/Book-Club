const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema(
    {
        score: {
            type: Number,
            required: true,
            validate : {
                validator : Number.isInteger,
                message   : '{VALUE} is not an integer value'
            }
        },
        linkedId: {
            type: mongoose.ObjectId,
            required: true,
        },
        authorId: {
            type: mongoose.ObjectId,
            required: true,
        }
    }
);

module.exports = mongoose.model("Vote", VoteSchema);