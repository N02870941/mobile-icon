const path    = require('path');
const express = require('express');
const multer  = require('multer');
const util    = require('util');
const fs      = require('fs');
const exec    = util.promisify(require('child_process').exec);
const port    = process.env.PORT || process.argv[2] || 80;
const app     = express();
const storage = multer.diskStorage({

  // http://www.riptutorial.com/node-js/example/14210/single-file-upload-using-multer

  destination: (req, file, callback) => {

    console.log("Checking to see if upload directory exists");

    // Check if the directory exists
    if (!fs.existsSync('./uploads')) {

      console.log('Upload directory does not exist, creating it now');

      fs.mkdir('./uploads', (err) => {

          if (err) {

              console.log(err.stack);
          }
      });

    // Directory already there
    } else {

      console.log('Upload directory already exists');
    }

    callback(null, './uploads');
  },

  filename: (req, file, callback) => {

    callback(null, 'icon.png');
  }

});

// Create routes
//------------------------------------------------------------------------------

app.post('/upload', ingress);
app.use('/', express.static(path.join(__dirname, 'static')));

//------------------------------------------------------------------------------

async function modify(req, res, next) {

  try {

    console.log("Executing imagemagick shell script");

    const in_file = "./uploads/icon.png";
    const out_dir = "./icon";

    const {stdout, stderr} =  await exec(`./index.sh ${in_file} ${out_dir}`);
    const zip              = stdout.replace(/(\r\n\t|\n|\r\t)/gm,"");

    console.log("Zipping complete, sending back to client");

    res.download('icon.zip', path.join(__dirname, zip), async (error) => {

      if (error) {

        console.log("An error occured when sending file back to client");
        console.log(error);

      } else {

        console.log("Zip file successfully sent back to client");
      }

      await exec('rm -rf uploads icon.zip');

    });

  } catch (error) {

    let body = {

      message : "Internal server error",
      error   : error
    };

    res.status(500).json(body);
  }
}

//------------------------------------------------------------------------------

function ingress(req, res, next) {

  console.log("Recieve new post request, proceeding to upload phase");

  var upload = multer({ storage : storage}).single('file');

  upload(req, res, async (err) => {

    console.log('Upload complete');

    if (err) {

        return res.end("Error uploading file.");

    } else {

      console.log("Upload successful, creating icons");

      await modify(req, res, next);
    }

  });

}

//------------------------------------------------------------------------------

console.log(`Listening on port ${port}`);

app.listen(port);
