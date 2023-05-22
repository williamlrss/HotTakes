import { promises as fsPromises } from 'fs';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fsPromises.mkdir('uploads');
      cb(null, 'uploads/');
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
  fileFilter: (req, file, cb) => {
    if ((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

const upload = multer({ storage });

export default upload;