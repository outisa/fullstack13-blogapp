const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Blog } = require('../models')
const { SECRET } = require('../utils/config')

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

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['id', 'passwordHash'] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const { username, name, password } = req.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const userToCreate = {
    username,
    name,
    passwordHash
  }
  const user = await User.create(userToCreate)
  res.status(201).json(user)
})

router.put('/:username', tokenExtractor, async (req, res) => {
  let userToUpdate = await User.findOne({
    attributes: { exclude: ['passwordHash'] },
    where: {
      'username': req.params.username 
    }
  })
  if ( userToUpdate.id === req.decodedToken.id) {
    userToUpdate.username = req.body.username
    userToUpdate.save()
    res.json(userToUpdate)
  } else {
    res.status(404).json({ 'error': 'unauthorized'})
  }
})

module.exports = router