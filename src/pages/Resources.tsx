import React from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import LatestUpdates from '@/components/index/LatestUpdates';
import ArchitectureDiagram from '@/components/index/ArchitectureDiagram';

const Resources = () => {
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
              Resources & Architecture
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our latest updates, technical architecture, and comprehensive documentation
            </p>
          </motion.div>
        </div>
      </section>

      <LatestUpdates />
      <ArchitectureDiagram />
      
      <Footer />
    </motion.div>
  );
};

export default Resources;
