import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";

const PlanetaryChart = () => {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!birthDate || !birthTime || !birthPlace) {
      toast({
        title: "Missing information",
        description: "Please fill in all birth details",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setInterpretation("");

    try {
      const { data, error } = await supabase.functions.invoke('astrology-chart', {
        body: { birthDate, birthTime, birthPlace }
      });

      if (error) throw error;

      setInterpretation(data.interpretation);
      toast({
        title: "Chart generated",
        description: "Your astrological chart is ready",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate chart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Planetary Chart
        </h1>
        <p className="text-muted-foreground">
          Generate your personalized astrological chart
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Birth Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Birth Date</label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Birth Time</label>
            <Input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Birth Place</label>
            <Input
              placeholder="City, Country"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Chart...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Chart
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {interpretation && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Astrological Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap">
              {interpretation}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlanetaryChart;
