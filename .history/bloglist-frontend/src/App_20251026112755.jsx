import { useState, useEffect, useR } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  // fetch blogs when app loads
  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  // keep login persistent
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // helper: show notification for 5s
  const notify = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(null), 5000)
  }

  // handle login
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notify(`Welcome ${user.name}`)
    } catch (exception) {
      notify('Wrong username or password')
    }
  }

  // handle logout
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    notify('Logged out')
  }

  // add new blog
  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      notify(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
    } catch (error) {
      notify('Failed to add blog')
    }
  }

  // if not logged in → show login form
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  // if logged in → show blogs + blog form
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <BlogForm createBlog={addBlog} />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
