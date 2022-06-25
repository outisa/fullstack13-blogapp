const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { User, ActiveSessions, UserSession } = require('../models')
const router = require('express').Router()

const { SECRET } = require('../utils/config')

router.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })
  if (user.disabled) {
    return res.status(401).json({
      error: 'Account disabled, please contact admins'
    })
  }
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
    id: user.id,
  }
  const token = jwt.sign(userForToken, SECRET)

  const new_active_session = {
    'activeSessionToken': token
  }
  const savedActiveSessions = await ActiveSessions.create(new_active_session)

  const sessionToSave = {
    'userId': user.id,
    'activeSessionId': savedActiveSessions.id
  }
  await UserSession.create(sessionToSave)

  res
    .status(200)
    .send({ token, id: user.id, username: user.username})
})

module.exports = router