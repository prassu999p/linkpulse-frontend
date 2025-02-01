import { postService } from '../postService';
import { api } from '../../config';
import { PostGenerationFormData } from '../../../components/PostGeneration/types';

// Mock the axios instance
jest.mock('../../config', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe('postService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePost', () => {
    const mockPostData: PostGenerationFormData = {
      topic: 'Test Topic',
      tone: 'professional',
    };

    const mockResponse = {
      data: {
        success: true,
        data: {
          post: {
            content: 'Generated post content',
            id: '123',
            timestamp: new Date().toISOString(),
          },
          credits_remaining: 9,
        },
      },
    };

    it('should successfully generate a post', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await postService.generatePost(mockPostData);

      expect(api.post).toHaveBeenCalledWith('/content/post', mockPostData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle API error with message', async () => {
      const errorMessage = 'Insufficient credits';
      (api.post as jest.Mock).mockRejectedValueOnce({
        response: {
          data: {
            detail: errorMessage,
          },
        },
      });

      await expect(postService.generatePost(mockPostData)).rejects.toThrow(errorMessage);
    });

    it('should handle generic error', async () => {
      (api.post as jest.Mock).mockRejectedValueOnce(new Error());

      await expect(postService.generatePost(mockPostData)).rejects.toThrow(
        'Failed to generate post. Please try again.'
      );
    });
  });

  describe('getUserCredits', () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          credits: 10,
        },
      },
    };

    it('should successfully fetch user credits', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await postService.getUserCredits();

      expect(api.get).toHaveBeenCalledWith('/credits');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle API error with message', async () => {
      const errorMessage = 'User not found';
      (api.get as jest.Mock).mockRejectedValueOnce({
        response: {
          data: {
            detail: errorMessage,
          },
        },
      });

      await expect(postService.getUserCredits()).rejects.toThrow(errorMessage);
    });

    it('should handle generic error', async () => {
      (api.get as jest.Mock).mockRejectedValueOnce(new Error());

      await expect(postService.getUserCredits()).rejects.toThrow(
        'Failed to fetch user credits. Please try again.'
      );
    });
  });
});
