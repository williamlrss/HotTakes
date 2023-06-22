'use strict';

const multer = require('multer');

const MIME_TYPE_MAP = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
};

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images'); // Set the destination folder for storing images.
	},
	filename: (req, file, callback) => {
		const lastDotIndex = file.originalname.lastIndexOf('.');
		let name = file.originalname.substring(0, lastDotIndex);
		name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Replace accents
		name = name.split(' ').join('_'); // Replace spaces with underscores.
		const extension = MIME_TYPE_MAP[file.mimetype]; // Extension based on the MIME type.
		callback(null, name + '' + Date.now() + '.' + extension); // Set the filename with a timestamp and the file extension.
	},
});

module.exports = multer({ storage }).single('image'); // Handling single-file uploads.
