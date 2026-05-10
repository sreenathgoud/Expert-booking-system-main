const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  expertId: {
    type: String,
    required: true
  },

  expertName: {
    type: String,
    required: true
  },

  date: {
    type: String,
    required: true
  },

  time: {
    type: String,
    required: true
  },

  notes: {
    type: String
  },

  status: {
    type: String,
    default: "Pending"
  }

})

module.exports = mongoose.model(
  "Booking",
  bookingSchema
)