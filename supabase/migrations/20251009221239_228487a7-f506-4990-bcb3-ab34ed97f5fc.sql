-- Fix: Add missing DELETE policy for workflow_runs
-- This allows users to delete their own workflow execution history
CREATE POLICY "Users can delete own workflow runs"
ON workflow_runs
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM workflows
    WHERE workflows.id = workflow_runs.workflow_id
    AND workflows.user_id = auth.uid()
  )
);