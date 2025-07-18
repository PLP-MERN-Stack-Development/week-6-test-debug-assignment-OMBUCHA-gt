import { render, screen, waitFor } from '@testing-library/react';
import PostList from '../../components/PostList';
import axios from 'axios';

jest.mock('axios');

describe('PostList', () => {
  it('displays posts from API', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { _id: '1', title: 'Mock Post', content: 'Some content' }
      ]
    });

    render(<PostList />);

    await waitFor(() => {
      expect(screen.getByText(/mock post/i)).toBeInTheDocument();
    });
  });

  it('displays error message on API failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    render(<PostList />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
