const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

module.exports = (req, res, next) => {
  res.on('finish', () => {
    const files = [
      req.files.map(file => file.path),
      req.download.zip,
    ]

    const promises = files.flat().map(file => {
      return new Promise((resolve, reject) => {
        fs.unlink(file, (error) => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        })
      })
    })
    .concat(exec(`rm -rf ${req.download.folder}`))

    Promise.all(promises).catch(error => console.error(error))
  })

  res.download(req.download.zip, next)
  // res.status(500).json({})
}
