import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Music, Wand2, BarChart3, Repeat, Trash2, Play } from 'lucide-react';
import { useMusicGeneration } from '@/hooks/useMusicGeneration';
import { MusicTrack } from '@/services/music/musicGenerationService';

const GENRES = ['Electronic', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 'Ambient', 'Pop', 'Indie', 'Lo-fi'];
const MOODS = ['Energetic', 'Calm', 'Dark', 'Happy', 'Melancholic', 'Epic', 'Chill', 'Intense'];

export const MusicGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('30');
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [analysisText, setAnalysisText] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [remixResult, setRemixResult] = useState('');

  const {
    isGenerating,
    tracks,
    currentTrack,
    generateMusic,
    analyzeMusic,
    remixMusic,
    deleteTrack,
    selectTrack,
  } = useMusicGeneration();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    await generateMusic({
      prompt,
      duration: parseInt(duration),
      genre,
      mood,
      action: 'generate'
    });
  };

  const handleAnalyze = async () => {
    if (!analysisText.trim()) return;
    const result = await analyzeMusic(analysisText);
    setAnalysisResult(result);
  };

  const handleRemix = async (track: MusicTrack) => {
    const result = await remixMusic(track.description);
    setRemixResult(result);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Generation Panel */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Music Studio
            </CardTitle>
            <CardDescription>
              AI-powered music generation and composition tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="generate" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="generate">Generate</TabsTrigger>
                <TabsTrigger value="analyze">Analyze</TabsTrigger>
                <TabsTrigger value="remix">Remix</TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Music Description</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe the music you want to create... (e.g., 'upbeat electronic track with synthesizers and a catchy melody')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="10"
                      max="300"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Select value={genre} onValueChange={setGenre}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENRES.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mood">Mood</Label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOODS.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Music
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="analyze" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="analysis">Music to Analyze</Label>
                  <Textarea
                    id="analysis"
                    placeholder="Paste music description or composition details..."
                    value={analysisText}
                    onChange={(e) => setAnalysisText(e.target.value)}
                    rows={6}
                  />
                </div>

                <Button 
                  onClick={handleAnalyze} 
                  disabled={isGenerating || !analysisText.trim()}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analyze Music
                    </>
                  )}
                </Button>

                {analysisResult && (
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Analysis Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{analysisResult}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="remix" className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Select a track from your library to generate remix ideas
                </div>

                {currentTrack ? (
                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-sm">{currentTrack.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {currentTrack.description.substring(0, 200)}...
                      </p>
                      
                      <Button 
                        onClick={() => handleRemix(currentTrack)} 
                        disabled={isGenerating}
                        className="w-full"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating Ideas...
                          </>
                        ) : (
                          <>
                            <Repeat className="w-4 h-4 mr-2" />
                            Generate Remix Ideas
                          </>
                        )}
                      </Button>

                      {remixResult && (
                        <div className="p-4 bg-background rounded-lg border">
                          <h4 className="font-semibold text-sm mb-2">Remix Suggestions</h4>
                          <p className="text-sm whitespace-pre-wrap">{remixResult}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No track selected. Generate or select a track from your library.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Current Track Display */}
        {currentTrack && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Composition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{currentTrack.title}</h3>
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary">{currentTrack.genre}</Badge>
                  <Badge variant="secondary">{currentTrack.mood}</Badge>
                  <Badge variant="outline">{currentTrack.duration}s</Badge>
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{currentTrack.description}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Preview (Coming Soon)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deleteTrack(currentTrack.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Track Library Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Track Library</CardTitle>
            <CardDescription>
              {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-3">
                {tracks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No tracks yet. Generate your first composition!
                  </p>
                ) : (
                  tracks.map((track) => (
                    <Card
                      key={track.id}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        currentTrack?.id === track.id ? 'border-primary bg-muted/30' : ''
                      }`}
                      onClick={() => selectTrack(track)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm line-clamp-1">{track.title}</h4>
                          <div className="flex gap-1 flex-wrap">
                            <Badge variant="secondary" className="text-xs">{track.genre}</Badge>
                            <Badge variant="outline" className="text-xs">{track.duration}s</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {track.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
