import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Play, CheckCircle, Code, Database, Cloud, Cpu, Zap } from 'lucide-react';
import { toast } from 'sonner';

const Sandbox = () => {
  const handleDownload = () => {
    toast.success('Sandbox download started!');
    // In production, this would trigger actual download
    window.open('/sandbox', '_blank');
  };

  const services = [
    {
      icon: <Database className="w-8 h-8 text-primary" />,
      name: "PostgreSQL",
      description: "Primary database with sample data and schema"
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      name: "Redis",
      description: "Caching and job queue management"
    },
    {
      icon: <Cloud className="w-8 h-8 text-primary" />,
      name: "MinIO",
      description: "S3-compatible object storage"
    },
    {
      icon: <Cpu className="w-8 h-8 text-primary" />,
      name: "Mock AI Services",
      description: "Simulated OpenAI, ElevenLabs, Stable Diffusion"
    },
    {
      icon: <Code className="w-8 h-8 text-primary" />,
      name: "FastAPI Backend",
      description: "RESTful API with Celery workers"
    }
  ];

  const steps = [
    "Extract the sandbox ZIP file",
    "Navigate to sandbox directory",
    "Run 'docker-compose up --build'",
    "Access services at localhost"
  ];

  const features = [
    "Complete local development environment",
    "No external API keys required",
    "Mock AI services for testing",
    "Pre-configured database with sample data",
    "Background job processing with Celery",
    "Nginx reverse proxy included",
    "End-to-end encryption enabled",
    "Production-ready architecture"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Devonn.AI Sandbox
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Complete local development environment with Docker Compose. Test and develop with mock AI services, database, storage, and background processing.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleDownload} size="lg" className="gap-2">
              <Download className="w-5 h-5" />
              Download Sandbox
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Play className="w-5 h-5" />
              View Documentation
            </Button>
          </div>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Included Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-4">{service.icon}</div>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Quick Start</CardTitle>
              <CardDescription>Get up and running in minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-muted rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="text-lg">{step}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-secondary/20 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Command</h3>
                <code className="block bg-background p-4 rounded font-mono text-sm">
                  cd sandbox && docker-compose up --build
                </code>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="flex items-center gap-3 p-4 bg-card rounded-lg border"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Access URLs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Service Access</CardTitle>
              <CardDescription>URLs after starting the sandbox</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-bold mb-2">Frontend/API</p>
                  <code className="text-sm">http://localhost</code>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-bold mb-2">API Docs</p>
                  <code className="text-sm">http://localhost:8000/docs</code>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-bold mb-2">MinIO Console</p>
                  <code className="text-sm">http://localhost:9001</code>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-bold mb-2">PostgreSQL</p>
                  <code className="text-sm">localhost:5432</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 p-6 bg-destructive/10 border border-destructive/20 rounded-lg"
        >
          <h3 className="text-xl font-bold mb-2 text-destructive">⚠️ Development Only</h3>
          <p className="text-muted-foreground">
            This sandbox is for development and testing purposes only. For production deployments,
            follow the security guidelines in SECURITY_CHECKLIST.md and use proper secrets management.
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Sandbox;
