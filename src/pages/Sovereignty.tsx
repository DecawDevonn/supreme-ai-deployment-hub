import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Crown, Zap, Shield, Star } from 'lucide-react';

export default function Sovereignty() {
  const [opiScore, setOpiScore] = useState(67);
  const [dimensions, setDimensions] = useState({
    ownership: 72,
    power: 65,
    intelligence: 70
  });
  
  const [cymaticPattern, setCymaticPattern] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCymaticPattern(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400">
            Sovereignty Matrix
          </h1>
          <p className="text-gray-400 mt-2">O.P.I. Scoring System + POL 90-Day Protocol</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-black/50 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Crown className="w-6 h-6" />
                O.P.I. Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400">
                  {opiScore}
                </div>
                <p className="text-gray-400 mt-2">Overall Sovereignty Index</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-cyan-400 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Ownership
                    </span>
                    <span className="text-white">{dimensions.ownership}%</span>
                  </div>
                  <Progress value={dimensions.ownership} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-purple-400 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Power
                    </span>
                    <span className="text-white">{dimensions.power}%</span>
                  </div>
                  <Progress value={dimensions.power} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-pink-400 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Intelligence
                    </span>
                    <span className="text-white">{dimensions.intelligence}%</span>
                  </div>
                  <Progress value={dimensions.intelligence} className="h-2" />
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-yellow-600 to-purple-600 hover:from-yellow-500 hover:to-purple-500">
                Begin 90-Day POL Protocol
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-cyan-400">Real-Time Cymatic Visualization</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="relative w-80 h-80">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <radialGradient id="cymaticGrad">
                      <stop offset="0%" stopColor="cyan" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="purple" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>
                  
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 45 + cymaticPattern) * (Math.PI / 180);
                    const radius = 30 + Math.sin(cymaticPattern * 0.05 + i) * 20;
                    const x = 100 + Math.cos(angle) * radius;
                    const y = 100 + Math.sin(angle) * radius;
                    
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={15 + Math.sin(cymaticPattern * 0.03 + i * 0.5) * 5}
                        fill="url(#cymaticGrad)"
                        opacity={0.6 + Math.sin(cymaticPattern * 0.02 + i) * 0.3}
                      />
                    );
                  })}
                  
                  <circle
                    cx="100"
                    cy="100"
                    r={40 + Math.sin(cymaticPattern * 0.03) * 10}
                    fill="none"
                    stroke="cyan"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-purple-400">POL 90-Day Protocol Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['Phase 1: Foundation (Days 1-30)', 'Phase 2: Integration (Days 31-60)', 'Phase 3: Sovereignty (Days 61-90)'].map((phase, i) => (
              <div key={i} className="p-4 bg-purple-950/30 rounded-lg border border-purple-500/20">
                <h3 className="text-white font-semibold">{phase}</h3>
                <p className="text-gray-400 text-sm mt-1">Track your progress through the sovereignty journey</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
