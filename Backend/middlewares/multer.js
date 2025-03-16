const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Use absolute paths for the upload directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use path.join with __dirname to get absolute path
    // Go up one directory level if you're in the middlewares folder
    const uploadPath = path.join(__dirname, '..', 'public', 'images', 'uploads');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(6, function(err, name) {
      const fn = name.toString('hex') + path.extname(file.originalname);
      cb(null, fn);
    });
  }
});

const upload = multer({ storage: storage });

module.exports = upload;