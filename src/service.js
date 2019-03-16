const fs          = require('fs');
const util        = require('util');
const shell       = require('shelljs');
const archiver    = require('archiver');
const imagemagick = require('imagemagick')
const exec        = util.promisify(require('child_process').exec);

const convertOptions = {
  ios: [
    {width: 20, scale: 1},
    {width: 20, scale: 2},
    {width: 20, scale: 3},
    {width: 29, scale: 1},
    {width: 29, scale: 2},
    {width: 29, scale: 3},
    {width: 40, scale: 1},
    {width: 40, scale: 2},
    {width: 40, scale: 3},
    {width: 60, scale: 2},
    {width: 60, scale: 3},
    {width: 76, scale: 1},
    {width: 76, scale: 2},
    {width: 20, scale: 1},
    {width: 83.5, scale: 2},
    {width: 1024, scale: 1},
  ],
  android: [
    {width: 192, dpi: 'xxxhdpi'},
    {width: 144, dpi: 'xxhdpi'},
    {width: 96, dpi: 'xhdpi'},
    {width: 72, dpi: 'hdpi'},
    {width: 48, dpi: 'mdpi'},
    {width: 36, dpi: 'ldpi'},
    {width: 512, dpi: 'market'}
  ]
}

//------------------------------------------------------------------------------

/**
 * Deletes temporary files used at runtime.
 */
async function cleanup() {
  const files = []

  for (let i = 0; i < arguments.length; i++)
      files.push(arguments[i])

  shell.rm('-rf', files)
}

//------------------------------------------------------------------------------

async function modify(in_file, outdir, ext) {
  const results = []
  const zipdir  = `${outdir}.zip`

  await exec(`mkdir -p ${outdir}/{ios,android,original}`)

  results.push(exec(`cp ${in_file} ${outdir}/original/`))

  for (pair of convertOptions.ios) {
    results.push(convert([
      in_file,
      '-resize',
      `${pair.width}x${pair.width}`,
      `${outdir}/ios/icon-${pair.width}@${pair.scale}x${ext}`
    ]))
  };

  for (pair of convertOptions.android) {
    const directory = `${outdir}/android/${pair.dpi}`

    results.push(exec(`mkdir ${directory}`).then(() => {
      convert([
        in_file,
        '-resize',
        `${pair.width}x${pair.width}`,
        `${directory}/icon${ext}`
      ])
    }))
  };

  try {
    await Promise
    .all(results)
    .then(() => zip(outdir, zipdir))

  } catch(error) {

    throw new ImageProcessingError("Failed to convert images")
  }

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
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream  = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', reject)
      .pipe(stream);

    stream.on('close', resolve);
    archive.finalize();
  });
}

//------------------------------------------------------------------------------

module.exports = {
  modify,
  cleanup
};
