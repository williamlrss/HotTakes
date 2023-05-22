const express = require('express');
const router = express.Router();
const upload = require('../path/to/upload.js');

// Handle the file upload
router.post('/upload', upload.single('image'), (req, res) => {
  // Access the uploaded file through req.file
  console.log(req.file);

  // Handle further processing or response
  res.json({ message: 'File uploaded successfully' });
});

module.exports = router;