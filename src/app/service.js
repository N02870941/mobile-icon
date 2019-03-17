const fs          = require('fs')
const util        = require('util')
const archiver    = require('archiver')
const imagemagick = require('imagemagick')
const scales      = require('./template/scale.json')
const commons     = require('./commons')
const path        = require('path');
const crypto      = require('crypto');
const exec        = util.promisify(require('child_process').exec)
const temp_files  = []

//------------------------------------------------------------------------------

const dispatcher = new commons.EventDispatcher()

dispatcher.on('cleanup', () => {

  exec(`rm -rf ${temp_files.join(' ')}`)
  .catch(error => dispatcher.emit('error', error))
})

dispatcher.on('error', (error) => {
  console.error(error)
})

//------------------------------------------------------------------------------

function edit(file) {
  if (!file)
    throw new commons.EmptyUploadError('No file was uploaded. Please upload a file before submitting form.')

  const hash    = crypto.randomBytes(16).toString('hex');
  const out_dir = `temp-icon-${hash}`;
  const ext     = path.extname(file.originalname);

  temp_files.push(file.destination)
  temp_files.push(out_dir)

  return modify(file.path, out_dir, ext)
}

//------------------------------------------------------------------------------

async function modify(in_file, outdir, ext) {
  const results = []
  const zipdir  = `${outdir}.zip`
  const org_dir = `${outdir}/original`
  const ios_dir = `${outdir}/ios`
  const and_dir = `${outdir}/android`

  await exec(`mkdir -p ${org_dir}`)
  await exec(`mkdir -p ${ios_dir}`)
  await exec(`mkdir -p ${and_dir}`)

  results.push(exec(`cp ${in_file} ${org_dir}/`))

  for (pair of scales.ios) {
    results.push(convert([
      in_file,
      '-resize',
      `${pair.width}x${pair.width}`,
      `${ios_dir}/icon-${pair.width}@${pair.scale}x${ext}`
    ]))
  }

  for (pair of scales.android) {
    const directory = `${and_dir}/${pair.dpi}`

    results.push(exec(`mkdir ${directory}`).then(() => {
      convert([
        in_file,
        '-resize',
        `${pair.width}x${pair.width}`,
        `${directory}/icon${ext}`
      ])
    }))
  }

  await Promise.all(results)
               .then(() => zip(outdir, zipdir))

  temp_files.push(zipdir)

  return zipdir
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
