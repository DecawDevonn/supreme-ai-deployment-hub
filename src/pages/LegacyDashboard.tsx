import React, { useState, useEffect } from 'react';
import Container from '@/components/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, Save, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { legacyWorkflowService, LegacyWorkflow } from '@/services/legacyWorkflowService';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const LegacyDashboard: React.FC = () => {
  const [workflows, setWorkflows] = useState<LegacyWorkflow[]>([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState<LegacyWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTags, setEditingTags] = useState<{ [key: number]: string }>({});
  const [editingNotes, setEditingNotes] = useState<{ [key: number]: string }>({});
  
  // New workflow form
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    category: '',
    path: '',
    tags: '',
    notes: '',
  });

  const loadWorkflows = async () => {
    setIsLoading(true);
    try {
      const data = await legacyWorkflowService.getAll();
      setWorkflows(data);
      setFilteredWorkflows(data);
    } catch (error) {
      console.error('Error loading workflows:', error);
      toast.error('Failed to load legacy workflows');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();

    // Set up real-time subscription
    const channel = supabase
      .channel('legacy-workflows-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'legacy_workflows'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          // Reload workflows on any change
          loadWorkflows();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredWorkflows(workflows);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = workflows.filter(
      (wf) =>
        wf.name.toLowerCase().includes(query) ||
        wf.category?.toLowerCase().includes(query) ||
        wf.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        wf.notes?.toLowerCase().includes(query)
    );
    setFilteredWorkflows(filtered);
  }, [searchQuery, workflows]);

  const handleCreateWorkflow = async () => {
    if (!newWorkflow.name.trim()) {
      toast.error('Workflow name is required');
      return;
    }

    try {
      await legacyWorkflowService.create({
        name: newWorkflow.name,
        category: newWorkflow.category || undefined,
        path: newWorkflow.path || undefined,
        tags: newWorkflow.tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t),
        notes: newWorkflow.notes || undefined,
      });

      toast.success('Workflow created successfully');
      setIsDialogOpen(false);
      setNewWorkflow({ name: '', category: '', path: '', tags: '', notes: '' });
      loadWorkflows();
    } catch (error) {
      console.error('Error creating workflow:', error);
      toast.error('Failed to create workflow');
    }
  };

  const handleUpdateTags = async (id: number, tagsString: string) => {
    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    try {
      await legacyWorkflowService.updateTags(id, tags);
      toast.success('Tags updated');
      loadWorkflows();
    } catch (error) {
      console.error('Error updating tags:', error);
      toast.error('Failed to update tags');
    }
  };

  const handleUpdateNotes = async (id: number, notes: string) => {
    try {
      await legacyWorkflowService.updateNotes(id, notes);
      toast.success('Notes updated');
      loadWorkflows();
    } catch (error) {
      console.error('Error updating notes:', error);
      toast.error('Failed to update notes');
    }
  };

  const handleDeleteWorkflow = async (id: number) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      await legacyWorkflowService.delete(id);
      toast.success('Workflow deleted');
      loadWorkflows();
    } catch (error) {
      console.error('Error deleting workflow:', error);
      toast.error('Failed to delete workflow');
    }
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Legacy Workflows</h1>
              <p className="text-muted-foreground">
                Manage and annotate your legacy workflow metadata
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={loadWorkflows}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Workflow
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Legacy Workflow</DialogTitle>
                    <DialogDescription>
                      Add a new workflow to your legacy registry
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={newWorkflow.name}
                        onChange={(e) =>
                          setNewWorkflow({ ...newWorkflow, name: e.target.value })
                        }
                        placeholder="Workflow name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newWorkflow.category}
                        onChange={(e) =>
                          setNewWorkflow({ ...newWorkflow, category: e.target.value })
                        }
                        placeholder="deployment, ai-agent, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="path">Path</Label>
                      <Input
                        id="path"
                        value={newWorkflow.path}
                        onChange={(e) =>
                          setNewWorkflow({ ...newWorkflow, path: e.target.value })
                        }
                        placeholder="/workflows/legacy/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={newWorkflow.tags}
                        onChange={(e) =>
                          setNewWorkflow({ ...newWorkflow, tags: e.target.value })
                        }
                        placeholder="terraform, aws, production"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newWorkflow.notes}
                        onChange={(e) =>
                          setNewWorkflow({ ...newWorkflow, notes: e.target.value })
                        }
                        placeholder="Additional information..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateWorkflow}>Create Workflow</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workflows by name, category, tags, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Workflows Grid */}
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading workflows...
            </div>
          ) : filteredWorkflows.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? 'No workflows found matching your search'
                  : 'No legacy workflows yet. Add your first workflow to get started.'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Workflow
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredWorkflows.map((wf) => (
                <Card key={wf.workflow_id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{wf.name}</CardTitle>
                        {wf.category && (
                          <Badge variant="secondary" className="mt-1">
                            {wf.category}
                          </Badge>
                        )}
                        {wf.path && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Path: {wf.path}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteWorkflow(wf.workflow_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Tags */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Tags</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Add tags (comma-separated)"
                          defaultValue={wf.tags?.join(', ')}
                          onChange={(e) =>
                            setEditingTags({
                              ...editingTags,
                              [wf.workflow_id]: e.target.value,
                            })
                          }
                          className="flex-1"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            handleUpdateTags(
                              wf.workflow_id,
                              editingTags[wf.workflow_id] || wf.tags?.join(', ') || ''
                            )
                          }
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                      {wf.tags && wf.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {wf.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Notes</Label>
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Add notes..."
                          defaultValue={wf.notes || ''}
                          onChange={(e) =>
                            setEditingNotes({
                              ...editingNotes,
                              [wf.workflow_id]: e.target.value,
                            })
                          }
                          className="min-h-[100px]"
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdateNotes(
                              wf.workflow_id,
                              editingNotes[wf.workflow_id] ?? wf.notes ?? ''
                            )
                          }
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Notes
                        </Button>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      <p>ID: {wf.workflow_id}</p>
                      <p>Created: {new Date(wf.created_at).toLocaleDateString()}</p>
                      <p>Updated: {new Date(wf.updated_at).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default LegacyDashboard;
