import React from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import CaseStudies from '@/components/index/CaseStudies';
import IntegrationPartners from '@/components/index/IntegrationPartners';
import Testimonials from '@/components/index/Testimonials';

const Showcase = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col"
    >
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Success Stories & Partners
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how leading organizations are leveraging DEVONN.AI to transform their infrastructure
            </p>
          </motion.div>
        </div>
      </section>

      <CaseStudies />
      <IntegrationPartners />
      <Testimonials />
      
      <Footer />
    </motion.div>
  );
};

export default Showcase;
