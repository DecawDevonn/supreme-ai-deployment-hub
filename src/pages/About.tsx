import React from 'react';
import { Helmet } from 'react-helmet';
import Container from '@/components/Container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MatrixRain } from '@/components/ui/matrix-rain';
import { 
  Workflow, 
  Network, 
  Brain, 
  MessageSquare, 
  Shield, 
  BarChart3,
  Sparkles,
  Building2,
  Users,
  Rocket
} from 'lucide-react';

const About: React.FC = () => {
  const navigate = useNavigate();

  const timeline = [
    { year: '2020', event: 'Devonn.ai established in Dubai' },
    { year: '2021', event: 'Foundation of knowledge graph and agentic systems' },
    { year: '2022', event: 'Expanded with multi-cloud support & automation engines' },
    { year: '2023', event: 'Introduced modular integrations (n8n, APIs, marketplaces)' },
    { year: '2024+', event: 'Evolution into global-scale adaptive AI ecosystems' }
  ];

  const capabilities = [
    {
      icon: Workflow,
      title: 'Workflow Manager',
      description: 'Automation + DAG execution for seamless operations'
    },
    {
      icon: Network,
      title: 'API Integrations',
      description: 'External service connectors and unified data flow'
    },
    {
      icon: Brain,
      title: 'Knowledge Graph Layer',
      description: 'Contextual reasoning + blind-spot detection'
    },
    {
      icon: MessageSquare,
      title: 'Copilot Chat',
      description: 'Interactive agents with parallel intelligence'
    },
    {
      icon: Shield,
      title: 'Security & Analytics',
      description: 'Enterprise-grade protection and insights'
    },
    {
      icon: Sparkles,
      title: 'Creative Studio',
      description: 'Video, audio, AR/VR, content generation'
    }
  ];

  const visionKeywords = ['Knowledge', 'Creativity', 'Automation', 'Connection', 'Expansion'];

  return (
    <>
      <Helmet>
        <title>About DEVONN.AI - Intelligence Beyond Boundaries</title>
        <meta name="description" content="Founded by Wesley Little in Dubai, est. 2020. Merging intelligence, automation, and creativity into a single adaptive AI ecosystem." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <MatrixRain className="absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        
        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
              Intelligence Beyond Boundaries
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              Founded by <span className="text-primary font-semibold">Wesley Little</span> in collaboration with{' '}
              <span className="text-primary font-semibold">Wesship8 & Arising Atlantis</span>
            </p>
            <p className="text-lg text-muted-foreground mb-8">Est. 2020, Dubai</p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/documentation')}>
                Explore Capabilities
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
                Join the Journey
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-muted/30">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Mission & Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Devonn.ai was built to merge intelligence, automation, and creativity into a single adaptive system — 
                an AI ecosystem designed to empower individuals, businesses, and the future of digital interaction.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              {visionKeywords.map((keyword, i) => (
                <motion.div
                  key={keyword}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="px-6 py-3 bg-primary/10 border border-primary/30 rounded-full text-primary font-semibold"
                >
                  {keyword}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground">From inception to innovation</p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50" />
                  {i !== timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-gradient-to-b from-primary to-primary/20 mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <span className="text-2xl font-bold text-primary">{item.year}</span>
                  <p className="text-lg text-muted-foreground mt-2">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="py-24 bg-muted/30">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Capabilities</h2>
            <p className="text-lg text-muted-foreground">Modular systems built for the future</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full transition-all hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 group">
                  <CardContent className="p-6">
                    <capability.icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold mb-2">{capability.title}</h3>
                    <p className="text-muted-foreground">{capability.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Dubai */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10" />
        <Container className="relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Building2 className="h-16 w-16 text-primary mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Dubai?</h2>
              <ul className="space-y-4 text-lg text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary">✓</span>
                  <span>Global innovation hub at the crossroads of East & West</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">✓</span>
                  <span>Emerging AI regulatory and business ecosystem</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">✓</span>
                  <span>Strategic location advantage for worldwide reach</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-64 md:h-96 rounded-lg overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c"
                alt="Dubai skyline"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Ownership & Collaboration */}
      <section className="py-24 bg-muted/30">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Users className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Founder's Vision</h2>
            <blockquote className="text-xl text-muted-foreground italic leading-relaxed mb-6">
              "As the creator of Devonn.ai, I envisioned a system that doesn't just answer questions but grows with you, 
              adapts to your workflow, and integrates with your world."
            </blockquote>
            <p className="text-lg font-semibold text-primary">— Wesley Little, Founder</p>
          </motion.div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="py-24 relative overflow-hidden">
        <MatrixRain className="absolute inset-0 opacity-10" />
        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Rocket className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Devonn.ai is not just a tool — it's an evolving intelligence
            </h2>
            <p className="text-xl text-muted-foreground mb-8">Let's build the future together</p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/auth')}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/documentation#integrations')}>
                View Integrations
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                Contact Us
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  );
};

export default About;
