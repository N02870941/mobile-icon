const archiver = require('archiver')
const fs = require('fs')
const sharp = require('sharp')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

function resize_ios(image, sizes) {
  return Promise.all(sizes.map(size => {
    return Promise.resolve({
      path: image.path,
      file: null,
      name: image.originalname,
      size: size,
    })
  }))
}

function resize_android(image, sizes) {
  return Promise.all(sizes.map(size => {
    return Promise.resolve({
      path: image.path,
      file: null,
      name: image.originalname,
      size: size,
    })
  }))
}

function resize(config) {
  return Promise.all(config.images.map(image => {
    return Promise.all([
      resize_ios(image, config.scales.ios),
      resize_android(image, config.scales.android),
    ])
    .then(values => values.flat())
  }))
}

function mkdirs(images, scales) {
  return Promise.all(images.map(image => {
    return Promise.resolve([
      `${image.originalname}/ios`,
      `${image.originalname}/android`,
    ])
  }))
  .then(directories => {
    return {
      images,
      scales,
      directories,
    }
  })
}

function zip(images) {
  console.log(images)

  const source = "./uploads"
  const destination = `${source}.zip`

  const archive = archiver('zip', { zlib: { level: 9 }})
  const stream = fs.createWriteStream(destination)

  return new Promise((resolve, reject) => {
    archive.directory(source, false)
    .on('error', reject)
    .pipe(stream)

    stream.on('close', () => resolve(destination))
    archive.finalize()
  })
}

module.exports = (req, res, next) => {
  mkdirs(req.files, req.scales)
  .then(resize)
  .then(zip)
  .then(file => res.download(file, next))
}
