import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Code2, Server, Shield, Database, Workflow, Network, BarChart3 } from 'lucide-react';

const stepsData = [
  {
    step: 1,
    title: "Install & Configure",
    description: "Set up CLI tools for Kubernetes, Helm, and Istio in minutes",
    icon: <Code2 className="w-6 h-6" />
  },
  {
    step: 2,
    title: "Deploy Services",
    description: "Launch service mesh, API gateway, and observability stack",
    icon: <Server className="w-6 h-6" />
  },
  {
    step: 3,
    title: "Secure & Scale",
    description: "Configure mTLS, authentication, and auto-scaling policies",
    icon: <Shield className="w-6 h-6" />
  },
  {
    step: 4,
    title: "Deploy AI Models",
    description: "Launch your AI services with built-in monitoring",
    icon: <Database className="w-6 h-6" />
  }
];

const componentsData = [
  {
    title: "Service Mesh",
    description: "Istio-powered traffic management with mTLS and authorization",
    icon: <Network className="w-8 h-8" />,
    color: "from-blue-500/20 to-indigo-600/20",
    features: ["Service Discovery", "Circuit Breaking", "Fault Injection", "Traffic Shifting"]
  },
  {
    title: "API Gateway",
    description: "Kong-based API management with rate limiting and auth plugins",
    icon: <Workflow className="w-8 h-8" />,
    color: "from-green-500/20 to-emerald-600/20",
    features: ["Rate Limiting", "Authentication", "Logging & Analytics", "Transformation"]
  },
  {
    title: "Observability",
    description: "Prometheus, Grafana, and Jaeger for complete visibility",
    icon: <BarChart3 className="w-8 h-8" />,
    color: "from-amber-500/20 to-orange-600/20",
    features: ["Real-time Metrics", "Distributed Tracing", "Log Aggregation", "Dashboards"]
  },
];

const GettingStartedAndComponents: React.FC = () => {
  return (
    <section id="getting-started" className="py-20 bg-gradient-to-b from-background via-secondary/10 to-background">
      <Container maxWidth="2xl">
        {/* Getting Started Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading 
            centered 
            tag="Quick Start"
            subheading="Deploy production-ready AI infrastructure in four simple steps"
          >
            Getting Started
          </SectionHeading>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepsData.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="relative"
              >
                <Card className="h-full border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg">
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                    {item.step}
                  </div>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                      {item.icon}
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Components Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-24"
        >
          <SectionHeading 
            centered 
            tag="Architecture"
            subheading="Enterprise-grade components designed for scalability and reliability"
          >
            Core Components
          </SectionHeading>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {componentsData.map((component, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full overflow-hidden border-2 hover:border-primary/50 transition-all">
                  <div className={`h-2 bg-gradient-to-r ${component.color.replace('/20', '')}`} />
                  
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${component.color} flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform`}>
                      {component.icon}
                    </div>
                    <CardTitle className="text-xl">{component.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-6">{component.description}</p>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-foreground">Key Features</h4>
                      <ul className="space-y-2">
                        {component.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default GettingStartedAndComponents;
