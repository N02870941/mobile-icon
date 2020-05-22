const Events = require('events')
const path   = require('path')

class CustomError          extends Error {}
class EmptyUploadError     extends CustomError {}
class CleanupError         extends CustomError {}
class InvalidFileError     extends CustomError {}
class ImageProcessingError extends CustomError {}
class InvalidImageError    extends CustomError {}
class EventDispatcher      extends Events {}

const upload_dir   = path.join(__dirname, 'temp', 'uploads')
const download_dir = path.join(__dirname, 'temp', 'downloads')

const dispatcher = new EventDispatcher()

//------------------------------------------------------------------------------

dispatcher.on('error', log_error)

//------------------------------------------------------------------------------

function log_error(error) {
  console.error(error)
}

//------------------------------------------------------------------------------

module.exports = {
  dispatcher,
  CustomError,
  EmptyUploadError,
  CleanupError,
  InvalidFileError,
  ImageProcessingError,
  InvalidImageError,
  EventDispatcher,
  directory : {
    upload_dir,
    download_dir
  }
}
