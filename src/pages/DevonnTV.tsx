import React from 'react';
import Container from '@/components/Container';
import DevonnTVHero from '@/components/devonn-tv/DevonnTVHero';
import CategoriesSection from '@/components/devonn-tv/CategoriesSection';
import RecommendedSection from '@/components/devonn-tv/RecommendedSection';
import LiveEventsSection from '@/components/devonn-tv/LiveEventsSection';

const DevonnTV = () => {
  return (
    <div className="min-h-screen bg-background">
      <DevonnTVHero />
      <Container>
        <CategoriesSection />
        <RecommendedSection />
        <LiveEventsSection />
      </Container>
    </div>
  );
};

export default DevonnTV;
