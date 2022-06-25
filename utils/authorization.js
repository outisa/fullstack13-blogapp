const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { ActiveSessions } = require('../models')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {   
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      res.status(401).json({ error: 'token invalid' })
    }
  } else {
    res.status(401).json({ error: 'token missing' })
  }
  next()
}

const activeSessionChecker = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization) {
    const checkSession = await ActiveSessions.findOne({
      where: {
        active_session_token: authorization.substring(7)
      }
    })
    if (checkSession) {
      req.session = checkSession
    } else {
      res.status(404).json({ error: 'Session expired'})
    }
  }
  next()
}

module.exports = { tokenExtractor, activeSessionChecker }