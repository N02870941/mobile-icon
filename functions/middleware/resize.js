const sharp = require('sharp')
const exec = require('util').promisify(require('child_process').exec)

async function mkdir(directories) {
  return exec(`mkdir -p ${directories.join(" ")}`)
}

async function cp(operations) {
  return Promise.all(operations.map(operation => {
    return exec(`cp ${operation.source} ${operation.destination}`)
  }))
}

async function resize(operations) {
  return Promise.all(operations.map(operation => {
    return sharp(operation.in_file)
    .resize(operation.width, operation.width)
    .toFile(operation.out_file)
  }))
}

module.exports = async (req, res, next) => {
  await mkdir(req.operations.mkdir)
  await cp(req.operations.cp)
  await resize(req.operations.resize)
  next()
}
