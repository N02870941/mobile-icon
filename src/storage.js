const fs      = require('fs');
const util    = require('util');
const multer  = require('multer');
const crypto  = require('crypto');
const path    = require('path');
const shell   = require('shelljs');
const service = require('./service');
const errors  = require('./error');
const exec    = util.promisify(require('child_process').exec);

//------------------------------------------------------------------------------

const types = [
  '.jpeg',
  '.pjpeg',
  '.png'
];

//------------------------------------------------------------------------------

const storage = multer.diskStorage({

  // http://www.riptutorial.com/node-js/example/14210/single-file-upload-using-multer

  destination: (req, file, callback) => {

    let name  = service.removeExtension(file.originalname);
    let ext   = path.extname(file.originalname);
    let date  = Date.now();
    let token = crypto.randomBytes(16).toString('hex');
    let dir   = path.join(__dirname, 'temp', 'uploads', token);

    console.log("Checking to see if upload directory exists");

    // Check if the directory exists
    if (!fs.existsSync(dir)) {

      console.log('Upload directory does not exist, creating it now');

      shell.mkdir('-p', dir);

    // Directory already there
    } else {

      console.log('Upload directory already exists');
    }

    callback(null, dir);
  },

  // Keep the original file name
  filename: (req, file, callback) => {

    callback(null, file.originalname);
  }

});

//------------------------------------------------------------------------------

const fileFilter = (req, file, callback) => {

  let ext = path.extname(file.originalname);

  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {

    return callback(new errors.InvalidFileError('Only PNG and JPG images are allowed'));
  }

  callback(null, true);
};

//------------------------------------------------------------------------------

const limits = {

  fileSize: 1024 * 1024
};

//------------------------------------------------------------------------------

module.exports = {

  types,
  storage,
  fileFilter,
  limits
};
