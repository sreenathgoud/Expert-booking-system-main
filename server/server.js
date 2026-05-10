const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const http = require("http")
const { Server } = require("socket.io")

const expertRoutes = require("./routes/expertRoutes")
const bookingRoutes = require("./routes/bookingRoutes")

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

app.set("io", io)

app.use(cors())
app.use(express.json())

app.use("/api/experts", expertRoutes)
app.use("/api/bookings", bookingRoutes)

io.on("connection", (socket) => {

  console.log("User Connected")

  socket.on("disconnect", () => {
    console.log("User Disconnected")
  })

})

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected")
})
.catch((err) => {
    console.log(err)
})

app.get("/", (req, res) => {
    res.send("Server Running")
})

server.listen(process.env.PORT, () => {
    console.log("Server running on port 5000")
})