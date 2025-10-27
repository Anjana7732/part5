import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from '../Blog';
import '@testing-library/jest-dom';

describe('Blog component', () => {
  const blog = {
    title: 'React Testing',
    author: 'John Doe',
    url: 'http://reacttesting.com',
    likes: 10
  };

  test('renders title and author but not url or likes by default', () => {
    render(<Blog blog={blog} />);

    expect(screen.getByText(/React Testing/)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.queryByText('http://reacttesting.com')).toBeNull();
    expect(screen.queryByText('likes 10')).toBeNull();
  });

  test('shows url and likes when view button is clicked', async () => {
    render(<Blog blog={blog} />);
    const user = userEvent.setup();

    await user.click(screen.getByText('view'));

    expect(screen.getByText('http://reacttesting.com')).toBeInTheDocument();
    expect(screen.getByText('likes 10')).toBeInTheDocument();
  });

  test('calls event handler twice if like button is clicked twice', async () => {
    const mockHandler = jest.fn();
    render(<Blog blog={blog} handleLike={mockHandler} />);
    const user = userEvent.setup();

    await user.click(screen.getByText('view'));
    const likeButton = screen.getByText('like');

    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
