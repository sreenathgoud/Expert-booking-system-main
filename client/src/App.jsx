import { useEffect, useState } from "react"
import axios from "axios"
import { io } from "socket.io-client"

function App() {

  const [experts, setExperts] = useState([])
  const [filteredExperts, setFilteredExperts] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const [selectedExpert, setSelectedExpert] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState("")

  const [bookedSlots, setBookedSlots] = useState([])
  const [myBookings, setMyBookings] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const expertsPerPage = 2

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  })

  useEffect(() => {
    fetchExperts()
    fetchBookings()
  }, [])

  useEffect(() => {

    let data = experts

    if (search) {

      data = data.filter((expert) =>
        expert.name
          .toLowerCase()
          .includes(search.toLowerCase())
      )

    }

    if (category !== "All") {

      data = data.filter(
        (expert) => expert.category === category
      )

    }

    setFilteredExperts(data)

  }, [search, category, experts])

  const fetchExperts = async () => {

    try {

      setLoading(true)

      const response = await axios.get(
        "http://localhost:5000/api/experts"
      )

      setExperts(response.data)
      setFilteredExperts(response.data)

      setLoading(false)

    } catch (error) {

      setError("Error fetching experts")
      setLoading(false)

    }

  }

  const fetchBookings = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/bookings"
      )

      const bookings = response.data

      setMyBookings(bookings)

      const slots = bookings.map(
        (booking) =>
          `${booking.expertId}-${booking.time}`
      )

      setBookedSlots(slots)

    } catch (error) {

      console.log(error)

    }

  }

  const categories = [
    "All",
    ...new Set(experts.map((expert) => expert.category))
  ]

  const openBookingForm = (expert, slot) => {

    setSelectedExpert(expert)
    setSelectedSlot(slot)

  }

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const validateForm = () => {

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone
    ) {
      alert("Please fill all fields")
      return false
    }

    if (!emailRegex.test(formData.email)) {
      alert("Invalid email")
      return false
    }

    if (formData.phone.length < 10) {
      alert("Phone number should be 10 digits")
      return false
    }

    return true

  }

  const handleBooking = async () => {

    if (!validateForm()) return

    try {

      const bookingData = {
        ...formData,
        expertId: selectedExpert._id,
        expertName: selectedExpert.name,
        date: "2026-05-10",
        time: selectedSlot
      }

      const response = await axios.post(
        "http://localhost:5000/api/bookings/add",
        bookingData
      )

      alert(response.data.message)

      fetchBookings()

      setSelectedExpert(null)

      setFormData({
        name: "",
        email: "",
        phone: "",
        notes: ""
      })

    } catch (error) {

      if (error.response) {
        alert(error.response.data.message)
      }

    }

  }

  const indexOfLastExpert =
    currentPage * expertsPerPage

  const indexOfFirstExpert =
    indexOfLastExpert - expertsPerPage

  const currentExperts =
    filteredExperts.slice(
      indexOfFirstExpert,
      indexOfLastExpert
    )

  const totalPages = Math.ceil(
    filteredExperts.length / expertsPerPage
  )

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-6">

      <div className="bg-white shadow-lg rounded-3xl p-5 mb-10 flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-extrabold text-blue-700">
            Expert Booking System
          </h1>

          <p className="text-gray-500 mt-1">
            Book sessions with top experts
          </p>

        </div>

        <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold shadow-lg">
          {myBookings.length} Bookings
        </div>

      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-10 flex flex-col md:flex-row gap-5 justify-between items-center">

        <input
          type="text"
          placeholder="Search Expert..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border p-3 rounded-xl w-full md:w-[400px] outline-none"
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="border p-3 rounded-xl outline-none"
        >

          {
            categories.map((cat, index) => (

              <option key={index}>
                {cat}
              </option>

            ))
          }

        </select>

      </div>

      {
        loading && (
          <h2 className="text-3xl text-center font-bold">
            Loading...
          </h2>
        )
      }

      {
        error && (
          <h2 className="text-3xl text-center text-red-600 font-bold">
            {error}
          </h2>
        )
      }

      <div className="grid lg:grid-cols-2 gap-8">

        {
          currentExperts.map((expert) => (

            <div
              key={expert._id}
              className="bg-white rounded-3xl shadow-2xl p-6 hover:scale-105 duration-300 border border-gray-100"
            >

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-3xl font-bold text-blue-700">
                  {expert.name}
                </h2>

                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold">
                  ⭐ {expert.rating}
                </span>

              </div>

              <p className="mb-3 text-lg">
                <span className="font-bold">
                  Category:
                </span> {expert.category}
              </p>

              <p className="mb-5 text-lg">
                <span className="font-bold">
                  Experience:
                </span> {expert.experience} years
              </p>

              <h3 className="text-xl font-bold mb-3 text-purple-700">
                Available Slots
              </h3>

              <div className="mb-5">

                <h4 className="font-bold text-gray-700 mb-2">
                  10 May 2026
                </h4>

                <div className="flex flex-wrap gap-3">

                  {
                    expert.slots.map((slot, index) => (

                      <button
                        key={index}

                        onClick={() =>
                          openBookingForm(expert, slot)
                        }

                        disabled={
                          bookedSlots.includes(
                            `${expert._id}-${slot}`
                          )
                        }

                        className={`px-4 py-2 rounded-xl font-semibold text-white

                        ${
                          bookedSlots.includes(
                            `${expert._id}-${slot}`
                          )
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }
                        `}
                      >

                        {
                          bookedSlots.includes(
                            `${expert._id}-${slot}`
                          )
                            ? "Booked"
                            : slot
                        }

                      </button>

                    ))
                  }

                </div>

              </div>

            </div>

          ))
        }

      </div>

      <div className="flex justify-center gap-5 mt-10">

        <button
          onClick={() =>
            setCurrentPage(currentPage - 1)
          }

          disabled={currentPage === 1}

          className="bg-blue-600 text-white px-5 py-3 rounded-xl disabled:bg-gray-400"
        >
          Previous
        </button>

        <div className="text-2xl font-bold">
          {currentPage}
        </div>

        <button
          onClick={() =>
            setCurrentPage(currentPage + 1)
          }

          disabled={currentPage === totalPages}

          className="bg-blue-600 text-white px-5 py-3 rounded-xl disabled:bg-gray-400"
        >
          Next
        </button>

      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 mt-14">

        <h2 className="text-4xl font-bold text-purple-700 mb-8">
          My Bookings
        </h2>

        {
          myBookings.length === 0 ? (

            <p className="text-lg text-gray-500">
              No bookings yet
            </p>

          ) : (

            <div className="grid md:grid-cols-2 gap-6">

              {
                myBookings.map((booking, index) => (

                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl p-5 shadow-md"
                  >

                    <h3 className="text-2xl font-bold text-blue-700 mb-2">
                      {booking.expertName || "Booked Expert"}
                    </h3>

                    <p className="mb-2 text-lg">
                      Slot: {booking.time}
                    </p>

                    <p className="text-green-600 font-bold text-lg">
                      Status: Pending
                    </p>

                  </div>

                ))
              }

            </div>

          )
        }

      </div>

      {
        selectedExpert && (

          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

            <div className="bg-white p-8 rounded-3xl w-[400px] shadow-2xl">

              <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">
                Book Session
              </h2>

              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-3 mb-4 rounded-xl outline-none"
              />

              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-3 mb-4 rounded-xl outline-none"
              />

              <input
                type="text"
                name="phone"
                placeholder="Enter Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-3 mb-4 rounded-xl outline-none"
              />

              <textarea
                name="notes"
                placeholder="Enter Notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full border p-3 mb-5 rounded-xl outline-none"
              />

              <div className="flex justify-between">

                <button
                  onClick={handleBooking}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-bold"
                >
                  Confirm
                </button>

                <button
                  onClick={() =>
                    setSelectedExpert(null)
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        )
      }

    </div>

  )

}

export default App