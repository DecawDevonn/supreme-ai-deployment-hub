import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

const LiveEventsSection = () => {
  return (
    <section className="py-16 pb-24">
      <h2 className="text-4xl font-bold mb-8">Upcoming Live Events</h2>
      <Card className="overflow-hidden border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 h-64 md:h-auto flex items-center justify-center relative">
            <Badge className="absolute top-4 left-4 bg-red-600 hover:bg-red-600">
              Live
            </Badge>
            <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center">
              <Calendar className="w-16 h-16 text-white" />
            </div>
          </div>
          <CardContent className="p-8 flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-4">Live Q&A: AI in Creative Writing</h3>
            <p className="text-xl text-muted-foreground">March 15, 2024 at 7:00 PM</p>
          </CardContent>
        </div>
      </Card>
    </section>
  );
};

export default LiveEventsSection;
