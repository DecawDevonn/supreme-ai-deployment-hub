import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { PlayCircle, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import videoAIThumb from '@/assets/video-ai-thumb.jpg';
import videoContentThumb from '@/assets/video-content-thumb.jpg';
import videoLearningThumb from '@/assets/video-learning-thumb.jpg';

const placeholderThumbs = [videoAIThumb, videoContentThumb, videoLearningThumb];

const RecommendedSection = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (!error && data) {
        setVideos(data);
      }
    };

    fetchVideos();
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-6 px-4 md:px-0">Recommended for You</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {videos.map((video, index) => (
          <Card
            key={video.id}
            onClick={() => navigate(`/devonn-tv/video/${video.id}`)}
            className="group overflow-hidden cursor-pointer border-0 bg-transparent transition-all duration-300 hover:scale-105"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video rounded-md overflow-hidden mb-3">
              {video.thumbnail_url ? (
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <img 
                    src={placeholderThumbs[index % 3]} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/20" />
                </>
              )}
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/40 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center">
                  <Play className="w-6 h-6 fill-current" />
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-background/90 px-2 py-0.5 rounded text-xs font-semibold">
                {formatDuration(video.duration)}
              </div>
            </div>

            {/* Info */}
            <div className="px-1">
              <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                {video.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {video.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default RecommendedSection;
