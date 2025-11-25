import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon, Sun, Star, Sparkles } from 'lucide-react';

const planets = [
  { name: 'Sun', symbol: '☉', color: 'yellow', element: 'Fire', day: 'Sunday' },
  { name: 'Moon', symbol: '☽', color: 'silver', element: 'Water', day: 'Monday' },
  { name: 'Mars', symbol: '♂', color: 'red', element: 'Fire', day: 'Tuesday' },
  { name: 'Mercury', symbol: '☿', color: 'orange', element: 'Air', day: 'Wednesday' },
  { name: 'Jupiter', symbol: '♃', color: 'blue', element: 'Fire', day: 'Thursday' },
  { name: 'Venus', symbol: '♀', color: 'green', element: 'Earth', day: 'Friday' },
  { name: 'Saturn', symbol: '♄', color: 'black', element: 'Earth', day: 'Saturday' }
];

const correspondences = {
  colors: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'],
  metals: ['Gold', 'Silver', 'Iron', 'Mercury', 'Tin', 'Copper', 'Lead'],
  herbs: ['Chamomile', 'Jasmine', 'Basil', 'Lavender', 'Sage', 'Rose', 'Myrrh'],
  crystals: ['Citrine', 'Moonstone', 'Carnelian', 'Amethyst', 'Lapis', 'Emerald', 'Onyx']
};

export default function PlanetaryChart() {
  const [selectedPlanet, setSelectedPlanet] = useState(planets[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400">
            Planetary Correspondence Master Chart
          </h1>
          <p className="text-gray-400 mt-2">24-Layer System with Ritual Integrations</p>
        </div>

        <div className="grid md:grid-cols-7 gap-4">
          {planets.map((planet) => (
            <Card
              key={planet.name}
              className={`cursor-pointer transition-all ${
                selectedPlanet.name === planet.name
                  ? 'bg-purple-500/20 border-purple-400 scale-105'
                  : 'bg-black/50 border-gray-700 hover:border-purple-500/50'
              }`}
              onClick={() => setSelectedPlanet(planet)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">{planet.symbol}</div>
                <p className="text-white font-semibold">{planet.name}</p>
                <p className="text-gray-400 text-sm">{planet.day}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-black/50 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Star className="w-6 h-6" />
              {selectedPlanet.name} Correspondences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-purple-950/30">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="ritual">Ritual</TabsTrigger>
                <TabsTrigger value="timing">Timing</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-950/20 rounded-lg border border-purple-500/20">
                    <p className="text-gray-400 text-sm">Element</p>
                    <p className="text-white font-semibold text-lg">{selectedPlanet.element}</p>
                  </div>
                  <div className="p-4 bg-purple-950/20 rounded-lg border border-purple-500/20">
                    <p className="text-gray-400 text-sm">Day of Week</p>
                    <p className="text-white font-semibold text-lg">{selectedPlanet.day}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="materials" className="space-y-4 mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Metals & Minerals
                    </h3>
                    <ul className="space-y-2">
                      {correspondences.metals.map((metal, i) => (
                        <li key={i} className="text-gray-300 p-2 bg-purple-950/20 rounded">{metal}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Herbs & Plants
                    </h3>
                    <ul className="space-y-2">
                      {correspondences.herbs.map((herb, i) => (
                        <li key={i} className="text-gray-300 p-2 bg-purple-950/20 rounded">{herb}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ritual" className="space-y-4 mt-6">
                <Card className="bg-purple-950/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-purple-400">Ritual Template</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-gray-300">
                    <p>• Set up altar facing the appropriate direction</p>
                    <p>• Light {selectedPlanet.color} candle</p>
                    <p>• Invoke planetary energy during {selectedPlanet.day}</p>
                    <p>• Use corresponding incense and crystals</p>
                    <p>• State intention clearly three times</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timing" className="space-y-4 mt-6">
                <div className="p-6 bg-purple-950/20 rounded-lg border border-purple-500/20">
                  <h3 className="text-cyan-400 font-semibold mb-4 flex items-center gap-2">
                    <Sun className="w-5 h-5" />
                    Optimal Timing
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li>• <strong className="text-white">Day:</strong> {selectedPlanet.day}</li>
                    <li>• <strong className="text-white">Hour:</strong> Planetary hour of {selectedPlanet.name}</li>
                    <li>• <strong className="text-white">Moon Phase:</strong> Waxing for growth, Waning for banishing</li>
                    <li>• <strong className="text-white">Season:</strong> Align with natural cycles</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
