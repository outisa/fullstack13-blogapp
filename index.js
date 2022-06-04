const express = require('express')
require('express-async-errors')

const app = express()
const middleware = require('./utils/middleware')

const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const blogsrouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json())
app.use('/api/blogs', blogsrouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()