const path    = require('path');
const multer  = require('multer');
const util    = require('util');
const fs      = require('fs');
const service = require('./service');
const storage = require('./storage');
const upload  = util.promisify(multer(storage).single('file'));

//------------------------------------------------------------------------------

/**
 * Executes as a callback
 * function to res.download()
 * when the result file is
 * being sent back to the client.
 */
async function download_callback(error) {

  try {

    if (error) {

      console.log("An error occured when sending zip file back to client");
      console.log(error);

    } else {

      console.log("Zip file successfully sent back to client");
    }

    await service.cleanup();

  } catch (e) {

    console.log("Callback for res.download() failed");
    console.log(e);
  }
}

//------------------------------------------------------------------------------

/**
 * Sends an error message
 * back to the client.
 */
function upload_failed(error, res) {

  console.log('Upload unsuccessful, sending error to client');

  let code = 500;
  let body = {

    message : "Could not upload file"
  };

  // File not found or
  // no file was sent to server
  if (error.code == 1) {

    body.message = "No file was uploaded. Please upload a file before submitting form.";
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
async function edit_icon(res) {

  try {

    console.log("Upload successful, creating icons");

    let zip = await service.modify('./uploads/icon.png', './icon');

    console.log('Sending zip file back to client');

    res.download('icon.zip', path.join(__dirname, zip), download_callback);

  } catch (error) {

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

    await service.cleanup();
    await upload(req, res);
    await edit_icon(res);

  } catch(error) {

    upload_failed(error, res);
  }

}

//------------------------------------------------------------------------------

module.exports = {

  ingress
};
