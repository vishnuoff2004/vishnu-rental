// scripts/createAdmin.js (run once)
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

async function createAdmin() {
  await mongoose.connect("mongodb://127.0.0.1:27017/bike-rental-app");
//   const hashed = await bcrypt.hash("123", 10);

  const admin = new User({
    name: "admin",
    email: "admin@gmail.com",
    password: "123",
    role: "admin",
  });

  await admin.save();
  console.log("Admin created");
  process.exit();
}
createAdmin().catch(console.error);
