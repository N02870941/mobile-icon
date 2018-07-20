const path    = require('path');
const multer  = require('multer');
const util    = require('util');
const fs      = require('fs');
const service = require('./service');
const storage = require('./storage');
const upload  = multer(storage).single('file');

//------------------------------------------------------------------------------

/**
 * Entry point function
 * for /upload endpoint
 */
async function ingress(req, res, next) {

  console.log("Recieved new post request, proceeding to upload phase");

  await service.cleanup();

  upload(req, res, async (err) => {

    console.log('Upload complete, checking if successful');

    if (err) {

      console.log('Upload unsuccessful, sending error to client');

      let body = {

        message : "Could not upload file"
      };

      res.status(500).json(body);

    } else {

      console.log("Upload successful, creating icons");

      try {

        await service.modify('./uploads/icon.png', './icon', (zip) => {

          console.log('Sending zip file back to client');

          res.download('icon.zip', path.join(__dirname, zip), async (error) => {

            if (error) {

              console.log("An error occured when sending zip file back to client");
              console.log(error);

            } else {

              console.log("Zip file successfully sent back to client");
            }

            await service.cleanup();
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

module.exports = {

  ingress
};
