import { AxiosError } from 'axios';
import { api } from '../config';
import {
  PostGenerationFormData,
  PostGenerationResponse,
  UserCreditsResponse,
  PostGenerationError,
} from '../../components/PostGeneration/types';

class PostService {
  async generatePost(data: PostGenerationFormData): Promise<PostGenerationResponse> {
    try {
      const response = await api.post<PostGenerationResponse>('/content/post', data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<PostGenerationError>;
      if (axiosError.response?.data?.detail) {
        throw new Error(axiosError.response.data.detail);
      }
      if (axiosError.code === 'ERR_NETWORK') {
        throw new Error(
          'Unable to connect to the server. Please check if the backend server is running.'
        );
      }
      throw new Error('Failed to generate post. Please try again.');
    }
  }

  async getUserCredits(): Promise<UserCreditsResponse> {
    try {
      const response = await api.get<UserCreditsResponse>('/credits');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<PostGenerationError>;
      if (axiosError.response?.data?.detail) {
        throw new Error(axiosError.response.data.detail);
      }
      if (axiosError.code === 'ERR_NETWORK') {
        throw new Error(
          'Unable to connect to the server. Please check if the backend server is running.'
        );
      }
      throw new Error('Failed to fetch user credits. Please try again.');
    }
  }
}

export const postService = new PostService();
