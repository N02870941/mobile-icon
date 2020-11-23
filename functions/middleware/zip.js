const archiver = require('archiver')
const fs = require('fs')

module.exports = (req, res, next) => {
  const destination = `${req.download.folder}.zip`
  const archive = archiver('zip', { zlib: { level: 9 }})
  const stream = fs.createWriteStream(destination)

  archive.directory(req.download.folder, false)
  .on('error', next)
  .pipe(stream)

  stream.on('close', () => {
    req.download.zip = destination
    next()
  })

  archive.finalize()
}
