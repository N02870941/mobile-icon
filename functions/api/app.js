const cors = require('cors')({ origin: true })
const express = require('express')
const v1 = require('./v1/router')
const app = express()

app.use(cors)
app.use('/v1', v1)

module.exports = app
