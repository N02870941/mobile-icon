const Events = require('events')

class CustomError          extends Error {}
class EmptyUploadError     extends CustomError {}
class CleanupError         extends CustomError {}
class InvalidFileError     extends CustomError {}
class ImageProcessingError extends CustomError {}
class EventDispatcher      extends Events {}

module.exports = {
  CustomError,
  EmptyUploadError,
  CleanupError,
  InvalidFileError,
  ImageProcessingError,
  EventDispatcher
}
