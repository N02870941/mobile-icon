const port    = process.env.PORT || process.argv[2] || 80;
const index   = require('./index');
const path    = require('path');
const express = require('express');
const app     = express();

//------------------------------------------------------------------------------

app.post('/upload', index.ingress);
app.use('/', express.static(path.join(__dirname, 'static')));

app.listen(port, () => {

  console.log(`Listening on port ${port}`);
});
