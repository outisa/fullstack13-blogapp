const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models') 
const { tokenExtractor, activeSessionChecker } = require('../utils/authorization')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [ 
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          }
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }      
        }
      ]
    }
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userID'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [
      ['likes', 'DESC'],
    ]
  })
  
  res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)

  const blog = await Blog.create({ ...req.body, userId: user.id })
  res.json(blog)
})

router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

router.delete('/:id', blogFinder, tokenExtractor, activeSessionChecker, async (req, res) => {
  if ((req.blog.userId === req.decodedToken.id) && req.session) {
    await req.blog.destroy() 
    res.status(204).end()
  } else {
    res.status(404).json({ 'error': 'unauthorized'})
  }
})

module.exports = router
