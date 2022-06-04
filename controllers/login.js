const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { User } = require('../models')
const router = require('express').Router()

const { SECRET } = require('../utils/config')

router.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid credentials'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }
  const token = jwt.sign(userForToken, SECRET)

  res
    .status(200)
    .send({ token, username: user.username, name: user.name})
})

module.exports = router