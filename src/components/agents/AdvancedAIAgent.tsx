import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic, 
  Music, 
  Image as ImageIcon, 
  Video, 
  Bot, 
  Code, 
  Sparkles,
  Upload,
  Download,
  Loader2,
  Play,
  FileText
} from 'lucide-react';
import { AdvancedAIService } from '@/services/agent/advancedAIService';
import { toast } from 'sonner';

const AdvancedAIAgent = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Voice Generation
  const [voiceText, setVoiceText] = useState('');
  const [voiceSpeakers, setVoiceSpeakers] = useState(1);
  const [voiceEmotion, setVoiceEmotion] = useState('');

  // Model Inference
  const [inferencePrompt, setInferencePrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('grok-2.5');

  // Music Generation
  const [musicPrompt, setMusicPrompt] = useState('');
  const [musicGenre, setMusicGenre] = useState('');
  const [withVocals, setWithVocals] = useState(false);

  // Image Editing
  const [imageUrl, setImageUrl] = useState('');
  const [editInstruction, setEditInstruction] = useState('');

  // Video Generation
  const [productImage, setProductImage] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');

  // Avatar Generation
  const [avatarImage, setAvatarImage] = useState('');
  const [avatarAudio, setAvatarAudio] = useState('');

  const handleVoiceGeneration = async (provider: 'vibe' | 'elevenlabs') => {
    if (!voiceText) {
      toast.error('Please enter text to generate voice');
      return;
    }

    setLoading(true);
    try {
      let response;
      if (provider === 'vibe') {
        response = await AdvancedAIService.generateVoiceWithVibe({
          text: voiceText,
          speakers: voiceSpeakers,
          duration: 90
        });
      } else {
        response = await AdvancedAIService.generateVoiceWithElevenLabs({
          text: voiceText,
          emotion: voiceEmotion as any,
          language: 'en'
        });
      }
      setResult(response);
      toast.success(`Voice generated with ${provider === 'vibe' ? 'Microsoft Vibe' : 'ElevenLabs V3'}`);
    } catch (error) {
      console.error('Voice generation error:', error);
      toast.error('Failed to generate voice');
    } finally {
      setLoading(false);
    }
  };

  const handleModelInference = async () => {
    if (!inferencePrompt) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const response = selectedModel === 'grok-2.5'
        ? await AdvancedAIService.inferenceWithGrok({ prompt: inferencePrompt, useCache: true })
        : await AdvancedAIService.inferenceWithCommandR({ prompt: inferencePrompt, ragEnabled: true });
      
      setResult(response);
      toast.success('Inference complete');
    } catch (error) {
      console.error('Inference error:', error);
      toast.error('Failed to run inference');
    } finally {
      setLoading(false);
    }
  };

  const handleMusicGeneration = async (type: 'text' | 'video') => {
    setLoading(true);
    try {
      const response = type === 'text'
        ? await AdvancedAIService.generateMusic({
            prompt: musicPrompt,
            genre: musicGenre,
            withVocals,
            duration: 180
          })
        : await AdvancedAIService.generateVideoToMusic(musicPrompt);
      
      setResult(response);
      toast.success('Music generated successfully');
    } catch (error) {
      console.error('Music generation error:', error);
      toast.error('Failed to generate music');
    } finally {
      setLoading(false);
    }
  };

  const handleImageEdit = async () => {
    if (!imageUrl || !editInstruction) {
      toast.error('Please provide image URL and edit instruction');
      return;
    }

    setLoading(true);
    try {
      const response = await AdvancedAIService.editImageWithQwen({
        imageUrl,
        instruction: editInstruction,
        preserveStyle: true
      });
      setResult(response);
      toast.success('Image edited successfully');
    } catch (error) {
      console.error('Image edit error:', error);
      toast.error('Failed to edit image');
    } finally {
      setLoading(false);
    }
  };

  const handleProductVideo = async () => {
    if (!productImage || !sceneDescription) {
      toast.error('Please provide product image and scene description');
      return;
    }

    setLoading(true);
    try {
      const response = await AdvancedAIService.generateProductVideo({
        productImage,
        sceneDescription,
        duration: 30
      });
      setResult(response);
      toast.success('Product video generated');
    } catch (error) {
      console.error('Video generation error:', error);
      toast.error('Failed to generate video');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarGeneration = async () => {
    if (!avatarImage || !avatarAudio) {
      toast.error('Please provide image and audio URLs');
      return;
    }

    setLoading(true);
    try {
      const response = await AdvancedAIService.generateTalkingAvatar({
        imageUrl: avatarImage,
        audioUrl: avatarAudio,
        lipSyncAccuracy: 'cinematic'
      });
      setResult(response);
      toast.success('Talking avatar generated');
    } catch (error) {
      console.error('Avatar generation error:', error);
      toast.error('Failed to generate avatar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="h-8 w-8" />
            Advanced AI Agent
          </h1>
          <p className="text-muted-foreground">
            Cutting-edge AI capabilities: voice synthesis, multimodal models, video/avatar generation, and more
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          All-in-One AI Suite
        </Badge>
      </div>

      <Tabs defaultValue="voice" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="voice">
            <Mic className="h-4 w-4 mr-2" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="models">
            <Bot className="h-4 w-4 mr-2" />
            Models
          </TabsTrigger>
          <TabsTrigger value="music">
            <Music className="h-4 w-4 mr-2" />
            Music
          </TabsTrigger>
          <TabsTrigger value="image">
            <ImageIcon className="h-4 w-4 mr-2" />
            Image
          </TabsTrigger>
          <TabsTrigger value="video">
            <Video className="h-4 w-4 mr-2" />
            Video
          </TabsTrigger>
          <TabsTrigger value="dev">
            <Code className="h-4 w-4 mr-2" />
            Dev Tools
          </TabsTrigger>
        </TabsList>

        {/* Voice Technology */}
        <TabsContent value="voice" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Microsoft Vibe Voice 1.5B</CardTitle>
                <CardDescription>
                  1.5B parameter TTS model for expressive long-form audio (up to 90 minutes)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Text to Speak</Label>
                  <Textarea
                    placeholder="Enter text for voice generation..."
                    value={voiceText}
                    onChange={(e) => setVoiceText(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Number of Speakers (1-4)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={4}
                    value={voiceSpeakers}
                    onChange={(e) => setVoiceSpeakers(parseInt(e.target.value))}
                  />
                </div>
                <Button
                  onClick={() => handleVoiceGeneration('vibe')}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                  Generate with Vibe Voice
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ElevenLabs V3 Alpha</CardTitle>
                <CardDescription>
                  Advanced TTS with emotional control, 70+ languages, dialogue mode
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Text to Speak</Label>
                  <Textarea
                    placeholder="Enter text for voice generation..."
                    value={voiceText}
                    onChange={(e) => setVoiceText(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Emotion</Label>
                  <Select value={voiceEmotion} onValueChange={setVoiceEmotion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select emotion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whisper">Whisper</SelectItem>
                      <SelectItem value="laugh">Laugh</SelectItem>
                      <SelectItem value="sigh">Sigh</SelectItem>
                      <SelectItem value="scream">Scream</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => handleVoiceGeneration('elevenlabs')}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                  Generate with ElevenLabs V3
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Major Models */}
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Language Models</CardTitle>
              <CardDescription>
                Grok 2.5 (xAI) and Command R+ (Cohere) for complex reasoning tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grok-2.5">Grok 2.5 (with prompt caching)</SelectItem>
                    <SelectItem value="command-r">Command R+ (104B params, 128k context)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prompt</Label>
                <Textarea
                  placeholder="Enter your prompt..."
                  value={inferencePrompt}
                  onChange={(e) => setInferencePrompt(e.target.value)}
                  rows={6}
                />
              </div>
              <Button
                onClick={handleModelInference}
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Bot className="h-4 w-4 mr-2" />}
                Run Inference
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Music Generation */}
        <TabsContent value="music" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Eleven Music</CardTitle>
                <CardDescription>
                  Generate studio-quality music from text prompts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Music Prompt</Label>
                  <Textarea
                    placeholder="Describe the music you want to create..."
                    value={musicPrompt}
                    onChange={(e) => setMusicPrompt(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Genre</Label>
                  <Input
                    placeholder="e.g., rock, jazz, electronic"
                    value={musicGenre}
                    onChange={(e) => setMusicGenre(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="vocals"
                    checked={withVocals}
                    onChange={(e) => setWithVocals(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="vocals">Include Vocals</Label>
                </div>
                <Button
                  onClick={() => handleMusicGeneration('text')}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Music className="h-4 w-4 mr-2" />}
                  Generate Music
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Video-to-Music Flow</CardTitle>
                <CardDescription>
                  Generate contextually appropriate music for videos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Video URL</Label>
                  <Input
                    placeholder="https://example.com/video.mp4"
                    value={musicPrompt}
                    onChange={(e) => setMusicPrompt(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => handleMusicGeneration('video')}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  Generate from Video
                </Button>
                <p className="text-xs text-muted-foreground">
                  AI analyzes motion, pacing, and colors to compose fitting soundtrack
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Image Editing */}
        <TabsContent value="image" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Qwen Image Edit</CardTitle>
              <CardDescription>
                Leading open-source image editing with semantic and appearance-based control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Edit Instruction</Label>
                <Textarea
                  placeholder="Describe how to edit the image (add, remove, modify elements or text)..."
                  value={editInstruction}
                  onChange={(e) => setEditInstruction(e.target.value)}
                  rows={4}
                />
              </div>
              <Button
                onClick={handleImageEdit}
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ImageIcon className="h-4 w-4 mr-2" />}
                Edit Image
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video & Avatar */}
        <TabsContent value="video" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Product-to-Video</CardTitle>
                <CardDescription>
                  Higgsfield AI: Drag & drop products into cinematic scenes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Product Image URL</Label>
                  <Input
                    placeholder="https://example.com/product.jpg"
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Scene Description</Label>
                  <Textarea
                    placeholder="Describe the scene and visual cues..."
                    value={sceneDescription}
                    onChange={(e) => setSceneDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleProductVideo}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Video className="h-4 w-4 mr-2" />}
                  Generate Product Video
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Talking Avatar (A3 / Van 2.2)</CardTitle>
                <CardDescription>
                  Audio-driven avatars with cinematic lip-sync and gestures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    placeholder="https://example.com/person.jpg"
                    value={avatarImage}
                    onChange={(e) => setAvatarImage(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Audio URL</Label>
                  <Input
                    placeholder="https://example.com/audio.mp3"
                    value={avatarAudio}
                    onChange={(e) => setAvatarAudio(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleAvatarGeneration}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                  Generate Talking Avatar
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Developer Tools */}
        <TabsContent value="dev" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Grok Prompt Caching</CardTitle>
                <CardDescription>
                  50% discount on cached tokens for repetitive workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Automatically enabled for Grok 2.5 inference. Reuses computations for identical prompt prefixes.
                </p>
                <Badge variant="outline">Active for all Grok requests</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Context Window Analysis</CardTitle>
                <CardDescription>
                  Visualize and optimize token usage (Claude Code inspired)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Breakdown of token consumption across different components to identify inefficiencies.
                </p>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Analyze Context
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Result Display */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedAIAgent;
