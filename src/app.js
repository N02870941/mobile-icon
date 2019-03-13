const port     = process.env.PORT || process.argv[2] || 80;
const index    = require('./index');
const path     = require('path');
const express  = require('express');
const app      = express();
const template = path.join(__dirname, 'template');

//------------------------------------------------------------------------------

app.set('view engine', 'ejs');
app.set('views', template);
app.use(express.static(template));
app.use('/error',   index.renderError);
app.post('/upload', index.ingress);
app.listen(port, () => console.log(`Listening on port ${port}`));
