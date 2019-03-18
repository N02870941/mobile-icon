const fs      = require('fs')
const util    = require('util')
const multer  = require('multer')
const crypto  = require('crypto')
const path    = require('path')
const shell   = require('shelljs')
const moment  = require('moment')
const commons = require('./commons')
const cron    = require('cron')
const exec    = util.promisify(require('child_process').exec)
const temp_files  = []

//------------------------------------------------------------------------------

const types = [
  '.jpeg',
  '.pjpeg',
  '.png'
];

//------------------------------------------------------------------------------

// Clean up old files every N minutes
cron.job('*/1 * * * *', cleanup)
    .start()

//------------------------------------------------------------------------------

function cleanup() {
  const now   = new Date()
  const files = []

  let i = temp_files.length

  while(i--) {
    let file = temp_files[i]

    if (file.expiration < now) {
      files.push(file.name)
      temp_files.splice(i, 1)
    }
  }

  const command = `rm -rf ${files.join(' ')}`

  exec(command).catch(error => dispatcher.emit('error', error))
}

//------------------------------------------------------------------------------

async function mark_for_deletion() {
  const now        = new Date()
  const expiration = moment(now).add(1, 'm')
                                .toDate()

  for (let i = 0; i < arguments.length; i++) {
    let file = arguments[i]

    temp_files.push({
      name: file,
      expiration: expiration
    })
  }
}

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

    mark_for_deletion(dir)

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

  // TODO - Search through "type" array instead

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
  fileFilter,
  cleanup,
  mark_for_deletion
};
