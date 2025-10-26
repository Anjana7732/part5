import { useState, useEffect, useRef } from 'react'
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
  const blogFormRef = useRef()

  // Fetch all blogs on loa
  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(null), 5000)
  }

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
    } catch (error) {
      notify('Wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    notify('Logged out')
  }

  
  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      notify(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
      blogFormRef.current.toggleVisibility() // Hide form
    } catch (error) {
      notify('Failed to add blog')
    }
  }

  
  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    // Keep the user info so it doesn't disappear
    setBlogs(blogs.map(b => b.id !== blog.id ? b : { ...returnedBlog, user: blog.user }))
  }

  // Delete a blog
  const handleDelete = async (blog) => {
    const ok = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
    if (ok) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      notify(`Deleted blog "${blog.title}"`)
    }
  }


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

  // If logged in → show blogs + form
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            user={user}
          />
        ))}
    </div>
  )
}

export default App
