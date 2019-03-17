const express  = require('express');
const app      = express();
const path     = require('path');
const multer   = require('multer');
const util     = require('util');
const service  = require('./service');
const storage  = require('./storage');
const commons  = require('./commons')
const template = path.join(__dirname, 'template');
const body_parser = require('body-parser')
const upload   = util.promisify(multer(storage).single('file'));

//------------------------------------------------------------------------------

app.set('views', template)
app.use(body_parser.urlencoded({ extended: true }))
app.use(body_parser.json())
app.use(express.json())
app.use(express.static(template))
app.post('/upload', ingress)
app.use(log_error)
app.use(handle_client_error)
app.use(handle_internal_error)

//------------------------------------------------------------------------------

function ingress(req, res, next) {
  upload(req, res)
  .then(() => edit_icon(req, res, next))
  .catch(next)
}

//------------------------------------------------------------------------------

function edit_icon(req, res, next) {
  const filename = req.body.filename ? `${req.body.filename}.zip` : 'icon.zip'

  service
  .edit(req.file)
  .then(zip => {

    res.download(zip, filename, error => {
      if (error)
        service.dispatcher.emit('error', error)

      service.dispatcher.emit('cleanup')
    })
  })
  .catch(error => {
    next(error)
  })
}

//------------------------------------------------------------------------------

function log_error(error, req, res, next) {
  service.dispatcher.emit('error', error)
  service.dispatcher.emit('cleanup')

  console.error(error)
  next(error)
}

//------------------------------------------------------------------------------

function handle_client_error(error, req, res, next) {
  if (error instanceof commons.CustomError) {
    const body = {
      message : error.message,
      code: 406
    }

    res.status(body.code).json(body)

  } else {
    next(error)
  }
}

//------------------------------------------------------------------------------

function handle_internal_error(error, req, res, next) {
  const body = {
    message : 'An unknown error occured. Please report bug',
    url     : 'https://github.com/N02870941/mobile-icon/issues',
    code    : 500
  }

  res.status(body.code).json(body)
}

//------------------------------------------------------------------------------

module.exports = app
