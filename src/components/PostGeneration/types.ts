export type ToneOption = 'professional' | 'casual' | 'enthusiastic' | 'informative';

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
    id: string;
    timestamp: string;
} 