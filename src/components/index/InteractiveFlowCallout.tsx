import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Workflow } from 'lucide-react';

const InteractiveFlowCallout = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-6">
            <Workflow className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Interactive Flow Editor
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Design complex workflows visually with our powerful PocketFlow editor, based on ReactFlow technology. 
            Build sophisticated automation pipelines with an intuitive drag-and-drop interface.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/flow">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg shadow-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Try Flow Editor
              </motion.button>
            </Link>
            
            <Link to="/documentation#workflow">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg shadow-lg hover:bg-secondary/90 transition-colors font-medium"
              >
                Learn More
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveFlowCallout;
