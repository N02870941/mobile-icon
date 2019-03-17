const port     = process.env.PORT || process.argv[2] || 80;
const express  = require('express');
const app      = express();
const path     = require('path');
const template = path.join(__dirname, 'template');
const multer   = require('multer');
const util     = require('util');
const service  = require('./service');
const storage  = require('./storage');
const commons  = require('./commons')
const body_parser = require('body-parser')
const upload   = util.promisify(multer(storage).single('file'));

//------------------------------------------------------------------------------

app.set('views', template)
app.use(body_parser.json())
// app.use(body_parser.urlencoded({ extended: false }))
app.use(express.static(template))
app.post('/upload', ingress)
app.listen(port)

//------------------------------------------------------------------------------

function ingress(req, res, next) {
  console.log(req)

  upload(req, res)
  .then(() => edit_icon(req.file, res))
  .catch((error) => upload_failed(error, res))
}

//------------------------------------------------------------------------------

function edit_icon(file, res) {

  service.edit(file).then(zip => {
    res.download(zip, 'icon.zip', error => {
      if (error)
        service.dispatcher.emit('error', error)

      service.dispatcher.emit('cleanup')
    });
  })
}

//------------------------------------------------------------------------------

function upload_failed(error, res) {
  service.dispatcher.emit('error', error)
  service.dispatcher.emit('cleanup')

  const custom_response = {
    message : error.message,
    code: 406
  }

  const generic_response = {
    message : 'An unknown error occured. Please report bug',
    url     : 'https://github.com/N02870941/mobile-icon/issues',
    code    : 500
  }

  const body = error instanceof commons.CustomError ? custom_response : generic_response

  res.status(body.code).json(body)
}
