export type ToneOption = 'professional' | 'casual' | 'friendly' | 'humorous';

export interface PostGenerationFormData {
  topic: string;
  tone: ToneOption;
}

export interface PostGenerationFormProps {
  onSubmit: (data: PostGenerationFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export interface GeneratedPost {
  content: string;
  credits_remaining: number;
}

export interface PostGenerationResponse {
  post_content: string;
  credits_remaining: number;
}

export interface UserCreditsResponse {
  credits: number;
}

export interface PostGenerationError {
  detail: string;
  status?: number;
}
