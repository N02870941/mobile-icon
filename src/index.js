const path    = require('path');
const multer  = require('multer');
const util    = require('util');
const fs      = require('fs');
const errors  = require('./error');
const service = require('./service');
const storage = require('./storage');
const upload  = util.promisify(multer(storage).single('file'));
const mimes   = [
  'image/jpeg',
  'image/pjpeg',
  'image/png'
];

//------------------------------------------------------------------------------

/**
 * Executes as a callback
 * function to res.download()
 * when the result file is
 * being sent back to the client.
 */
async function download_callback(zip_name, dest, out_dir, error) {

  try {

    if (error) {

      console.error("An error occured when sending zip file back to client");
      console.error(error);

    } else {

      console.log("Zip file successfully sent back to client");
    }

    await service.cleanup(zip_name, dest, out_dir);

  } catch (e) {

    console.error("Callback for res.download() failed");
    console.error(e);
  }
}

//------------------------------------------------------------------------------

/**
 * Sends an error message
 * back to the client.
 */
function upload_failed(error, res) {

  console.error('Upload unsuccessful, sending error to client');

  if (error) {

    console.error(error);
  }

  let code = 500;
  let body = {

    message : "Could not upload file"
  };

  // File not found or
  // no file was sent to server
  if (error instanceof errors.EmptyUploadError) {

    body.message = "No file was uploaded. Please upload a file before submitting form.";
    code = 406;

  } else if (error instanceof errors.InvalidFileError) {

    body.message = "Invalid file type. Please ensure the file is " +
                   "of one of the following types: " + mimes;
    code = 406;

  } else {

    body.message = `An unknown error occured. Please report bug`,
    body.url     = `https://github.com/N02870941/mobile-icon/issues`
  }

  res.status(code).json(body);
}

//------------------------------------------------------------------------------

/**
 * Calls the modify function
 * that edits the photos then
 * sends the zipped result back
 * to the client.
 */
async function edit_icon(file, res) {

  try {

    let e        = undefined;
    let out_name = 'icon'
    let zip_name = path.join(`${out_name}.zip`);
    let out_dir  = path.join(out_name);

    // Make sure a file
    // was actually uploaded
    if (!file) {

      e = new errors.EmptyUploadError('No file was uploaded');

    // Check MIMETYPE
    } else if (!mimes.includes(file.mimetype)) {

      e = new errors.InvalidFileError('Invalid MIMETYPE: ' + file.mimetype);
    }

    // If an error
    // arose, throw it
    if (e) {

      throw e;
    }

    // If we got to this point, we can confindently
    // assume the the upload file was successfully
    // uploaded and the file is in a valid image form.
    // We can then proceed to edit the image and zip
    // the results, then send it back to the client.
    console.log("Upload successful, creating icons");

    let zip = await service.modify(file.path, out_dir);

    console.log('Sending zip file back to client');

    res.download(zip_name, path.join(__dirname, zip), (error) => {

      download_callback(zip_name, file.destination, out_dir, error);
    });

  } catch(error) {

    upload_failed(error, res);
  }
}

//------------------------------------------------------------------------------

/**
 * Entry point function
 * for /upload endpoint.
 */
async function ingress(req, res) {

  try {

    console.log("Recieved new post request, uploading file");

    // TODO - check MIMETYPE before saving file

    await upload(req, res);
    await edit_icon(req.file, res);

    console.log('Transaction completed without errors, response on it\'s way back to client');

  } catch(error) {

    console.error('Transaction completed with errors. Sending response to client');

    upload_failed(error, res);
  }

}

//------------------------------------------------------------------------------

module.exports = {

  ingress
};
