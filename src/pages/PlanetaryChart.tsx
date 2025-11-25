import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Moon, Sun, Star } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const PlanetaryChart = () => {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [chartType, setChartType] = useState('natal');
  const [interpretation, setInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!birthDate || !birthTime || !birthPlace) {
      toast.error('Please fill in all birth information');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('astrology-chart', {
        body: { birthDate, birthTime, birthPlace, chartType }
      });

      if (error) throw error;
      setInterpretation(data.interpretation);
      toast.success('Chart generated successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate chart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          Planetary Chart
        </h1>
        <p className="text-muted-foreground">
          AI-powered astrological readings and natal chart interpretations
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-purple-500" />
            <h2 className="text-2xl font-semibold">Birth Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="birthTime">Birth Time</Label>
              <Input
                id="birthTime"
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="birthPlace">Birth Place</Label>
              <Input
                id="birthPlace"
                placeholder="City, Country"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="chartType">Chart Type</Label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natal">Natal Chart</SelectItem>
                  <SelectItem value="transit">Current Transits</SelectItem>
                  <SelectItem value="solar-return">Solar Return</SelectItem>
                  <SelectItem value="synastry">Compatibility</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isLoading ? 'Generating...' : 'Generate Chart'}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-5 h-5 text-blue-500" />
            <h2 className="text-2xl font-semibold">Interpretation</h2>
          </div>

          {interpretation ? (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
              {interpretation}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <Sun className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Enter your birth information and generate your chart to see the interpretation</p>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-4 mt-6 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
        <p className="text-sm text-purple-800 dark:text-purple-200">
          <strong>Note:</strong> Astrological interpretations are for entertainment and self-reflection purposes. 
          This AI generates insights based on traditional astrological principles.
        </p>
      </Card>
    </div>
  );
};

export default PlanetaryChart;
