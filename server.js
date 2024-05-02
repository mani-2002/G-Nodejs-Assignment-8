const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// Set up storage using Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    const allowedFileTypes = /png|docx|pdf/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (extname || mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only .png, .docx, and .pdf file formats are allowed!');
    }
  },
}).single('file');

// Serve static files
app.use(express.static('public'));

// Handle file uploads
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).send(err);
    }

    // File uploaded successfully
    const fileLink = `/uploads/${req.file.filename}`;
    const fileName = req.file.originalname; // Get the original file name

    res.status(200).json({ link: fileLink });
  });
});
app.use('/uploads', express.static('uploads'));
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
