import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, FileText, Shield, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Sovereignty = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: string) => {
    if (!input.trim()) {
      toast.error('Please enter your query or requirements');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('sovereignty-legal', {
        body: { action, input }
      });

      if (error) throw error;
      setResult(data.result);
      toast.success('Analysis complete');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Sovereignty Center
        </h1>
        <p className="text-muted-foreground">
          AI-powered legal assistance for individual rights and sovereignty
        </p>
      </div>

      <Tabs defaultValue="rights" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl">
          <TabsTrigger value="rights">
            <Shield className="w-4 h-4 mr-2" />
            Rights Analysis
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="advice">
            <BookOpen className="w-4 h-4 mr-2" />
            Legal Guidance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rights" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Analyze Your Rights
            </h3>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your situation or concern regarding your legal rights..."
              className="min-h-[150px] mb-4"
            />
            <Button 
              onClick={() => handleAction('analyze_rights')}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Rights'}
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Generate Legal Documents
            </h3>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Specify the document you need (e.g., 'Power of Attorney', 'Living Will', 'Privacy Notice')..."
              className="min-h-[150px] mb-4"
            />
            <Button 
              onClick={() => handleAction('generate_document')}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Generating...' : 'Generate Document'}
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="advice" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Legal Guidance
            </h3>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask any legal question about sovereignty, rights, or legal procedures..."
              className="min-h-[150px] mb-4"
            />
            <Button 
              onClick={() => handleAction('legal_advice')}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Processing...' : 'Get Guidance'}
            </Button>
          </Card>
        </TabsContent>
      </Tabs>

      {result && (
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Result</h3>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap">
            {result}
          </div>
        </Card>
      )}

      <Card className="p-4 mt-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Disclaimer:</strong> This is educational AI-generated content, not legal advice. 
          Consult with a licensed attorney for specific legal matters.
        </p>
      </Card>
    </div>
  );
};

export default Sovereignty;
