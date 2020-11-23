const archiver = require('archiver')
const fs = require('fs')
const os = require('os')
const sharp = require('sharp')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

async function mkdirs(directories) {
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

async function edit(config) {
  const directory = `${os.tmpdir()}/icons`

  const promises = config.images.map(async (image) => {
    const root = `${directory}/${image.originalname}-icons`

    const images = [
      config.scales.ios.map(scale => {
        const dir = `${root}/ios`

        return {
          directory: dir,
          out_file: `${dir}/${image.originalname}-${scale.width}@${scale.scale}.${image.extension}`,
          in_file: image.path,
          width: scale.width * scale.scale,
        }
      }),

      config.scales.android.map(scale => {
        const dir = `${root}/android/${scale.dpi}`

        return {
          directory: dir,
          out_file: `${dir}/${image.originalname}`,
          in_file: image.path,
          width: scale.width,
        }
      })
    ].flat()

    const directories = images.map(image => image.directory).concat(`${root}/original`)

    await mkdirs(directories)
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

module.exports = (req, res, next) => {
  edit({ images: req.files, scales: req.scales })
  .then(zip)
  .then(result => {
    res.on('finish', () => {
        try {
          fs.unlinkSync(result.destination)
        } catch (error) {
          console.error(error)
        }
    })

    res.download(result.destination, next)
  })
}
