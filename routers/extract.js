const express = require("express");
const multer = require("multer");
const { userAuth } = require("../middlewares/admin");
const upload = require("../config/multerConfig"); 
const { processFile } = require("../utils/extractText"); 

const extractRouter = express.Router();


extractRouter.post("/extract" , upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No file uploaded." 
      });
    }

    const summaryLength = req.body.length || 'medium';
    const result = await processFile(req.file, summaryLength);

    res.status(200).json({
      success: true,
      text: result.summary,
      keyPoints: result.keyPoints,
      fileType: result.fileType,
    });

  } catch (error) {
    console.error("Error in processFile:", error);
    next(error); 
  }
});

module.exports = extractRouter;