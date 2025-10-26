import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const canDelete = blog.user?.username === user.username

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>

      {showDetails && (
        <div>
          <div>
            <a 
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:no-underline cursor-pointer"
            >
            {blog.url}
            </a>
            </div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={() => handleLike(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {canDelete && (
            <button 
              onClick={() => handleDelete(blog)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px"
            >remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
