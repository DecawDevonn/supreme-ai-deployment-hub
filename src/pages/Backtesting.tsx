import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Loader2 } from "lucide-react";

const Backtesting = () => {
  const [strategy, setStrategy] = useState("");
  const [symbol, setSymbol] = useState("BTC/USD");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [initialCapital, setInitialCapital] = useState("10000");
  const [results, setResults] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBacktest = async () => {
    if (!strategy || !startDate || !endDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResults("");

    try {
      const { data, error } = await supabase.functions.invoke('backtest-strategy', {
        body: { strategy, symbol, startDate, endDate, initialCapital }
      });

      if (error) throw error;

      setResults(data.results);
      toast({
        title: "Backtest complete",
        description: "Your strategy results are ready",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to run backtest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Backtesting
        </h1>
        <p className="text-muted-foreground">
          Test your trading strategies with AI-powered backtesting
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Strategy Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Trading Strategy</label>
            <Textarea
              placeholder="Describe your trading strategy (e.g., Buy when RSI < 30, sell when RSI > 70)"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Symbol</label>
              <Input
                placeholder="BTC/USD"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Capital ($)</label>
              <Input
                type="number"
                placeholder="10000"
                value={initialCapital}
                onChange={(e) => setInitialCapital(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleBacktest}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Backtest...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Run Backtest
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Backtest Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap">
              {results}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Backtesting;
