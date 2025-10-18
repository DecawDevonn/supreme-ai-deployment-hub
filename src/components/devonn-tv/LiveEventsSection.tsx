import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

const LiveEventsSection = () => {
  return (
    <section className="py-12 pb-24">
      <h2 className="text-3xl font-bold mb-6 px-4 md:px-0">Upcoming Live Events</h2>
      <Card className="relative overflow-hidden border-0 rounded-lg h-[300px] md:h-[400px]">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
        
        <div className="relative h-full grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left Side - Visual */}
          <div className="relative h-full flex items-center justify-center p-8">
            <Badge className="absolute top-6 left-6 bg-red-600 hover:bg-red-600 gap-1 px-3 py-1">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </Badge>
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/20">
              <Calendar className="w-16 h-16 md:w-20 md:h-20 text-primary" />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="p-8 flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Live Q&A: AI in Creative Writing
            </h3>
            <div className="space-y-2 text-muted-foreground">
              <p className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5" />
                March 15, 2024
              </p>
              <p className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5" />
                7:00 PM EST
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default LiveEventsSection;
