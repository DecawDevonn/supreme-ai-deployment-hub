import { WorkflowGraph, AgentRole, GraphAgent, GraphEdge } from '@/types/graph';
import { logger } from '@/lib/logger';

/**
 * Service for generating multi-agent graph representations of workflows
 */
export class GraphGeneratorService {
  private readonly availableAgents: AgentRole[] = [
    'Orchestrator',
    'Analyst',
    'Communicator',
    'Integrator',
    'Evaluator'
  ];

  /**
   * Generate a workflow graph based on workflow characteristics
   */
  generateGraph(
    workflowId: string,
    category: string,
    nodeCount: number,
    model: string = 'google/gemini-2.5-flash'
  ): WorkflowGraph {
    logger.info('Generating workflow graph', { workflowId, category, nodeCount });

    // Select agents based on category and complexity
    const agentCount = Math.min(Math.max(3, Math.floor(nodeCount / 2)), 5);
    const selectedAgents = this.selectAgentsForCategory(category, agentCount);

    // Create agents with confidence scores
    const agents: GraphAgent[] = selectedAgents.map(role => ({
      id: role,
      role,
      confidence: this.calculateConfidence(role, category)
    }));

    // Create edges between agents
    const edges: GraphEdge[] = this.generateEdges(agents);

    // Calculate graph density
    const maxEdges = agents.length * (agents.length - 1);
    const density = maxEdges > 0 ? edges.length / maxEdges : 0;

    const graph: WorkflowGraph = {
      graph_id: `graph_${workflowId}`,
      workflow_id: workflowId,
      agents,
      edges,
      entry: agents[0].id,
      metadata: {
        category,
        generated_at: new Date().toISOString(),
        model,
        density: Math.round(density * 100) / 100
      }
    };

    logger.info('Workflow graph generated', {
      graph_id: graph.graph_id,
      agent_count: agents.length,
      edge_count: edges.length,
      density
    });

    return graph;
  }

  /**
   * Select appropriate agents based on workflow category
   */
  private selectAgentsForCategory(category: string, count: number): AgentRole[] {
    const categoryLower = category.toLowerCase();
    
    // Always include Orchestrator as the entry point
    const selected: AgentRole[] = ['Orchestrator'];

    // Category-specific agent preferences
    if (categoryLower.includes('customer') || categoryLower.includes('support')) {
      selected.push('Communicator', 'Analyst');
    } else if (categoryLower.includes('data') || categoryLower.includes('analytics')) {
      selected.push('Analyst', 'Evaluator');
    } else if (categoryLower.includes('deployment') || categoryLower.includes('automation')) {
      selected.push('Integrator', 'Evaluator');
    } else if (categoryLower.includes('notification') || categoryLower.includes('communication')) {
      selected.push('Communicator', 'Integrator');
    } else {
      // Default selection for other categories
      selected.push('Analyst', 'Integrator');
    }

    // Add remaining agents if needed
    const remaining = this.availableAgents.filter(a => !selected.includes(a));
    while (selected.length < count && remaining.length > 0) {
      const randomIndex = Math.floor(Math.random() * remaining.length);
      selected.push(remaining.splice(randomIndex, 1)[0]);
    }

    return selected.slice(0, count);
  }

  /**
   * Generate edges between agents with weights and conditions
   */
  private generateEdges(agents: GraphAgent[]): GraphEdge[] {
    const edges: GraphEdge[] = [];

    // Create a linear flow with some branching
    for (let i = 0; i < agents.length - 1; i++) {
      edges.push({
        from: agents[i].id,
        to: agents[i + 1].id,
        weight: this.randomWeight(),
        condition: 'always'
      });

      // Add some conditional branches for complexity
      if (i < agents.length - 2 && Math.random() > 0.6) {
        edges.push({
          from: agents[i].id,
          to: agents[i + 2].id,
          weight: this.randomWeight(),
          condition: 'on_error'
        });
      }
    }

    return edges;
  }

  /**
   * Calculate confidence score for an agent in a given category
   */
  private calculateConfidence(role: AgentRole, category: string): number {
    const base = 0.7 + Math.random() * 0.25;
    
    const categoryLower = category.toLowerCase();
    
    // Boost confidence for role-category matches
    if (role === 'Communicator' && categoryLower.includes('customer')) {
      return Math.min(base + 0.1, 1.0);
    }
    if (role === 'Analyst' && categoryLower.includes('analytics')) {
      return Math.min(base + 0.1, 1.0);
    }
    if (role === 'Integrator' && categoryLower.includes('deployment')) {
      return Math.min(base + 0.1, 1.0);
    }

    return Math.round(base * 100) / 100;
  }

  /**
   * Generate a random edge weight
   */
  private randomWeight(): number {
    return Math.round((0.5 + Math.random() * 0.5) * 100) / 100;
  }
}

export const graphGeneratorService = new GraphGeneratorService();
