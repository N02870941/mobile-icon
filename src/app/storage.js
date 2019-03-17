const fs      = require('fs')
const util    = require('util')
const multer  = require('multer')
const crypto  = require('crypto')
const path    = require('path')
const shell   = require('shelljs')
const commons = require('./commons')
const exec    = util.promisify(require('child_process').exec)

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
    const name  = removeExtension(file.originalname)
    const ext   = path.extname(file.originalname)
    const date  = Date.now()
    const token = crypto.randomBytes(16).toString('hex')
    const dir   = path.join(__dirname, 'temp', 'uploads', token)

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
  const ext = path.extname(file.originalname);

  // TODO - Search through type array instead

  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg')
    return callback(new commons.InvalidFileError(`Invalid file type. Please ensure the file is of one of the following types: ${types}`))
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
