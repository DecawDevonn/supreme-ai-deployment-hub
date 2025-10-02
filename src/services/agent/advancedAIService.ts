import { apiClient, handleServiceError } from '../config';

// Voice Technology
export interface VoiceGenerationRequest {
  text: string;
  speakers?: number;
  duration?: number; // in minutes
  voiceProfile?: string;
}

export interface ElevenLabsV3Request {
  text: string;
  emotion?: 'whisper' | 'laugh' | 'sigh' | 'scream';
  language?: string;
  speakers?: string[];
}

// Model Inference
export interface GroqRequest {
  prompt: string;
  model?: 'grok-2.5';
  useCache?: boolean;
}

export interface CommandRRequest {
  prompt: string;
  contextWindow?: number;
  language?: string;
  ragEnabled?: boolean;
}

// Audio & Music
export interface MusicGenerationRequest {
  prompt?: string;
  videoUrl?: string;
  genre?: string;
  withVocals?: boolean;
  duration?: number;
}

// Image Editing
export interface ImageEditRequest {
  imageUrl: string;
  instruction: string;
  preserveStyle?: boolean;
}

// Video & Avatar
export interface ProductToVideoRequest {
  productImage: string;
  sceneDescription: string;
  duration?: number;
}

export interface TalkingAvatarRequest {
  imageUrl: string;
  audioUrl: string;
  lipSyncAccuracy?: 'standard' | 'high' | 'cinematic';
}

export const AdvancedAIService = {
  // Voice Technology
  generateVoiceWithVibe: async (request: VoiceGenerationRequest) => {
    try {
      const response = await apiClient.post('/ai/voice/vibe', request);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error generating voice with Microsoft Vibe');
    }
  },

  generateVoiceWithElevenLabs: async (request: ElevenLabsV3Request) => {
    try {
      const response = await apiClient.post('/ai/voice/elevenlabs-v3', request);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error generating voice with ElevenLabs V3');
    }
  },

  // Major Model Inference
  inferenceWithGrok: async (request: GroqRequest) => {
    try {
      const response = await apiClient.post('/ai/inference/grok', request);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error running Grok inference');
    }
  },

  inferenceWithCommandR: async (request: CommandRRequest) => {
    try {
      const response = await apiClient.post('/ai/inference/command-r', request);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error running Command R+ inference');
    }
  },

  // Audio & Music Generation
  generateMusic: async (request: MusicGenerationRequest) => {
    try {
      const response = await apiClient.post('/ai/music/generate', request);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error generating music');
    }
  },

  generateVideoToMusic: async (videoUrl: string) => {
    try {
      const response = await apiClient.post('/ai/music/video-to-music', { videoUrl });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error generating video-to-music');
    }
  },

  // Image Editing
  editImageWithQwen: async (request: ImageEditRequest) => {
    try {
      const response = await apiClient.post('/ai/image/qwen-edit', request);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error editing image with Qwen');
    }
  },

  // Video & Avatar Technology
  generateProductVideo: async (request: ProductToVideoRequest) => {
    try {
      const response = await apiClient.post('/ai/video/product-to-video', request);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error generating product video');
    }
  },

  generateTalkingAvatar: async (request: TalkingAvatarRequest) => {
    try {
      const response = await apiClient.post('/ai/avatar/talking-avatar', request);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error generating talking avatar');
    }
  },

  generateAudioDrivenVideo: async (imageUrl: string, audioUrl: string) => {
    try {
      const response = await apiClient.post('/ai/video/audio-driven', {
        imageUrl,
        audioUrl
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error generating audio-driven video');
    }
  },

  // Developer Tools
  getCachedPromptTokens: async (promptId: string) => {
    try {
      const response = await apiClient.get(`/ai/dev/cache/${promptId}`);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error getting cached tokens');
    }
  },

  analyzeContextWindow: async (contextId: string) => {
    try {
      const response = await apiClient.get(`/ai/dev/context/${contextId}`);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error analyzing context window');
    }
  },

  // Excel Copilot Integration
  generateExcelFormula: async (naturalLanguageQuery: string, dataContext?: any) => {
    try {
      const response = await apiClient.post('/ai/excel/formula', {
        query: naturalLanguageQuery,
        context: dataContext
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error generating Excel formula');
    }
  },

  analyzeExcelData: async (spreadsheetData: any, analysisType: string) => {
    try {
      const response = await apiClient.post('/ai/excel/analyze', {
        data: spreadsheetData,
        analysisType
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error analyzing Excel data');
    }
  }
};
