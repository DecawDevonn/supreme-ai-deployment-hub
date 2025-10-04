
import { Shield, Zap, Cpu, Server, Database, Activity } from 'lucide-react';
import { Enhancement } from './EnhancementCard';

export const enhancementData: Enhancement[] = [
  {
    id: 'security',
    featureName: 'security',
    title: 'Advanced Security Module',
    description: 'Enhanced security features including advanced encryption, authentication, and role-based access control.',
    icon: Shield,
    tag: 'Security',
    status: 'Recommended'
  },
  {
    id: 'performance',
    featureName: 'performance',
    title: 'Performance Accelerator',
    description: 'Optimization toolkit for enhancing throughput and reducing latency in high-demand environments.',
    icon: Zap,
    tag: 'Performance',
    status: 'Optional'
  },
  {
    id: 'gpu',
    featureName: 'gpu',
    title: 'GPU Acceleration',
    description: 'Seamless integration with GPU resources for faster model training and inference.',
    icon: Cpu,
    tag: 'Hardware',
    status: 'Optional'
  },
  {
    id: 'scaling',
    featureName: 'scaling',
    title: 'Auto-Scaling System',
    description: 'Intelligent resource management that scales based on demand patterns and workload analysis.',
    icon: Server,
    tag: 'Infrastructure',
    status: 'Recommended'
  },
  {
    id: 'integration',
    featureName: 'integration',
    title: 'Enterprise Integration Hub',
    description: 'Connect with existing enterprise systems through pre-built connectors and customizable APIs.',
    icon: Database,
    tag: 'Integration',
    status: 'Optional'
  },
  {
    id: 'analytics',
    featureName: 'analytics',
    title: 'Advanced Analytics',
    description: 'Comprehensive analytics dashboard for monitoring performance, usage patterns, and system health.',
    icon: Activity,
    tag: 'Analytics',
    status: 'Optional'
  }
];
