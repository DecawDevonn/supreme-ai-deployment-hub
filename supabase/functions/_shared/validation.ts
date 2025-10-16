// Shared validation schemas for edge functions
// Using a validation approach compatible with Deno

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Chat message validation
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function validateChatMessage(msg: any): ValidationResult<ChatMessage> {
  if (!msg || typeof msg !== 'object') {
    return { success: false, error: 'Message must be an object' };
  }
  
  if (!['user', 'assistant', 'system'].includes(msg.role)) {
    return { success: false, error: 'Invalid message role' };
  }
  
  if (typeof msg.content !== 'string' || msg.content.length === 0) {
    return { success: false, error: 'Message content must be a non-empty string' };
  }
  
  if (msg.content.length > 50000) {
    return { success: false, error: 'Message content too long (max 50000 chars)' };
  }
  
  return { success: true, data: { role: msg.role, content: msg.content } };
}

export function validateChatMessages(messages: any): ValidationResult<ChatMessage[]> {
  if (!Array.isArray(messages)) {
    return { success: false, error: 'Messages must be an array' };
  }
  
  if (messages.length === 0) {
    return { success: false, error: 'Messages array cannot be empty' };
  }
  
  if (messages.length > 100) {
    return { success: false, error: 'Too many messages (max 100)' };
  }
  
  const validatedMessages: ChatMessage[] = [];
  for (const msg of messages) {
    const result = validateChatMessage(msg);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    validatedMessages.push(result.data!);
  }
  
  return { success: true, data: validatedMessages };
}

// Workflow definition validation
export interface WorkflowNode {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: Array<{ source: string; target: string }>;
}

export function validateWorkflowDefinition(def: any): ValidationResult<WorkflowDefinition> {
  if (!def || typeof def !== 'object') {
    return { success: false, error: 'Definition must be an object' };
  }
  
  if (!Array.isArray(def.nodes)) {
    return { success: false, error: 'Definition must have a nodes array' };
  }
  
  if (def.nodes.length > 100) {
    return { success: false, error: 'Too many nodes (max 100)' };
  }
  
  for (const node of def.nodes) {
    if (!node.id || typeof node.id !== 'string' || node.id.length > 255) {
      return { success: false, error: 'Invalid node id' };
    }
    if (!node.type || typeof node.type !== 'string' || node.type.length > 255) {
      return { success: false, error: 'Invalid node type' };
    }
    if (!node.data || typeof node.data !== 'object') {
      return { success: false, error: 'Node data must be an object' };
    }
  }
  
  if (!Array.isArray(def.edges)) {
    return { success: false, error: 'Definition must have an edges array' };
  }
  
  if (def.edges.length > 200) {
    return { success: false, error: 'Too many edges (max 200)' };
  }
  
  for (const edge of def.edges) {
    if (!edge.source || typeof edge.source !== 'string') {
      return { success: false, error: 'Invalid edge source' };
    }
    if (!edge.target || typeof edge.target !== 'string') {
      return { success: false, error: 'Invalid edge target' };
    }
  }
  
  return { success: true, data: { nodes: def.nodes, edges: def.edges } };
}

// String validation helpers
export function validateString(
  value: any,
  fieldName: string,
  minLength: number = 0,
  maxLength: number = 10000
): ValidationResult<string> {
  if (typeof value !== 'string') {
    return { success: false, error: `${fieldName} must be a string` };
  }
  
  const trimmed = value.trim();
  if (trimmed.length < minLength) {
    return { success: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  
  if (trimmed.length > maxLength) {
    return { success: false, error: `${fieldName} must be at most ${maxLength} characters` };
  }
  
  return { success: true, data: trimmed };
}

// UUID validation
export function validateUUID(value: any, fieldName: string): ValidationResult<string> {
  if (typeof value !== 'string') {
    return { success: false, error: `${fieldName} must be a string` };
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(value)) {
    return { success: false, error: `${fieldName} must be a valid UUID` };
  }
  
  return { success: true, data: value };
}

// Generic object validation
export function validateObject(value: any, fieldName: string): ValidationResult<Record<string, unknown>> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { success: false, error: `${fieldName} must be an object` };
  }
  
  return { success: true, data: value };
}
