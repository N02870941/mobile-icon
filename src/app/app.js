const express        = require('express')
const app            = express()
const path           = require('path')
const multer         = require('multer')
const util           = require('util')
const service        = require('./service')
const storage        = require('./storage')
const commons        = require('./commons')
const template       = path.join(__dirname, 'template')
const body_parser    = require('body-parser')
const http_context   = require('express-http-context')
const upload         = util.promisify(multer(storage).single('file'))
const Sentry         = require('@sentry/node');
const dispatcher     = commons.dispatcher
const gui_sentry_dsn = process.env.GUI_SENTRY_DSN
const api_sentry_dsn = process.env.API_SENTRY_DSN

assert_dsn_declared()

Sentry.init({ dsn: api_sentry_dsn });

//------------------------------------------------------------------------------

app.set('views', template)
app.use(Sentry.Handlers.requestHandler());
app.use(body_parser.urlencoded({ extended: true }))
app.use(body_parser.json())
app.use(express.json())
app.use(express.static(template))
app.use(http_context.middleware)
app.post('/upload', upload, edit_icon)
app.get('/sentry', get_gui_sentry_dsn)
app.use(Sentry.Handlers.errorHandler());
app.use(notify_error)
app.use(handle_client_error)
app.use(handle_internal_error)

//------------------------------------------------------------------------------

function assert_dsn_declared() {
  if (!api_sentry_dsn) {
    throw new Error("Cannot start API without Sentry DSN for API")
  }

  if (!gui_sentry_dsn) {
    throw new Error("Cannot start API without Sentry DSN for GUI")
  }
}

//------------------------------------------------------------------------------

function get_gui_sentry_dsn(req, res) {
  res.status(200)
     .json({ dsn: gui_sentry_dsn })
}

//------------------------------------------------------------------------------

function edit_icon(req, res, next) {
  service
  .edit(req.file)
  .then(file => download(res, file))
  .catch(next)
}

//------------------------------------------------------------------------------

function notify_error(error, req, res, next) {
  dispatcher.emit('error', error)
  next(error)
}

//------------------------------------------------------------------------------

function handle_client_error(error, req, res, next) {
  if (error instanceof commons.CustomError) {
    send(res, {
      title: "Not accepted",
      message: error.message,
      code: 406
    })

  } else if (error.code === 'LIMIT_FILE_SIZE') {

    send(res, {
      title: "File too large",
      message: "Please make sure that your file does not execeed 1024x1024 pixels in resolution.",
      code: 406
    })

  } else {
    next(error)
  }
}

//------------------------------------------------------------------------------

function handle_internal_error(error, req, res, next) {
  send(res, {
    title   : 'Oops!',
    message : 'An unknown error occured. Please report bug so we can improve and keep giving you quality images!',
    url     : 'https://github.com/N02870941/mobile-icon/issues',
    code    : 500
  })
}

//------------------------------------------------------------------------------

function download(res, file, filename = 'icon.zip') {
  res.download(file, filename, error => {
    if (error)
      dispatcher.emit('error', error)
  })
}

//------------------------------------------------------------------------------

function send(res, payload) {
  res.status(payload.code).json(payload)
}

//------------------------------------------------------------------------------

exports.app = app
