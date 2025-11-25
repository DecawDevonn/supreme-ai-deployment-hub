import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Mic, FileText, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const TV = () => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('educational');
  const [duration, setDuration] = useState('5-10 minutes');
  const [contentType, setContentType] = useState('video');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { contentType, topic, style, duration }
      });

      if (error) throw error;
      setResult(data);
      toast.success('Content generated successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate content');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
          Content Studio
        </h1>
        <p className="text-muted-foreground">
          AI-powered video, podcast, and article generation
        </p>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="create">Create Content</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Content Configuration
              </h2>

              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Video Script
                      </div>
                    </SelectItem>
                    <SelectItem value="podcast">
                      <div className="flex items-center gap-2">
                        <Mic className="w-4 h-4" />
                        Podcast Episode
                      </div>
                    </SelectItem>
                    <SelectItem value="article">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Article
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="topic">Topic / Title</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What should this content be about?"
                />
              </div>

              <div>
                <Label htmlFor="style">Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="storytelling">Storytelling</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duration / Length</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3 minutes">Short (1-3 min)</SelectItem>
                    <SelectItem value="5-10 minutes">Medium (5-10 min)</SelectItem>
                    <SelectItem value="15-20 minutes">Long (15-20 min)</SelectItem>
                    <SelectItem value="30+ minutes">Extended (30+ min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isLoading ? 'Generating...' : 'Generate Content'}
              </Button>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              {result ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-muted rounded">
                    {contentType === 'video' && <Video className="w-5 h-5" />}
                    {contentType === 'podcast' && <Mic className="w-5 h-5" />}
                    {contentType === 'article' && <FileText className="w-5 h-5" />}
                    <div>
                      <p className="font-medium">{result.metadata.topic}</p>
                      <p className="text-sm text-muted-foreground">
                        {result.metadata.style} • {result.metadata.duration}
                      </p>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none whitespace-pre-wrap p-4 bg-muted rounded max-h-[500px] overflow-y-auto">
                    {result.content}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Edit
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Configure your content and click generate to see the preview</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="library">
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Your generated content will appear here</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TV;
