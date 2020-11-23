module.exports = (error, req, res, next) => {
  console.error(error)

  res.status(500).json({
    title: 'Oops!',
    message: 'Something went wrong',
  })
}
