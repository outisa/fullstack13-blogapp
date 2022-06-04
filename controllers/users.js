const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
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

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      'username': req.params.username 
    },
  })
  user.username = req.body.username
  user.save()
  res.json(user)
})

module.exports = router