module.exports = function(req, res, next) {
  console.log(`${req.method}: ${req.originalUrl}`)

  res.on('finish', () => console.log(`Status: ${res.statusCode}`))

  next()
}
