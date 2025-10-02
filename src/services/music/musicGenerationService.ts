import { supabase } from "@/integrations/supabase/client";

export interface MusicGenerationParams {
  prompt: string;
  duration?: number;
  genre?: string;
  mood?: string;
  action?: 'generate' | 'analyze' | 'remix';
}

export interface MusicTrack {
  id: string;
  title: string;
  description: string;
  duration: number;
  genre: string;
  mood: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  createdAt: Date;
  metadata?: any;
}

export class MusicGenerationService {
  private static instance: MusicGenerationService;

  static getInstance(): MusicGenerationService {
    if (!this.instance) {
      this.instance = new MusicGenerationService();
    }
    return this.instance;
  }

  async generateMusic(params: MusicGenerationParams): Promise<{ description: string; metadata: any }> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-music', {
        body: {
          prompt: params.prompt,
          duration: params.duration || 30,
          genre: params.genre,
          mood: params.mood,
          action: params.action || 'generate'
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to generate music');

      return {
        description: data.description,
        metadata: data.metadata
      };
    } catch (error: any) {
      console.error('Music generation error:', error);
      throw new Error(error.message || 'Failed to generate music');
    }
  }

  async analyzeMusic(description: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-music', {
        body: {
          prompt: description,
          action: 'analyze'
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to analyze music');

      return data.description;
    } catch (error: any) {
      console.error('Music analysis error:', error);
      throw new Error(error.message || 'Failed to analyze music');
    }
  }

  async remixMusic(description: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-music', {
        body: {
          prompt: description,
          action: 'remix'
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to generate remix ideas');

      return data.description;
    } catch (error: any) {
      console.error('Music remix error:', error);
      throw new Error(error.message || 'Failed to generate remix ideas');
    }
  }

  createTrack(title: string, description: string, metadata: any): MusicTrack {
    return {
      id: crypto.randomUUID(),
      title,
      description,
      duration: metadata.duration || 30,
      genre: metadata.genre || 'Unknown',
      mood: metadata.mood || 'Unknown',
      status: 'completed',
      createdAt: new Date(),
      metadata
    };
  }
}

export const musicService = MusicGenerationService.getInstance();
