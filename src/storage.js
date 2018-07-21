const fs      = require('fs');
const util    = require('util');
const multer  = require('multer');
const crypto  = require('crypto');
const service = require('./service');
const path    = require('path');
const exec    = util.promisify(require('child_process').exec);
const storage = multer.diskStorage({

  // http://www.riptutorial.com/node-js/example/14210/single-file-upload-using-multer

  destination: (req, file, callback) => {

    let name  = service.removeExtension(file.originalname);
    let ext   = path.extname(file.originalname);
    let date  = Date.now();
    let token = crypto.randomBytes(16).toString('hex');
    let dir   = path.join(__dirname, [name, date, token].join('-'));

    console.log(dir);

    console.log("Checking to see if upload directory exists");

    // Check if the directory exists
    if (!fs.existsSync('./uploads')) {

      console.log('Upload directory does not exist, creating it now');

      fs.mkdir('./uploads', (err) => {

          if (err) {

              console.log(err.stack);
          }
      });

    // Directory already there
    } else {

      console.log('Upload directory already exists');

    }

    callback(null, './uploads');
  },

  // Keep the original file name
  filename: (req, file, callback) => {

    callback(null, file.originalname);
  }

});

//------------------------------------------------------------------------------

module.exports = {

  storage
};
