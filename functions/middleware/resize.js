function resize(req, res, next) {
  console.log(req.files)


  res.json({
    message: 'success'
  })
}

module.exports = resize
