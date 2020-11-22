const express = require('express')
const router = express.Router()

router.get('/scale', (req, res) => {
  res.json(req.scale)
})

module.exports = router
