const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  if (error.name === 'TypeError') {
    return res.status(400).send({ error: 'Malformatted id' })
  } else if ((error.name === 'SequelizeValidationError') || (error.name === 'SequelizeUniqueConstraintError') ) {
    return res.status(400).json({ error })
  }
  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler
}