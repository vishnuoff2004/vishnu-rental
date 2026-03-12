const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const auth = require("../middleware/authMiddleware");

// Create booking
router.post("/create", auth, async (req, res) => {
  try {
    const { vehicleId, pickupDate, dropDate } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const start = new Date(pickupDate);
    const end = new Date(dropDate);

    const days = (end - start) / (1000 * 60 * 60 * 24);
    if (days <= 0)
      return res.status(400).json({ message: "Invalid dates" });

    // -------------------------------
    // 🚨 VEHICLE AVAILABILITY CHECK
    // -------------------------------

    const existingBookings = await Booking.find({ vehicleId });

    const isBooked = existingBookings.some(b => {
      const existingStart = new Date(b.pickupDate);
      const existingEnd = new Date(b.dropDate);

      // Check overlap
      return (
        start <= existingEnd &&
        end >= existingStart
      );
    });

    if (isBooked) {
      return res.status(400).json({
        message: "Vehicle not available for selected dates",
        available: false
      });
    }

    // -------------------------------
    // ✔ Vehicle is available
    // -------------------------------

    const totalPrice = days * vehicle.pricePerDay;

    const newBooking = new Booking({
      userId: req.user.id,
      ownerId: vehicle.ownerId,
      vehicleId,
      pickupDate,
      dropDate,
      totalPrice,
    });

    await newBooking.save();

    res.status(200).json({
      message: "Booking created successfully",
      available: true,
      booking: newBooking,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});


// User bookings
router.get("/user", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("vehicleId");
    res.status(200).json({ bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Owner bookings
router.get("/owner", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerId: req.user.id })
      .populate("vehicleId").populate("userId");
    res.status(200).json({ bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all booked dates for a specific vehicle
router.get("/booked-dates/:vehicleId", async (req, res) => {
  try {
    const { vehicleId } = req.params;

    // Fetch all bookings for this vehicle
    const bookings = await Booking.find({ vehicleId });

    res.status(200).json({ bookings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
