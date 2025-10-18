import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import Container from '@/components/Container';
import heroImage from '@/assets/devonn-tv-hero.jpg';

const DevonnTVHero = () => {
  return (
    <div className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Devonn.TV Hero" 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays for Netflix-style fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>
      
      {/* Content */}
      <Container className="relative h-full flex items-center">
        <div className="max-w-2xl pt-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
            Welcome to<br />Devonn.TV
          </h1>
          <p className="text-lg md:text-xl mb-8 drop-shadow-lg">
            Explore our videos and courses on AI, digital content creation, and more.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="text-lg px-8 py-6 gap-2">
              <Play className="w-5 h-5 fill-current" />
              Start Watching
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-background/20 backdrop-blur-sm hover:bg-background/40 border-muted">
              Learn More
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DevonnTVHero;
