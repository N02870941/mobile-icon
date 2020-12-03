const os = require('os')
const path = require('path')

function get_ios_resize_operations(images, scales, root) {
  return images.map(image => {
    return scales.map(scale => {
      return {
        directory: `${root}/${image.originalname}/ios`,
        out_file: `${root}/${image.originalname}/ios/${image.originalname}-${scale.width}@${scale.scale}${path.extname(image.originalname)}`,
        in_file: image.path,
        width: scale.resolution.width,
        height: scale.resolution.height,
      }
    })
  })
  .flat()
}

function get_android_resize_operations(images, scales, root) {
  return images.map(image => {
    return scales.map(scale => {
      return {
        directory: `${root}/${image.originalname}/android/${scale.dpi}`,
        out_file: `${root}/${image.originalname}/android/${scale.dpi}/${image.originalname}`,
        in_file: image.path,
        width: scale.width,
        height: scale.height,
      }
    })
  })
  .flat()
}

function get_mkdir_operations(images, scales, root) {
  return images.map(image => `${root}/${image.originalname}`)
  .concat(
    images.map(image => {
      return scales.android.map(scale => `${root}/${image.originalname}/android/${scale.dpi}`)
      .concat(`${root}/${image.originalname}/ios`)
      .concat(`${root}/${image.originalname}/original`)
    })
    .flat()
  )
}

function get_cp_operations(images, root) {
  return images.map(image => {
    return {
      source: image.path,
      destination: `${root}/${image.originalname}/original/${image.originalname}`,
    }
  })
}

module.exports = (req, res, next) => {
  req.download = { folder: `${os.tmpdir()}/icons` } // TODO - use data or random hash

  req.operations = {
    mkdir: get_mkdir_operations(
      req.files,
      req.scales,
      req.download.folder
    ),

    cp: get_cp_operations(
      req.files,
      req.download.folder
    ),

    resize: [
      get_ios_resize_operations(
        req.files,
        req.scales.ios,
        req.download.folder
      ),
      get_android_resize_operations(
        req.files,
        req.scales.android,
        req.download.folder
      )
    ].flat()
  }

  next()
}
