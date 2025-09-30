const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token 

const initialBlogs = [
  { title: 'First blog', author: 'Alice', url: 'http://example1.com', likes: 5 },
  { title: 'Second blog', author: 'Bob', url: 'http://example2.com', likes: 3 }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })
  await user.save()

  
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  token = loginResponse.body.token

  for (let blog of initialBlogs) {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
  }
})

test('blogs are returned as JSON and correct amount', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
  expect(response.headers['content-type']).toMatch(/application\/json/)
})

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  expect(blog.id).toBeDefined()
})

test('a valid blog can be added with token', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'Charlie',
    url: 'http://newblog.com',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
})

test('adding a blog without token fails with 401', async () => {
  const newBlog = {
    title: 'Unauthorized blog',
    author: 'Eve',
    url: 'http://unauth.com'
  }

  await api.post('/api/blogs').send(newBlog).expect(401)
})

test('blog without likes defaults to 0', async () => {
  const newBlog = {
    title: 'No likes blog',
    author: 'NoOne',
    url: 'http://nolikes.com'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)

  expect(response.body.likes).toBe(0)
})

test('blog without title returns 400', async () => {
  const newBlog = { author: 'No title', url: 'http://notitle.com' }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blog without url returns 400', async () => {
  const newBlog = { title: 'No url', author: 'Anon' }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('a blog can be deleted by its creator', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)
})

test('a blog cannot be deleted without token', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(initialBlogs.length)
})

test('a blog can be updated (likes)', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0]

  const updatedData = { ...blogToUpdate.toJSON(), likes: blogToUpdate.likes + 1 }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)

  expect(response.body.likes).toBe(blogToUpdate.likes + 1)
})

afterAll(async () => {
  await mongoose.connection.close()
})
