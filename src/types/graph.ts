export type AgentRole = 'Orchestrator' | 'Analyst' | 'Communicator' | 'Integrator' | 'Evaluator';

export interface GraphAgent {
  id: string;
  role: AgentRole;
  confidence: number;
  description?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;
  condition: string;
}

export interface WorkflowGraph {
  graph_id: string;
  workflow_id: string;
  agents: GraphAgent[];
  edges: GraphEdge[];
  entry: string;
  metadata: {
    category: string;
    generated_at: string;
    model: string;
    density: number;
  };
}

export interface AgentRoleConfig {
  role: AgentRole;
  description: string;
  color: string;
  icon: string;
}

export const AGENT_ROLES: Record<AgentRole, AgentRoleConfig> = {
  Orchestrator: {
    role: 'Orchestrator',
    description: 'Decision logic - reads context, selects downstream agents',
    color: '#8b5cf6',
    icon: '🧠'
  },
  Analyst: {
    role: 'Analyst',
    description: 'Data interpreter - performs reasoning, analysis, summaries',
    color: '#3b82f6',
    icon: '📋'
  },
  Communicator: {
    role: 'Communicator',
    description: 'Language & UX - formats human-readable responses',
    color: '#10b981',
    icon: '💬'
  },
  Integrator: {
    role: 'Integrator',
    description: 'API & I/O - pushes outputs to external services',
    color: '#f59e0b',
    icon: '⚙️'
  },
  Evaluator: {
    role: 'Evaluator',
    description: 'Quality control - validates AI output before publishing',
    color: '#ef4444',
    icon: '🧮'
  }
};
