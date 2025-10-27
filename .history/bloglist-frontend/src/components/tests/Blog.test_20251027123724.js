import { render, screen } from '@testing-library/react';
import Blog from './Blog';

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'React Testing',
    author: 'John Doe',
    url: 'http://reacttesting.com',
    likes: 10
  };

  render(<Blog blog={blog} />);

  // Title and author should be visible
  expect(screen.getByText('React Testing')).toBeInTheDocument();
  expect(screen.getByText('John Doe')).toBeInTheDocument();

  // URL and likes should NOT be visible
  expect(screen.queryByText('http://reacttesting.com')).toBeNull();
  expect(screen.queryByText('likes 10')).toBeNull();
});
