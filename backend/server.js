const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createServer } = require("http");
const authRoutes = require("./routes/auth");
const app = express();
const httpServer = createServer(app);
const vehicleRoutes = require("./routes/Vehicle");
const BookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
require('dotenv').config()

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin:[
    'http://localhost:5173',
    'http://'
  ],
  credentials:true
}));
app.use("/auth", authRoutes);
app.use("/vehicle",vehicleRoutes);
app.use("/booking", BookingRoutes);
app.use("/admin", adminRoutes);


mongoose.connect(process.env.MONGO_URI).then(()=>console.log('mongodb connected')).catch((err)=>console.log());

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
