import { apiClient, handleServiceError } from '../config';

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: 'image-generation' | 'llm' | 'audio' | 'video' | 'voice' | 'utility';
  icon: string;
  version: string;
  author: string;
  repository: string;
  requirements: SystemRequirements;
  installSize: number; // in GB
  status: 'available' | 'installing' | 'installed' | 'running' | 'stopped' | 'error';
  installDate?: Date;
  lastRun?: Date;
  webUIPort?: number;
}

export interface SystemRequirements {
  minRAM: number; // in GB
  minVRAM: number; // in GB
  minStorage: number; // in GB
  gpuRequired: boolean;
  os: ('windows' | 'macos' | 'linux')[];
}

export interface InstallationProgress {
  toolId: string;
  status: 'downloading' | 'extracting' | 'installing-deps' | 'configuring' | 'complete' | 'failed';
  progress: number; // 0-100
  currentStep: string;
  eta?: number; // seconds
  error?: string;
}

export interface SystemInfo {
  os: string;
  cpuCores: number;
  totalRAM: number;
  availableRAM: number;
  gpuName?: string;
  gpuVRAM?: number;
  availableStorage: number;
}

export interface ToolScript {
  id: string;
  toolId: string;
  name: string;
  description: string;
  type: 'install' | 'run' | 'update' | 'uninstall';
  script: string;
}

