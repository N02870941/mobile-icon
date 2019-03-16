const fs     = require('fs');
const util   = require('util');
const multer = require('multer');
const crypto = require('crypto');
const path   = require('path');
const shell  = require('shelljs');
const errors = require('./error');
const exec   = util.promisify(require('child_process').exec);

//------------------------------------------------------------------------------

const types = [
  '.jpeg',
  '.pjpeg',
  '.png'
];

//------------------------------------------------------------------------------

/**
 * Removes the extension and returns just a filename.
 */
function removeExtension(filename) {

  return filename.split('.')
                 .slice(0, -1)
                 .join('.');
}

//------------------------------------------------------------------------------

// http://www.riptutorial.com/node-js/example/14210/single-file-upload-using-multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let name  = removeExtension(file.originalname)
    let ext   = path.extname(file.originalname)
    let date  = Date.now()
    let token = crypto.randomBytes(16).toString('hex')
    let dir   = path.join(__dirname, 'temp', 'uploads', token)

    if (!fs.existsSync(dir))
      shell.mkdir('-p', dir)

    if (typeof callback === 'function')
      callback(null, dir)
  },

  filename: (req, file, callback) => {

    if (typeof callback === 'function')
      callback(null, file.originalname)
  }
});

//------------------------------------------------------------------------------

const fileFilter = (req, file, callback) => {
  let ext = path.extname(file.originalname);

  // TODO - Search through type array instead

  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg')
    return callback(new errors.InvalidFileError('Only PNG and JPG images are allowed'))
  else
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
  // limits,
  fileFilter
};
