const path    = require('path');
const multer  = require('multer');
const util    = require('util');
const fs      = require('fs');
const crypto  = require('crypto');
const errors  = require('./error');
const service = require('./service');
const storage = require('./storage');
const upload  = util.promisify(multer(storage).single('file'));

//------------------------------------------------------------------------------

/**
 * Sends an error message back to the client.
 */
function upload_failed(error, res) {
  if (error)
    console.error(error);

    // TODO - We do not actually have to switch
    // because all custom errors have messages
    // that should be safe to send directly back to
    // the client. Simply check whether or not the
    // extension is one of the custom types (perhaps)
    // they should all subclass some common super type.
    // Then send the error's message. If not, use a
    // generic error message

  let body = {message : "Could not upload file"};
  let code = 500;

  switch (typeof error) {
    case errors.EmptyUploadError:
      body.message = "No file was uploaded. Please upload a file before submitting form."
      code         = 406;
      break
    case error instanceof errors.InvalidFileError:
      body.message = `Invalid file type. Please ensure the file is of one of the following types:  + ${storage.types}`
      code         = 406
      break
    default:
      body.message = `An unknown error occured. Please report bug`,
      body.url     = `https://github.com/N02870941/mobile-icon/issues`
  }

  res.status(code).json(body);
}

//------------------------------------------------------------------------------

/**
 * Calls the modify function that edits the photos then
 * sends the zipped result back to the client.
 */
async function edit_icon(file, res) {

  if (!file)
    throw new errors.EmptyUploadError('No file was uploaded')

  const hash    = crypto.randomBytes(16).toString('hex');
  const out_dir = `temp-icon-${hash}`;
  const ext     = path.extname(file.originalname);
  const zip     = await service.modify(file.path, out_dir, ext);

  res.download(zip, 'icon.zip', (error) => {
    if (error)
      console.error(error)

    service
    .cleanup(zip, file.destination, out_dir)
    .catch(e => console.error(e))
  });
}

//------------------------------------------------------------------------------

/**
 * Entry point function for /upload endpoint.
 */
function ingress(req, res) {
  upload(req, res)
  .then(() => edit_icon(req.file, res))
  .catch(() => upload_failed(req.file, res))
}

// Server-side rendering of .ejs files
//------------------------------------------------------------------------------

async function renderError(req, res) {

  res.render('error');
}

//------------------------------------------------------------------------------

module.exports = {
  ingress,
  renderError
};
