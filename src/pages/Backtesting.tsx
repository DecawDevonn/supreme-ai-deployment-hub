import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

export default function Backtesting() {
  const [symbol, setSymbol] = useState('AAPL');
  const [strategy, setStrategy] = useState('moving-average');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-blue-950 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
            Strategy Backtester
          </h1>
          <p className="text-gray-400 mt-2">Test Trading Strategies with Historical Data</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-black/50 border-green-500/30">
            <CardContent className="p-6">
              <label className="text-white font-semibold mb-2 block">Symbol</label>
              <Input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="AAPL"
                className="bg-black/50 border-green-500/30 text-white"
              />
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-blue-500/30">
            <CardContent className="p-6">
              <label className="text-white font-semibold mb-2 block">Strategy</label>
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger className="bg-black/50 border-blue-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-blue-500/30">
                  <SelectItem value="moving-average">Moving Average Crossover</SelectItem>
                  <SelectItem value="rsi">RSI Oscillator</SelectItem>
                  <SelectItem value="macd">MACD</SelectItem>
                  <SelectItem value="bollinger">Bollinger Bands</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-purple-500/30">
            <CardContent className="p-6">
              <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500">
                Run Backtest
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/50 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-green-950/30 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-semibold">Total Return</span>
                </div>
                <p className="text-3xl font-bold text-white">+45.2%</p>
              </div>
              <div className="p-6 bg-blue-950/30 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">Win Rate</span>
                </div>
                <p className="text-3xl font-bold text-white">67.8%</p>
              </div>
              <div className="p-6 bg-purple-950/30 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">Sharpe Ratio</span>
                </div>
                <p className="text-3xl font-bold text-white">1.85</p>
              </div>
            </div>

            <div className="mt-8 h-64 bg-black/30 rounded-lg border border-cyan-500/20 flex items-center justify-center">
              <p className="text-gray-400">Performance chart will display here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
