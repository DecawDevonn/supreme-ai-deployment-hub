import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Video, Mic, FileText, Loader2 } from "lucide-react";

const TV = () => {
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const { toast } = useToast();

  const handleGenerate = async (type: string) => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setContent("");

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { type, topic, details }
      });

      if (error) throw error;

      setContent(data.content);
      toast({
        title: "Content generated",
        description: "Your content is ready",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
          TV Content Studio
        </h1>
        <p className="text-muted-foreground">
          AI-powered content creation for videos, podcasts, and articles
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="video">
            <Video className="w-4 h-4 mr-2" />
            Video Script
          </TabsTrigger>
          <TabsTrigger value="podcast">
            <Mic className="w-4 h-4 mr-2" />
            Podcast Episode
          </TabsTrigger>
          <TabsTrigger value="article">
            <FileText className="w-4 h-4 mr-2" />
            Article
          </TabsTrigger>
        </TabsList>

        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle>Generate Video Script</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic</label>
                <Input
                  placeholder="What's your video about?"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Details</label>
                <Textarea
                  placeholder="Any specific requirements or points to cover?"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <Button
                onClick={() => handleGenerate('video-script')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Script'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="podcast">
          <Card>
            <CardHeader>
              <CardTitle>Generate Podcast Episode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic</label>
                <Input
                  placeholder="What's your podcast episode about?"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Details</label>
                <Textarea
                  placeholder="Any specific format or segments?"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <Button
                onClick={() => handleGenerate('podcast')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Episode'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="article">
          <Card>
            <CardHeader>
              <CardTitle>Generate Article</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic</label>
                <Input
                  placeholder="What's your article about?"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Details</label>
                <Textarea
                  placeholder="Target audience, key points, tone?"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <Button
                onClick={() => handleGenerate('article')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Article'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {content && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap">
              {content}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TV;
