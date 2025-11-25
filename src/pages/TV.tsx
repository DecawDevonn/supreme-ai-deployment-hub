import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Calendar, Tv as TvIcon } from 'lucide-react';

const categories = ['AI Mastery', 'Filmmaking', 'Business', 'Crypto', 'Personal Development'];

export default function TV() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-purple-950 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">
            Devonn.TV
          </h1>
          <p className="text-gray-400 mt-2">AI, Filmmaking & eLearning Courses</p>
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              className="border-purple-500/30 hover:bg-purple-500/20 text-white"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-black/50 border-red-500/30 hover:border-purple-500/50 transition-all group">
              <div className="aspect-video bg-gradient-to-br from-red-900/30 to-purple-900/30 rounded-t-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white/50 group-hover:text-white/80 transition-colors" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-purple-400">Course Title {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">Master advanced techniques in this comprehensive course</p>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 font-semibold">12 lessons</span>
                  <Button size="sm" className="bg-gradient-to-r from-red-600 to-purple-600">
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-black/50 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Live Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-950/30 rounded-lg border border-red-500/20 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">AI Filmmaking Workshop</h3>
                <p className="text-gray-400 text-sm">Tomorrow at 3:00 PM PST</p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700">
                <TvIcon className="w-4 h-4 mr-2" />
                Join Live
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
