const mongoose = require("mongoose");

//MongoDb atlas Connection Configuration
async function connectDB() {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
}

module.exports = { connectDB };