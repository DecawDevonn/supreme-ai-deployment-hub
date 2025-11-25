import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, Activity, DollarSign, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Backtesting = () => {
  const [strategy, setStrategy] = useState('');
  const [symbol, setSymbol] = useState('SPY');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [initialCapital, setInitialCapital] = useState('10000');
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBacktest = async () => {
    if (!strategy.trim()) {
      toast.error('Please describe your trading strategy');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('backtest-strategy', {
        body: { strategy, symbol, startDate, endDate, initialCapital: parseFloat(initialCapital) }
      });

      if (error) throw error;
      setResults(data);
      toast.success('Backtest complete');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to run backtest');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Strategy Backtesting
        </h1>
        <p className="text-muted-foreground">
          Test trading strategies with AI-powered historical analysis
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Strategy Setup
          </h2>

          <div>
            <Label htmlFor="strategy">Trading Strategy</Label>
            <Textarea
              id="strategy"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              placeholder="Describe your strategy (e.g., 'Buy when RSI < 30, sell when RSI > 70')"
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="SPY, AAPL, BTC..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="capital">Initial Capital ($)</Label>
            <Input
              id="capital"
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleBacktest}
            disabled={isLoading}
            className="w-full"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {isLoading ? 'Running...' : 'Run Backtest'}
          </Button>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {results ? (
            <>
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Total Return</span>
                  </div>
                  <p className="text-2xl font-bold">{results.metrics?.totalReturn?.toFixed(2)}%</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                  </div>
                  <p className="text-2xl font-bold">{results.metrics?.sharpeRatio?.toFixed(2)}</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-muted-foreground">Win Rate</span>
                  </div>
                  <p className="text-2xl font-bold">{results.metrics?.winRate?.toFixed(1)}%</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">Max Drawdown</span>
                  </div>
                  <p className="text-2xl font-bold">{results.metrics?.maxDrawdown?.toFixed(2)}%</p>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Equity Curve</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results.equityCurve}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Analysis</h3>
                <p className="text-sm whitespace-pre-wrap">{results.analysis}</p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Trade History</h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {results.trades?.map((trade: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded">
                      <div>
                        <span className="font-medium">{trade.type.toUpperCase()}</span>
                        <span className="text-sm text-muted-foreground ml-2">{trade.date}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">${trade.price} × {trade.quantity}</div>
                        <div className={`text-sm ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.profit >= 0 ? '+' : ''}{trade.profit?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">Configure your strategy and run a backtest to see results</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Backtesting;
