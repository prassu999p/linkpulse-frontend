import api from './config';

interface CreditResponse {
  credits: number;
}

export const creditService = {
  getCredits: async (): Promise<CreditResponse> => {
    const response = await api.get<CreditResponse>('/api/credits');
    return response.data;
  },
  
  useCredits: async (amount: number): Promise<CreditResponse> => {
    const response = await api.post<CreditResponse>('/api/credits/use', { amount });
    return response.data;
  },
};

export const contentService = {
  generatePost: async (prompt: string): Promise<{ content: string }> => {
    const response = await api.post<{ content: string }>('/api/generate', { prompt });
    return response.data;
  },
}; 