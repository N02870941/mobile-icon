const port    = process.env.PORT || process.argv[2] || 80;
const index   = require('./index');
const path    = require('path');
const express = require('express');
const app     = express();

//------------------------------------------------------------------------------

function main() {

  // Create routes
  app.post('/upload', index.ingress);
  app.use('/', express.static(path.join(__dirname, 'static')));

  // Listen on specified port
  app.listen(port, () => {

    console.log(`Listening on port ${port}`);
  });
}

//------------------------------------------------------------------------------

main();