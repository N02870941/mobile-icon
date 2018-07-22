class EmptyUploadError extends Error {

}

class CleanupError extends Error {

}

class InvalidFileError extends Error {

}

class ImageProcessingError extends Error {

}

//------------------------------------------------------------------------------

module.exports = {

  EmptyUploadError,
  CleanupError,
  InvalidFileError,
  ImageProcessingError
}
