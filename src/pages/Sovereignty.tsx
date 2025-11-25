import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Scale, FileText, MessageSquare, Loader2 } from "lucide-react";

const Sovereignty = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("rights");
  const { toast } = useToast();

  const handleAnalyze = async (type: string) => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter your query",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult("");

    try {
      const { data, error } = await supabase.functions.invoke('sovereignty-legal', {
        body: { type, input }
      });

      if (error) throw error;

      setResult(data.result);
      toast({
        title: "Analysis complete",
        description: "Your legal analysis is ready",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Sovereignty
        </h1>
        <p className="text-muted-foreground">
          AI-powered legal assistance and rights analysis
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rights">
            <Scale className="w-4 h-4 mr-2" />
            Rights Analysis
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            Document Generation
          </TabsTrigger>
          <TabsTrigger value="advice">
            <MessageSquare className="w-4 h-4 mr-2" />
            Legal Guidance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rights">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Your Legal Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe your situation..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[150px]"
              />
              <Button
                onClick={() => handleAnalyze('analyze-rights')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Rights'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Generate Legal Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe the document you need..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[150px]"
              />
              <Button
                onClick={() => handleAnalyze('generate-document')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Document'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advice">
          <Card>
            <CardHeader>
              <CardTitle>Get Legal Guidance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Ask your legal question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[150px]"
              />
              <Button
                onClick={() => handleAnalyze('legal-advice')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Get Advice'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap">
              {result}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Sovereignty;
