const multer = require('multer');
const path = require('path')
const crypto = require('crypto')

//disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {    //converts the file name to a random string
      crypto.randomBytes(6,function(err,name){
        const fn = name.toString('hex') + path.extname(file.originalname);
        cb(null, fn);
      })
    }
  })
  
  
  //upload variable
  const upload = multer({ storage: storage })

module.exports = upload;
