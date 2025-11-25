import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Star } from 'lucide-react';
import { useState } from 'react';

const tools = [
  { name: 'AI Content Writer', category: 'AI Agents', rating: 4.8, installs: '10K+' },
  { name: 'Workflow Optimizer', category: 'Workflows', rating: 4.9, installs: '8K+' },
  { name: 'Time Tracker Pro', category: 'Productivity', rating: 4.7, installs: '15K+' },
  { name: 'Analytics Dashboard', category: 'Analytics', rating: 4.6, installs: '12K+' },
  { name: 'Email Automator', category: 'Workflows', rating: 4.8, installs: '9K+' },
  { name: 'Voice Transcriber', category: 'AI Agents', rating: 4.9, installs: '11K+' }
];

export default function Tools() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-blue-950 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Tools Marketplace
          </h1>
          <p className="text-gray-400 mt-2">AI Agents, Workflows, Productivity & Analytics</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tools..."
            className="pl-10 bg-black/50 border-cyan-500/30 text-white"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.name} className="bg-black/50 border-cyan-500/30 hover:border-blue-500/50 transition-all">
              <CardHeader>
                <CardTitle className="text-cyan-400">{tool.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{tool.category}</span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{tool.rating}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{tool.installs} installs</p>
                <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                  <Download className="w-4 h-4 mr-2" />
                  Install
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
