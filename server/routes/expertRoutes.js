const express = require("express")
const router = express.Router()

const Expert = require("../models/Expert")

router.post("/add", async (req, res) => {
    try {
        const expert = new Expert(req.body)

        await expert.save()

        res.status(201).json({
            message: "Expert added successfully",
            expert
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

router.get("/", async (req, res) => {
    try {
        const experts = await Expert.find()

        res.status(200).json(experts)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router