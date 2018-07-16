const path    = require('path');
const util    = require('util');
const exec    = util.promisify(require('child_process').exec);
const port    = process.env.PORT || process.argv[2] || 80;
const express = require('express');
const app     = express();

//------------------------------------------------------------------------------

app.post('/upload', ingress);
app.use('/', express.static(path.join(__dirname, 'static')));

//------------------------------------------------------------------------------

async function ingress(req, res, next) {

  try {

    const {stdout, stderr} =  await exec('./index.sh ~/Desktop/icon.png ./icon');
    const zip              = stdout.replace(/(\r\n\t|\n|\r\t)/gm,"");

    res.download('icon.zip', path.join(__dirname, zip));

  } catch (error) {

    let body = {

      message : "Internal server error",
      error   : error
    };

    res.status(500).json(body);
  }
}

//------------------------------------------------------------------------------

console.log(`Listening on port ${port}`);

app.listen(port);
