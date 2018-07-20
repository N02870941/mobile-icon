const path    = require('path');
const multer  = require('multer');
const util    = require('util');
const fs      = require('fs');
const service = require('./service');
const storage = require('./storage');
const exec    = util.promisify(require('child_process').exec);
const upload  = multer(storage).single('file');

//------------------------------------------------------------------------------

/**
 * Entry point function
 * for /upload endpoint
 */
async function ingress(req, res, next) {

  // Delete old files
  await exec('rm -rf uploads icon.zip');

  console.log("Recieved new post request, proceeding to upload phase");

  upload(req, res, async (err) => {

    console.log('Upload complete');

    if (err) {

        return res.end("Error uploading file.");

    } else {

      console.log("Upload successful, creating icons");

      try {

        await service.modify('./uploads/icon.png', './icon' (zip) => {

          res.download('icon.zip', path.join(__dirname, zip), async (error) => {

            if (error) {

              console.log("An error occured when sending zip file back to client");
              console.log(error);

            } else {

              console.log("Zip file successfully sent back to client");
            }

            await exec('rm -rf uploads icon.zip');
          });

        });

      } catch (error) {

        res.status(500).json({

          message : "Internal server error",
          error   : error
        });
      }

    }

  });

}

//------------------------------------------------------------------------------

/**
 * Global exception handler
 * for any internal errors
 */
async function exception(req, res, next) {

  // TODO - Implement global exception handler
}

//------------------------------------------------------------------------------

module.exports = {

  ingress : ingress
};
