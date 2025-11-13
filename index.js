require("dotenv").config();
const express = require('express');
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors"); 
const multer = require("multer"); 
const authRouter = require("./routers/auth");
const extractRouter = require("./routers/extract");
const app = express();


const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
  origin: FRONTEND_URL, 
  credentials: true                
}));
app.use(express.json());
app.use(cookieParser());


app.use("/"  , authRouter);
app.use("/" , extractRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.message);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`
    });
  }

  if (err.message.startsWith("Unsupported file type")) {
    return res.status(400).json({
      success: false,
      message: err.message 
    });
  }

  return res.status(500).json({
    success: false,
    message: "Server error while processing file.",
    error: err.message
  });
});


connectDB()

// connectDB().then(() => {
//   console.log("Connected to database");
//   app.listen(process.env.PORT || 3000, () => {
//     console.log(`Server Running on port ${process.env.PORT || 3000}`);
//   });
// });

module.exports = app;