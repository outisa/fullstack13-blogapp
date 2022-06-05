const express = require('express')
require('express-async-errors')

const app = express()
const middleware = require('./utils/middleware')

const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/author')

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()