import React from 'react';
import { Button } from '@/components/ui/button';
import Container from '@/components/Container';

const DevonnTVHero = () => {
  return (
    <div className="relative bg-gradient-to-r from-background to-muted py-24 md:py-32">
      <Container>
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to<br />Devonn.TV
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Explore our videos and courses on AI, digital content creation, and more.
          </p>
          <Button size="lg" className="text-lg px-8 py-6">
            Start Your Free Trial
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default DevonnTVHero;
