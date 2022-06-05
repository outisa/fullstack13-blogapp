const { sequelize } = require('../utils/db')
const Blog = require('../models/blog')
const router = require('express').Router()

router.get('/', async (req, res) => {
  const authorsInfo =  await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('title')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
    ],
    group: 'author',
    order: [[sequelize.col("likes"), "DESC"]],    
  })
  res.status(200).send(authorsInfo)
})


module.exports = router