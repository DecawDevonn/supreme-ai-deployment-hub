import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Workflow, Search, Plus } from 'lucide-react';
import { useState } from 'react';

const categories = ['AI', 'Data Processing', 'Marketing', 'E-commerce', 'Social Media', 'Analytics'];

export default function Workflows() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-950 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Workflow Automation
          </h1>
          <p className="text-gray-400 mt-2">1100+ Templates with Human-in-Loop Review</p>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search workflows..."
              className="pl-10 bg-black/50 border-purple-500/30 text-white"
            />
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category} className="bg-black/50 border-blue-500/30 hover:border-cyan-500/50 transition-all">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Workflow className="w-5 h-5" />
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">150+ templates available</p>
                <Button variant="outline" className="w-full border-purple-500/30 hover:bg-purple-500/20">
                  Browse Templates
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-black/50 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-400">Active Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-center py-8">No active workflows yet. Create one to get started!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
