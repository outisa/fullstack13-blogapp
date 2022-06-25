const router = require('express').Router()
const { ReadingList } = require('../models')
const { tokenExtractor, activeSessionChecker } = require('../utils/authorization')

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body
  const listObject = {
    userId,
    blogId
  }

  const createdListObject = await ReadingList.create(listObject)
  res.status(201).json(createdListObject)
})

router.put('/:id', tokenExtractor, activeSessionChecker,  async (req, res) => {
  let blogListToUpdate = await ReadingList.findByPk(req.params.id)

  if ((blogListToUpdate.userId === req.decodedToken.id) && req.session) {
    blogListToUpdate.read = req.body.read
    blogListToUpdate.save()
    res.status(200).json(blogListToUpdate)
  } else {
    res.status(404).json({ 'error': 'unauthorized'})
  }
})

module.exports = router 