import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Music as MusicIcon, Download, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Music() {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('pop');
  const [lyrics, setLyrics] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedSong, setGeneratedSong] = useState<{url: string; title: string} | null>(null);

  const generateMusic = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-music', {
        body: { prompt, genre, lyrics }
      });

      if (error) throw error;

      setGeneratedSong(data);
      toast.success('Song generated!');
    } catch (error) {
      toast.error('Failed to generate music');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-pink-950 to-black p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            AI Music Generator
          </h1>
          <p className="text-gray-400 mt-2">Suno-Level Full Song Generation with Lyrics</p>
        </div>

        <Card className="bg-black/50 border-pink-500/30">
          <CardHeader>
            <CardTitle className="text-pink-400 flex items-center gap-2">
              <MusicIcon className="w-6 h-6" />
              Create Your Song
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-white font-semibold mb-2 block">Song Description</label>
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the mood, theme, or story of your song..."
                className="bg-black/50 border-purple-500/30 text-white"
              />
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">Genre</label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-purple-500/30">
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="hip-hop">Hip Hop</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="r&b">R&B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">Lyrics (Optional)</label>
              <Textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="Write your own lyrics, or leave blank for AI-generated lyrics..."
                className="bg-black/50 border-purple-500/30 text-white min-h-32"
              />
            </div>

            <Button
              onClick={generateMusic}
              disabled={generating}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
            >
              {generating ? 'Generating...' : 'Generate Song'}
            </Button>
          </CardContent>
        </Card>

        {generatedSong && (
          <Card className="bg-black/50 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-cyan-400">Your Generated Song</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 bg-purple-950/30 rounded-lg border border-purple-500/20">
                <h3 className="text-white font-semibold text-xl mb-4">{generatedSong.title}</h3>
                <div className="flex gap-4">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download MP3
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
