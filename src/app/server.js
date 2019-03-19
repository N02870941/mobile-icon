const port = process.env.PORT || process.argv[2] || 80;
const app  = require('./app').app

app.listen(port)