export const PinokioService = {
  // Discovery and Catalog
  getToolCatalog: async (category?: AITool['category']): Promise<AITool[]> => {
    try {
      const response = await apiClient.get('/local-ai/catalog', {
        params: { category }
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error fetching tool catalog');
    }
  },

  searchTools: async (query: string): Promise<AITool[]> => {
    try {
      const response = await apiClient.get('/local-ai/search', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error searching tools');
    }
  },

  getInstalledTools: async (): Promise<AITool[]> => {
    try {
      const response = await apiClient.get('/local-ai/installed');
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error fetching installed tools');
    }
  },

  // Installation and Management
  installTool: async (toolId: string): Promise<InstallationProgress> => {
    try {
      const response = await apiClient.post('/local-ai/install', { toolId });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error installing tool');
    }
  },

  getInstallationProgress: async (toolId: string): Promise<InstallationProgress> => {
    try {
      const response = await apiClient.get(`/local-ai/install-progress/${toolId}`);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error fetching installation progress');
    }
  },

  uninstallTool: async (toolId: string): Promise<void> => {
    try {
      await apiClient.delete(`/local-ai/tools/${toolId}`);
    } catch (error) {
      return handleServiceError(error, 'Error uninstalling tool');
    }
  },

  updateTool: async (toolId: string): Promise<InstallationProgress> => {
    try {
      const response = await apiClient.post(`/local-ai/tools/${toolId}/update`);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error updating tool');
    }
  },

  // Running Tools
  runTool: async (toolId: string): Promise<{
    processId: string;
    webUIUrl?: string;
    port?: number;
  }> => {
    try {
      const response = await apiClient.post(`/local-ai/tools/${toolId}/run`);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error running tool');
    }
  },

  stopTool: async (toolId: string): Promise<void> => {
    try {
      await apiClient.post(`/local-ai/tools/${toolId}/stop`);
    } catch (error) {
      return handleServiceError(error, 'Error stopping tool');
    }
  },

  getToolStatus: async (toolId: string): Promise<{
    status: AITool['status'];
    processId?: string;
    port?: number;
    uptime?: number;
    memoryUsage?: number;
    cpuUsage?: number;
  }> => {
    try {
      const response = await apiClient.get(`/local-ai/tools/${toolId}/status`);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error fetching tool status');
    }
  },

  // System Information
  getSystemInfo: async (): Promise<SystemInfo> => {
    try {
      const response = await apiClient.get('/local-ai/system-info');
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error fetching system info');
    }
  },

  checkCompatibility: async (toolId: string): Promise<{
    compatible: boolean;
    issues: string[];
    warnings: string[];
  }> => {
    try {
      const response = await apiClient.post(`/local-ai/tools/${toolId}/check-compatibility`);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error checking compatibility');
    }
  },

  // Scripts Management
  getToolScripts: async (toolId: string): Promise<ToolScript[]> => {
    try {
      const response = await apiClient.get(`/local-ai/tools/${toolId}/scripts`);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error fetching tool scripts');
    }
  },

  executeScript: async (scriptId: string): Promise<{
    success: boolean;
    output: string;
    error?: string;
  }> => {
    try {
      const response = await apiClient.post(`/local-ai/scripts/${scriptId}/execute`);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error executing script');
    }
  },

  // Popular Tools Catalog
  getPopularTools: async (): Promise<AITool[]> => {
    return [
      {
        id: 'stable-diffusion-webui',
        name: 'Stable Diffusion WebUI',
        description: 'Powerful image generation with Stable Diffusion models. Create stunning AI art locally.',
        category: 'image-generation',
        icon: '🎨',
        version: '1.7.0',
        author: 'AUTOMATIC1111',
        repository: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui',
        requirements: {
          minRAM: 8,
          minVRAM: 6,
          minStorage: 20,
          gpuRequired: true,
          os: ['windows', 'macos', 'linux']
        },
        installSize: 18.5,
        status: 'available'
      },
      {
        id: 'llama-cpp',
        name: 'LLaMA.cpp',
        description: 'Run LLaMA models locally with CPU or GPU acceleration. Fast and efficient.',
        category: 'llm',
        icon: '🦙',
        version: '3.0.0',
        author: 'ggerganov',
        repository: 'https://github.com/ggerganov/llama.cpp',
        requirements: {
          minRAM: 16,
          minVRAM: 0,
          minStorage: 30,
          gpuRequired: false,
          os: ['windows', 'macos', 'linux']
        },
        installSize: 25.0,
        status: 'available'
      },
      {
        id: 'comfyui',
        name: 'ComfyUI',
        description: 'Node-based interface for Stable Diffusion. Build complex workflows visually.',
        category: 'image-generation',
        icon: '🎭',
        version: '1.0.0',
        author: 'comfyanonymous',
        repository: 'https://github.com/comfyanonymous/ComfyUI',
        requirements: {
          minRAM: 8,
          minVRAM: 8,
          minStorage: 25,
          gpuRequired: true,
          os: ['windows', 'macos', 'linux']
        },
        installSize: 22.0,
        status: 'available'
      },
      {
        id: 'xtts',
        name: 'XTTS Voice Cloning',
        description: 'Clone voices and generate speech in multiple languages locally.',
        category: 'voice',
        icon: '🎤',
        version: '2.0.0',
        author: 'coqui-ai',
        repository: 'https://github.com/coqui-ai/TTS',
        requirements: {
          minRAM: 8,
          minVRAM: 4,
          minStorage: 10,
          gpuRequired: true,
          os: ['windows', 'macos', 'linux']
        },
        installSize: 8.5,
        status: 'available'
      },
      {
        id: 'musicgen',
        name: 'MusicGen',
        description: 'Generate music from text descriptions. Create custom soundtracks locally.',
        category: 'audio',
        icon: '🎵',
        version: '1.5.0',
        author: 'facebookresearch',
        repository: 'https://github.com/facebookresearch/audiocraft',
        requirements: {
          minRAM: 12,
          minVRAM: 8,
          minStorage: 15,
          gpuRequired: true,
          os: ['windows', 'macos', 'linux']
        },
        installSize: 12.0,
        status: 'available'
      },
      {
        id: 'whisper',
        name: 'Whisper',
        description: 'Robust speech recognition. Transcribe audio with high accuracy.',
        category: 'audio',
        icon: '🎧',
        version: '3.0.0',
        author: 'OpenAI',
        repository: 'https://github.com/openai/whisper',
        requirements: {
          minRAM: 8,
          minVRAM: 4,
          minStorage: 5,
          gpuRequired: false,
          os: ['windows', 'macos', 'linux']
        },
        installSize: 3.5,
        status: 'available'
      },
      {
        id: 'animatediff',
        name: 'AnimateDiff',
        description: 'Create animated videos from images. Bring your art to life.',
        category: 'video',
        icon: '🎬',
        version: '1.2.0',
        author: 'guoyww',
        repository: 'https://github.com/guoyww/AnimateDiff',
        requirements: {
          minRAM: 16,
          minVRAM: 12,
          minStorage: 30,
          gpuRequired: true,
          os: ['windows', 'linux']
        },
        installSize: 28.0,
        status: 'available'
      },
      {
        id: 'ollama',
        name: 'Ollama',
        description: 'Run LLMs locally with ease. Simple CLI and API for language models.',
        category: 'llm',
        icon: '🤖',
        version: '0.1.17',
        author: 'jmorganca',
        repository: 'https://github.com/jmorganca/ollama',
        requirements: {
          minRAM: 8,
          minVRAM: 0,
          minStorage: 20,
          gpuRequired: false,
          os: ['windows', 'macos', 'linux']
        },
        installSize: 15.0,
        status: 'available'
      }
    ];
  }
};
