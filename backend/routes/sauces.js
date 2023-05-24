// const express = require('express');
// const router = express.Router();
// const upload = require('../path/to/upload.js');

// // Handle the file upload
// router.post('/upload', upload.single('image'), (req, res) => {
//   // Access the uploaded file through req.file
//   console.log(req.file);

//   // Handle further processing or response
//   res.json({ message: 'File uploaded successfully' });
// });

// module.exports = router;

'use strict'

const saucesController = require('../controllers/sauces');
const multer = require('../middleware/multer');
const authenticate = require('../middleware/authenticate');
const express = require('express');
const router = express.Router();


router.get('/', authenticate, saucesController.getAllSauces);
router.get('/:id', authenticate, saucesController.getOneSauce);
router.post('/', authenticate, multer, saucesController.createSauce);
router.put('/:id', authenticate, multer, saucesController.updateSauce);
router.delete('/:id', authenticate, saucesController.deleteSauce);
router.post('/:id/like', authenticate, saucesController.likeSauce);

module.exports = router;