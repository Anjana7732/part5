import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from '../BlogForm';

test('calls onSubmit with correct details when new blog is created', async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  await user.type(screen.getByPlaceholderText('Title'), 'Testing Form');
  await user.type(screen.getByPlaceholderText('Author'), 'Jane Doe');
  await user.type(screen.getByPlaceholderText('URL'), 'http://testingform.com');
  await user.click(screen.getByText('Create'));

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing Form',
    author: 'Jane Doe',
    url: 'http://testingform.com'
  });
});
