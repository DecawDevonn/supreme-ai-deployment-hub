import React, { useState } from 'react';
import Container from '@/components/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RemoveDuplicatesNode from '@/components/workflow/nodes/RemoveDuplicatesNode';
import { removeDuplicatesService } from '@/services/workflow/nodes/removeDuplicatesService';
import { RemoveDuplicatesConfig, DEFAULT_REMOVE_DUPLICATES_CONFIG } from '@/types/nodes/removeDuplicates';
import { toast } from 'sonner';
import { Play, FileJson, Trash2, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

const SAMPLE_DATA = [
  { id: 1, email: 'john@example.com', name: 'John Doe', timestamp: '2025-01-01T10:00:00Z' },
  { id: 2, email: 'jane@example.com', name: 'Jane Smith', timestamp: '2025-01-02T10:00:00Z' },
  { id: 3, email: 'john@example.com', name: 'John Doe', timestamp: '2025-01-03T10:00:00Z' },
  { id: 4, email: 'bob@example.com', name: 'Bob Johnson', timestamp: '2025-01-04T10:00:00Z' },
  { id: 5, email: 'jane@example.com', name: 'Jane Smith', timestamp: '2025-01-05T10:00:00Z' },
];

const RemoveDuplicatesDemo: React.FC = () => {
  const [config, setConfig] = useState<RemoveDuplicatesConfig>(DEFAULT_REMOVE_DUPLICATES_CONFIG);
  const [inputData, setInputData] = useState(JSON.stringify(SAMPLE_DATA, null, 2));
  const [result, setResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    try {
      setIsProcessing(true);
      const data = JSON.parse(inputData);
      
      const processResult = await removeDuplicatesService.removeDuplicates(data, config);
      setResult(processResult);
      
      toast.success('Deduplication completed', {
        description: `${processResult.statistics.duplicates_removed} duplicates removed`
      });
    } catch (error) {
      toast.error('Failed to process data', {
        description: error instanceof Error ? error.message : 'Invalid input data'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setInputData(JSON.stringify(SAMPLE_DATA, null, 2));
    setResult(null);
    setConfig(DEFAULT_REMOVE_DUPLICATES_CONFIG);
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(JSON.stringify(result?.unique_items, null, 2));
    toast.success('Result copied to clipboard');
  };

  return (
    <div className="min-h-screen">
      <Container maxWidth="2xl" className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Remove Duplicates Node</h1>
            <p className="text-lg text-muted-foreground">
              Test and configure the Remove Duplicates node for your Neo Workflow
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <div className="space-y-6">
              <RemoveDuplicatesNode config={config} onChange={setConfig} />
              
              {/* Input Data */}
              <Card>
                <CardHeader>
                  <CardTitle>Input Data</CardTitle>
                  <CardDescription>
                    Paste your JSON data or use the sample data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    rows={12}
                    className="font-mono text-sm"
                    placeholder="Paste JSON array here..."
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleProcess} 
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isProcessing ? 'Processing...' : 'Process Data'}
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {result && (
                <>
                  {/* Statistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Total Items</p>
                          <p className="text-2xl font-bold">{result.statistics.total_items}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Unique Items</p>
                          <p className="text-2xl font-bold text-green-600">
                            {result.statistics.unique_items}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Duplicates Removed</p>
                          <p className="text-2xl font-bold text-red-600">
                            {result.statistics.duplicates_removed}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Processing Time</p>
                          <p className="text-2xl font-bold">
                            {result.statistics.processing_time_ms}ms
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Results Tabs */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Results</CardTitle>
                        <Button variant="outline" size="sm" onClick={handleCopyResult}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="unique">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="unique">
                            Unique Items
                            <Badge variant="secondary" className="ml-2">
                              {result.unique_items.length}
                            </Badge>
                          </TabsTrigger>
                          <TabsTrigger value="duplicates" disabled={!result.duplicates}>
                            Duplicates
                            <Badge variant="secondary" className="ml-2">
                              {result.duplicates?.length || 0}
                            </Badge>
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="unique" className="mt-4">
                          <div className="rounded-lg bg-muted p-4 max-h-96 overflow-auto">
                            <pre className="text-xs">
                              {JSON.stringify(result.unique_items, null, 2)}
                            </pre>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="duplicates" className="mt-4">
                          {result.duplicates ? (
                            <div className="rounded-lg bg-muted p-4 max-h-96 overflow-auto">
                              <pre className="text-xs">
                                {JSON.stringify(result.duplicates, null, 2)}
                              </pre>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">
                              Enable "Output Duplicates" in the configuration to see removed items
                            </p>
                          )}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </>
              )}

              {!result && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileJson className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Configure the node and process data to see results
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Use Cases */}
          <Card>
            <CardHeader>
              <CardTitle>Common Use Cases</CardTitle>
              <CardDescription>
                Example configurations for different scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 space-y-2">
                  <h4 className="font-semibold">Customer Data Cleaning</h4>
                  <p className="text-sm text-muted-foreground">
                    Remove duplicates by email and phone with fuzzy matching
                  </p>
                  <Badge variant="outline">specific_fields</Badge>
                </Card>
                
                <Card className="p-4 space-y-2">
                  <h4 className="font-semibold">Product Catalog</h4>
                  <p className="text-sm text-muted-foreground">
                    Deduplicate using custom SKU-vendor combination
                  </p>
                  <Badge variant="outline">custom_function</Badge>
                </Card>
                
                <Card className="p-4 space-y-2">
                  <h4 className="font-semibold">Multi-Source Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Keep latest records from multiple data sources
                  </p>
                  <Badge variant="outline">newest</Badge>
                </Card>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default RemoveDuplicatesDemo;
