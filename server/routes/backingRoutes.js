const express = require("express")

const router = express.Router()

const Booking = require("../models/Booking")

router.post("/add", async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      expertId,
      date,
      time,
      notes
    } = req.body

    const existingBooking = await Booking.findOne({
      expertId,
      date,
      time
    })

    if (existingBooking) {

      return res.status(400).json({
        message: "Slot already booked"
      })

    }

    const booking = new Booking({
      name,
      email,
      phone,
      expertId,
      date,
      time,
      notes
    })

    await booking.save()

    res.status(201).json({
      message: "Booking successful"
    })

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    })

  }

})

router.get("/", async (req, res) => {

  try {

    const bookings = await Booking.find()

    res.json(bookings)

  } catch (error) {

    res.status(500).json({
      message: "Error fetching bookings"
    })

  }

})

module.exports = router