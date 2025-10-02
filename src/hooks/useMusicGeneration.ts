import { useState, useCallback } from 'react';
import { musicService, MusicTrack, MusicGenerationParams } from '@/services/music/musicGenerationService';
import { toast } from '@/hooks/use-toast';

export const useMusicGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);

  const generateMusic = useCallback(async (params: MusicGenerationParams) => {
    setIsGenerating(true);
    try {
      const result = await musicService.generateMusic(params);
      
      const newTrack = musicService.createTrack(
        params.prompt,
        result.description,
        result.metadata
      );
      
      setTracks(prev => [newTrack, ...prev]);
      setCurrentTrack(newTrack);
      
      toast({
        title: "Music Generated",
        description: "Your music composition has been created successfully!",
        variant: "success",
        duration: 3000,
      });
      
      return newTrack;
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate music",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const analyzeMusic = useCallback(async (description: string) => {
    setIsGenerating(true);
    try {
      const analysis = await musicService.analyzeMusic(description);
      
      toast({
        title: "Analysis Complete",
        description: "Music analysis generated successfully",
        variant: "success",
        duration: 3000,
      });
      
      return analysis;
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze music",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const remixMusic = useCallback(async (description: string) => {
    setIsGenerating(true);
    try {
      const remixIdeas = await musicService.remixMusic(description);
      
      toast({
        title: "Remix Ideas Generated",
        description: "Creative remix suggestions are ready",
        variant: "success",
        duration: 3000,
      });
      
      return remixIdeas;
    } catch (error: any) {
      toast({
        title: "Remix Failed",
        description: error.message || "Failed to generate remix ideas",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const deleteTrack = useCallback((trackId: string) => {
    setTracks(prev => prev.filter(t => t.id !== trackId));
    if (currentTrack?.id === trackId) {
      setCurrentTrack(null);
    }
    
    toast({
      title: "Track Deleted",
      description: "Track removed from your library",
      variant: "default",
      duration: 2000,
    });
  }, [currentTrack]);

  const selectTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
  }, []);

  return {
    isGenerating,
    tracks,
    currentTrack,
    generateMusic,
    analyzeMusic,
    remixMusic,
    deleteTrack,
    selectTrack,
  };
};
