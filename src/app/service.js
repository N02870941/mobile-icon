const fs          = require('fs')
const util        = require('util')
const archiver    = require('archiver')
const imagemagick = require('imagemagick')
const scales      = require('./template/scale.json')
const commons     = require('./commons')
const path        = require('path')
const crypto      = require('crypto')
const shell       = require('shelljs')
const http_context = require('express-http-context')
const storage     = require('./storage')
const exec        = util.promisify(require('child_process').exec)
const dispatcher  = commons.dispatcher

//------------------------------------------------------------------------------

function edit(file) {
  if (!file)
    throw new commons.EmptyUploadError('No file was uploaded. Please upload a file before submitting form.')

  const hash    = crypto.randomBytes(16).toString('hex');
  const out_dir = path.join(__dirname, 'temp', 'downloads', hash)
  const ext     = path.extname(file.originalname);

  storage.mark_for_deletion(
    file.destination,
    out_dir
  )

  return modify(file.path, out_dir, ext)
}

//------------------------------------------------------------------------------

async function modify(in_file, outdir, ext) {
  const results = []
  const zipdir  = `${outdir}.zip`
  const ios_dir = `${outdir}/ios`
  const and_dir = `${outdir}/android`

  const dirs = scales.android
  .map(pair => `${and_dir}/${pair.dpi}`)
  .concat([
    ios_dir
  ])

  await create_directories(dirs)

  const promises = [
    create_ios_assets(in_file, ext, ios_dir),
    create_android_assets(in_file, ext, and_dir)
  ]

  await Promise.all(promises)
               .then(() => zip(outdir, zipdir))

  return zipdir
}

//------------------------------------------------------------------------------

async function create_directories(dirs) {

  return dirs.map(directory => {
    exec(`mkdir -p ${directory}`)
  })
}

//------------------------------------------------------------------------------

function create_ios_assets(file, ext, dir) {
  const results = []

  for (const pair of scales.ios) {
    const promise = convert([
      file,
      '-resize',
      `${pair.width}x${pair.width}`,
      `${dir}/icon-${pair.width}@${pair.scale}x${ext}`
    ])

    results.push(promise)
  }

  return Promise.all(results)
}

//------------------------------------------------------------------------------

function create_android_assets(in_file, ext, and_dir) {
  const results = []

  for (const pair of scales.android) {
    const directory = `${and_dir}/${pair.dpi}`

    results.push(convert([
      in_file,
      '-resize',
      `${pair.width}x${pair.width}`,
      `${directory}/icon${ext}`
    ]))
  }

  return Promise.all(results)
}

//------------------------------------------------------------------------------

// https://stackoverflow.com/questions/22519784/how-do-i-convert-an-existing-callback-api-to-promises
function convert(options) {
  return new Promise((resolve, reject) => {
    imagemagick.convert(options, (stderr, stdout) => {
      if (stderr) reject(stderr)
      else resolve(stdout)
    })
  })
}

//------------------------------------------------------------------------------

// https://stackoverflow.com/questions/15641243/need-to-zip-an-entire-directory-using-node-js
function zip(source, out) {
  storage.mark_for_deletion(out)

  const archive = archiver('zip', { zlib: { level: 9 }})
  const stream  = fs.createWriteStream(out)

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', reject)
      .pipe(stream)

    stream.on('close', resolve)
    archive.finalize()
  })
}

//------------------------------------------------------------------------------

module.exports = {
  edit,
  dispatcher
}
