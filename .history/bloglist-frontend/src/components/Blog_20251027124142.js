import { useState } from 'react';

const Blog = ({ blog, handleLike }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className="blog-details">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
