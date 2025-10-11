import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const RecommendedSection = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
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
    <section className="py-16">
      <h2 className="text-4xl font-bold mb-8">Recommended for You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card
            key={video.id}
            onClick={() => navigate(`/devonn-tv/video/${video.id}`)}
            className="overflow-hidden cursor-pointer hover:scale-105 transition-transform border-border"
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-950 h-48 flex items-center justify-center relative">
              {video.thumbnail_url ? (
                <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
              ) : (
                <PlayCircle className="w-20 h-20 text-white/80" />
              )}
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{video.title}</h3>
              <p className="text-muted-foreground mb-3 text-sm line-clamp-2">{video.description}</p>
              <p className="text-sm text-muted-foreground">{formatDuration(video.duration)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default RecommendedSection;
