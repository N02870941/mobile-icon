const controller = require('./controller');
const path       = require('path');
const port       = process.env.PORT || process.argv[2] || 80;
const express    = require('express');
const app        = express();

//------------------------------------------------------------------------------

function main() {

  // Create routes
  app.post('/upload', controller.upload);
  app.use('/', express.static(path.join(__dirname, 'static')));

  // List on specified port
  app.listen(port, () => {

    console.log(`Listening on port ${port}`);
  });
}

//------------------------------------------------------------------------------

main();
