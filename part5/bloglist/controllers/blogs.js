const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

// GET all blogs (anyone can view)
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

// POST new blog (requires valid token + userExtractor)
blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })
  res.status(201).json(populatedBlog)
})

// DELETE blog (only creator can delete)
blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const user = req.user
  const blog = await Blog.findById(req.params.id)

  if (!blog) return res.status(404).json({ error: 'blog not found' })
  if (!user || blog.user.toString() !== user._id.toString()) {
    return res.status(403).json({ error: 'only the creator can delete a blog' })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

// PUT to update blog (mainly likes)
blogsRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  ).populate('user', { username: 1, name: 1 })

  if (updatedBlog) res.json(updatedBlog)
  else res.status(404).end()
})

module.exports = blogsRouter
