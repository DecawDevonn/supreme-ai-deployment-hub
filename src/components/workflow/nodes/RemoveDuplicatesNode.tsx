import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  RemoveDuplicatesConfig, 
  DEFAULT_REMOVE_DUPLICATES_CONFIG,
  DeduplicationLevel,
  CompareMethod,
  KeepStrategy
} from '@/types/nodes/removeDuplicates';
import { Filter, Settings2, Zap, BarChart3 } from 'lucide-react';

interface RemoveDuplicatesNodeProps {
  config: RemoveDuplicatesConfig;
  onChange: (config: RemoveDuplicatesConfig) => void;
}

const RemoveDuplicatesNode: React.FC<RemoveDuplicatesNodeProps> = ({ 
  config = DEFAULT_REMOVE_DUPLICATES_CONFIG, 
  onChange 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateConfig = (updates: Partial<RemoveDuplicatesConfig>) => {
    onChange({ ...config, ...updates });
  };

  const updateSmartDetection = (updates: Partial<RemoveDuplicatesConfig['smart_detection']>) => {
    onChange({
      ...config,
      smart_detection: {
        ...config.smart_detection!,
        ...updates
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <CardTitle>Remove Duplicates</CardTitle>
        </div>
        <CardDescription>
          Remove duplicate items from your dataset based on specified criteria
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Settings */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deduplication-level">Deduplication Level</Label>
            <Select
              value={config.deduplication_level}
              onValueChange={(value) => updateConfig({ deduplication_level: value as DeduplicationLevel })}
            >
              <SelectTrigger id="deduplication-level" className="bg-background z-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="execution">Execution Level</SelectItem>
                <SelectItem value="input">Input Level</SelectItem>
                <SelectItem value="workflow">Workflow Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="compare-method">Compare By</Label>
            <Select
              value={config.compare_method}
              onValueChange={(value) => updateConfig({ compare_method: value as CompareMethod })}
            >
              <SelectTrigger id="compare-method" className="bg-background z-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all_fields">All Fields</SelectItem>
                <SelectItem value="specific_fields">Specific Fields</SelectItem>
                <SelectItem value="hash">Content Hash</SelectItem>
                <SelectItem value="custom_function">Custom Function</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {config.compare_method === 'specific_fields' && (
            <div className="space-y-2">
              <Label htmlFor="fields">Fields to Compare</Label>
              <Input
                id="fields"
                placeholder="email, phone, user_id (comma-separated)"
                value={config.fields?.join(', ') || ''}
                onChange={(e) => updateConfig({ 
                  fields: e.target.value.split(',').map(f => f.trim()).filter(Boolean) 
                })}
              />
              <p className="text-xs text-muted-foreground">
                Enter field names separated by commas. Supports dot notation for nested fields.
              </p>
            </div>
          )}

          {config.compare_method === 'custom_function' && (
            <div className="space-y-2">
              <Label htmlFor="custom-function">Custom Function</Label>
              <Textarea
                id="custom-function"
                placeholder="(item) => `${item.sku}-${item.vendor_id}`"
                value={config.custom_function || ''}
                onChange={(e) => updateConfig({ custom_function: e.target.value })}
                rows={3}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                JavaScript function that returns a unique key for each item
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="keep-strategy">Keep Strategy</Label>
            <Select
              value={config.keep}
              onValueChange={(value) => updateConfig({ keep: value as KeepStrategy })}
            >
              <SelectTrigger id="keep-strategy" className="bg-background z-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="first">First Occurrence</SelectItem>
                <SelectItem value="last">Last Occurrence</SelectItem>
                <SelectItem value="newest">Newest Timestamp</SelectItem>
                <SelectItem value="oldest">Oldest Timestamp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Smart Detection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h4 className="font-semibold">Smart Detection</h4>
            <Badge variant="secondary" className="ml-auto">AI-Powered</Badge>
          </div>

          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="fuzzy-matching">Fuzzy Matching</Label>
                <p className="text-xs text-muted-foreground">
                  Use similarity threshold for text comparison
                </p>
              </div>
              <Switch
                id="fuzzy-matching"
                checked={config.smart_detection?.fuzzy_matching}
                onCheckedChange={(checked) => updateSmartDetection({ fuzzy_matching: checked })}
              />
            </div>

            {config.smart_detection?.fuzzy_matching && (
              <div className="space-y-2">
                <Label htmlFor="similarity-threshold">
                  Similarity Threshold: {(config.smart_detection?.similarity_threshold * 100).toFixed(0)}%
                </Label>
                <Input
                  id="similarity-threshold"
                  type="range"
                  min="0"
                  max="100"
                  value={config.smart_detection?.similarity_threshold * 100}
                  onChange={(e) => updateSmartDetection({ 
                    similarity_threshold: parseInt(e.target.value) / 100 
                  })}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="ignore-case">Ignore Case</Label>
              <Switch
                id="ignore-case"
                checked={config.smart_detection?.ignore_case}
                onCheckedChange={(checked) => updateSmartDetection({ ignore_case: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="normalize-whitespace">Normalize Whitespace</Label>
              <Switch
                id="normalize-whitespace"
                checked={config.smart_detection?.normalize_whitespace}
                onCheckedChange={(checked) => updateSmartDetection({ normalize_whitespace: checked })}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Output Options */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h4 className="font-semibold">Output Options</h4>
          </div>

          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="output-duplicates">Output Duplicates</Label>
                <p className="text-xs text-muted-foreground">
                  Send removed duplicates to a separate output
                </p>
              </div>
              <Switch
                id="output-duplicates"
                checked={config.output_duplicates}
                onCheckedChange={(checked) => updateConfig({ output_duplicates: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="statistics">Include Statistics</Label>
                <p className="text-xs text-muted-foreground">
                  Add deduplication metrics to output
                </p>
              </div>
              <Switch
                id="statistics"
                checked={config.statistics}
                onCheckedChange={(checked) => updateConfig({ statistics: checked })}
              />
            </div>
          </div>
        </div>

        {/* Advanced Settings Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full"
        >
          <Settings2 className="h-4 w-4 mr-2" />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
        </Button>

        {showAdvanced && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold">Performance</h4>
              
              <div className="space-y-2 pl-6">
                <Label htmlFor="batch-size">Batch Size</Label>
                <Input
                  id="batch-size"
                  type="number"
                  min="100"
                  max="10000"
                  value={config.batch_size}
                  onChange={(e) => updateConfig({ batch_size: parseInt(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  Number of items to process in each batch
                </p>
              </div>

              <div className="flex items-center justify-between pl-6">
                <div className="space-y-0.5">
                  <Label htmlFor="stream-processing">Stream Processing</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable for memory-efficient large dataset processing
                  </p>
                </div>
                <Switch
                  id="stream-processing"
                  checked={config.stream_processing}
                  onCheckedChange={(checked) => updateConfig({ stream_processing: checked })}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RemoveDuplicatesNode;
