const fs      = require('fs');
const util    = require('util');
const multer  = require('multer');
const exec    = util.promisify(require('child_process').exec);
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

//------------------------------------------------------------------------------

module.exports = {

  storage
};
