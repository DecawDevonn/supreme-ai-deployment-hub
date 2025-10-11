import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Video, Code } from 'lucide-react';

const videos = [
  {
    title: 'Introduction to Machine Learning',
    description: 'Get started with machine learning and AI concepts',
    duration: '14:34',
    icon: Brain,
    color: 'from-blue-900 to-blue-950',
  },
  {
    title: 'A.I. in Film: Enhancing Visual Storytelling',
    description: 'Learn how AI Is transforming the filmmaking...',
    duration: '22:10',
    icon: Video,
    color: 'from-slate-800 to-slate-950',
  },
  {
    title: 'Advanced Python for AI',
    description: 'Master Python for advanced AI applications',
    duration: '9:45',
    icon: Code,
    color: 'from-blue-900 to-blue-950',
  },
];

const RecommendedSection = () => {
  return (
    <section className="py-16">
      <h2 className="text-4xl font-bold mb-8">Recommended for You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card
            key={video.title}
            className="overflow-hidden cursor-pointer hover:scale-105 transition-transform border-border"
          >
            <div className={`bg-gradient-to-br ${video.color} h-48 flex items-center justify-center`}>
              <video.icon className="w-20 h-20 text-white/80" />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{video.title}</h3>
              <p className="text-muted-foreground mb-3 text-sm">{video.description}</p>
              <p className="text-sm text-muted-foreground">{video.duration}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default RecommendedSection;
