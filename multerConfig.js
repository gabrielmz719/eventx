const multer = require('multer');
const path = require('path');

const uploadDir = path.join(__dirname,'public', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

module.exports = upload;