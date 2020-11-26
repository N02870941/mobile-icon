const cors = require('cors')({ origin: true })
const v1 = require('./v1/router')
const app = require('express')()

app.use(cors)
app.use('/v1', v1)

module.exports = app
