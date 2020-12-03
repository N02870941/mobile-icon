const util = require("util")
const multer = require("multer")
const os = require("os")

// https://bezkoder.com/node-js-upload-multiple-files/
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, os.tmpdir())
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg"]

    if (match.indexOf(file.mimetype) === -1) {
      const message = `${file.originalname} is invalid. Only accept png/jpeg.`
      return callback(message, null)
    }

    // TODO - use some uuid to prevent against overwriting files from concurrent requests
    const filename = `${Date.now()}-${file.originalname}`
    callback(null, filename)
  }
})

const uploadFiles = multer({ storage: storage }).array("images", 10)

module.exports = util.promisify(uploadFiles)
