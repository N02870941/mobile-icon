const express     = require('express')
const app         = express()
const path        = require('path')
const multer      = require('multer')
const util        = require('util')
const service     = require('./service')
const storage     = require('./storage')
const commons     = require('./commons')
const template    = path.join(__dirname, 'template')
const body_parser = require('body-parser')
const http_context = require('express-http-context')
const upload      = util.promisify(multer(storage).single('file'))

//------------------------------------------------------------------------------

app.set('views', template)
app.use(body_parser.urlencoded({ extended: true }))
app.use(body_parser.json())
app.use(express.json())
app.use(express.static(template))
app.use(http_context.middleware)
app.post('/upload', upload, edit_icon)
app.use(notify_error)
app.use(handle_client_error)
app.use(handle_internal_error)

//------------------------------------------------------------------------------

function edit_icon(req, res, next) {
  service
  .edit(req.file)
  .then(file => download(res, file))
  .catch(next)
}

//------------------------------------------------------------------------------

function notify_error(error, req, res, next) {
  commons.dispatcher.emit('error', error)
  next(error)
}

//------------------------------------------------------------------------------

function handle_client_error(error, req, res, next) {
  if (error instanceof commons.CustomError) {
    send(res, {
      message: error.message,
      code: 406
    })

  } else {
    next(error)
  }
}

//------------------------------------------------------------------------------

function handle_internal_error(error, req, res, next) {
  send(res, {
    message : 'An unknown error occured. Please report bug',
    url     : 'https://github.com/N02870941/mobile-icon/issues',
    code    : 500
  })
}

//------------------------------------------------------------------------------

function download(res, file, filename = 'icon.zip') {
  res.download(file, filename, error => {
    if (error)
      commons.dispatcher.emit('error', error)
  })
}

//------------------------------------------------------------------------------

function send(res, payload) {
  res.status(payload.code).json(payload)
}

//------------------------------------------------------------------------------

module.exports = app
