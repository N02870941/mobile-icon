const Busboy = require('busboy');
const os = require('os');
const path = require('path');
const fs = require('fs');

const FILE_SIZE_LIMIT = 10 * 1024 * 1024

// https://mikesukmanowsky.com/firebase-file-and-image-uploads/
// https://cloud.google.com/functions/docs/writing/http#multipart_data

function getBusBoy(headers) {
  return new Busboy({
    headers: headers,
    limits: { fileSize: FILE_SIZE_LIMIT }
  })
}

module.exports = (req, res, next) => {
  const busboy = getBusBoy(req.headers)
  const fields = {}
  const files = []
  const fileWrites = []
  const tmpdir = os.tmpdir()

  busboy.on('field', (key, value) => fields[key] = value)

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {

    // TODO - validate mimetype

    const filepath = path.join(tmpdir, filename)
    const writeStream = fs.createWriteStream(filepath)

    file.pipe(writeStream)

    fileWrites.push(new Promise((resolve, reject) => {
      file.on('end', () => writeStream.end())

      writeStream.on('finish', () => {
        fs.readFile(filepath, (err, buffer) => {
          const size = Buffer.byteLength(buffer)

          if (err) {
            return reject(err)
          }

          files.push({
            directory: tmpdir,
            originalname: filename,
            path: filepath,
            extension: filename.substr(filename.lastIndexOf('.') + 1)
          })

          resolve()
        })
      })

      writeStream.on('error', reject)
    }))
  })

  busboy.on('finish', () => {
    Promise.all(fileWrites).then(() => {
      req.body = fields
      req.files = files
      next()
    })
    .catch(next)
  });

  busboy.end(req.rawBody)
}
