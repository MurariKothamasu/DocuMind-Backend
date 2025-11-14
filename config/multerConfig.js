const multer = require('multer');

//Accepted File Types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'text/plain', 
    'image/jpeg', 
    'image/png', 
    'image/jpg', 
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Please upload PDF, or images(JPG , PNG).'), false);
  }
};

//Multer MemoryStorage Configeration
const upload = multer({
  storage: multer.memoryStorage(), 
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

module.exports = upload;