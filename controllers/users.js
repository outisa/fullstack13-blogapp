const router = require('express').Router()
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
const { User, Blog  } = require('../models')
const { tokenExtractor } = require('../utils/authorization')

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

router.get('/:id', async (req, res) => {
  let where = {}
  if (req.query.read && req.query.read === 'true') {
    where = {
      [Op.and]: [{ read: true }, { userId: req.params.id }]
    }
  } else if (req.query.read && req.query.read === 'false')  {
    where = {
      [Op.and]: [{ read: false }, { userId: req.params.id }]
    } 
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['passwordHash', 'createdAt', 'updatedAt'] },
    include: [
    {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },      
      through: {
        attributes: ['id','read'],
        where
      }
    }]
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
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
  // We do not want to return passwordHash
  const createdUser = {
    'username' : user.username,
  }
  res.status(201).json(createdUser)
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