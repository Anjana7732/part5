require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require("./controllers/users")
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const app = express()

// Parse JSON bodies
app.use(express.json())

// Connect to MongoDB
const mongoUrl = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err.message))

// Token extractor middleware for all requests
app.use(middleware.tokenExtractor)

// Routes
// userExtractor is applied only to routes that require user authentication
app.use('/api/blogs', blogsRouter)  // GET works without token; POST/DELETE will use middleware inside router
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// Error handling middleware
app.use(middleware.errorHandler)

module.exports = app
