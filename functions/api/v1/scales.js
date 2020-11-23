module.exports = (() => {
  const router = require('express').Router()

  router.get('/scales', (req, res) =>  res.json(req.scales))

  return router
})()
