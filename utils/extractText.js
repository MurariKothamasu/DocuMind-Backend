
const { PDFParse } = require("pdf-parse");
const Tesseract = require("tesseract.js");
const summarizeText = require("../utils/summarizeText"); // Adjust path if needed


async function extractTextFromPdf(buffer) {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  
  if (parser.destroy) {
    await parser.destroy();
  }
  return result.text;
}


async function extractTextFromImage(buffer) {

  const result = await Tesseract.recognize(buffer, "eng");
  return result.data.text;
}

async function processFile(file , length) {
  let extractedText = "";

  if (file.mimetype === "application/pdf") {
    extractedText = await extractTextFromPdf(file.buffer);
  } else if (file.mimetype.startsWith("image/")) {
    extractedText = await extractTextFromImage(file.buffer);
  } else {
    
    throw new Error("Invalid file type passed to service.");
  }


  const { summary, keyPoints } = await summarizeText(extractedText, length);

  return {
    summary,
    keyPoints,
    fileType: file.mimetype,
  };
}

module.exports = {
  processFile,
};