const archiver = require('archiver')
const fs = require('fs')
const os = require('os')
const sharp = require('sharp')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

async function mkdir(directories) {
  return exec(`mkdir -p ${directories.join(" ")}`)
}

async function cp(source, destination) {
  return exec(`cp ${source} ${destination}`)
}

async function resize(image) {
  return sharp(image.in_file)
  .resize(image.width, image.width)
  .toFile(image.out_file)
}

function get_ios_image(image, scale, root) {
  return {
    directory: `${root}/ios`,
    out_file: `${root}/ios/${image.originalname}-${scale.width}@${scale.scale}.${image.extension}`,
    in_file: image.path,
    width: scale.width * scale.scale,
  }
}

function get_android_image(image, scale, root) {
  return {
    directory: `${root}/android/${scale.dpi}`,
    out_file: `${root}/android/${scale.dpi}/${image.originalname}`,
    in_file: image.path,
    width: scale.width,
  }
}

async function edit(config) {
  const directory = `${os.tmpdir()}/icons`

  const promises = config.images.map(async (image) => {
    const root = `${directory}/${image.originalname}-icons`

    const images = [
      config.scales.ios.map(scale => get_ios_image(image, scale, root)),
      config.scales.android.map(scale => get_android_image(image, scale, root)),
    ].flat()

    const directories = images.map(image => image.directory).concat(`${root}/original`)

    await mkdir(directories)
    await cp(image.path, `${root}/original/${image.originalname}`)

    return Promise.all(images.map(resize))
  })

  return Promise.all(promises).then(() => directory)
}

async function zip(source) {
  const destination = `${source}.zip`
  const archive = archiver('zip', { zlib: { level: 9 }})
  const stream = fs.createWriteStream(destination)

  return new Promise((resolve, reject) => {
    archive.directory(source, false)
    .on('error', reject)
    .pipe(stream)

    stream.on('close', () => {
      exec(`rm -rf ${source}`).then(() => {
        console.log("DELETED ICONS")
      }).catch(error => {
        return Promise.resolve("CAUGHT")
      })

      resolve({
        source,
        destination,
      })
    })
    archive.finalize()
  })
}

function cleanup(result) {
  try {
    fs.unlinkSync(result.destination)
  } catch (error) {
    console.error(error)
  }
}

module.exports = (req, res, next) => {
  edit({ images: req.files, scales: req.scales })
  .then(zip)
  .then(result => {
    res.on('finish', () => cleanup(result))

    res.download(result.destination, next)
  })
}
