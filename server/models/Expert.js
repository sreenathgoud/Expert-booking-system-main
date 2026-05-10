const mongoose = require("mongoose")

const expertSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    slots: [
        {
            type: String
        }
    ]
})

module.exports = mongoose.model("Expert", expertSchema)