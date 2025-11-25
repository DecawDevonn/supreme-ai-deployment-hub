import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  Calendar, 
  Clock, 
  FileText, 
  Image, 
  Link, 
  Mail, 
  QrCode,
  Palette,
  Type,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tools = [
  { icon: Calculator, name: 'Calculator', description: 'Advanced calculator with history', path: '/tools/calculator' },
  { icon: Calendar, name: 'Calendar', description: 'Schedule and plan events', path: '/tools/calendar' },
  { icon: Clock, name: 'Timer', description: 'Pomodoro and countdown timers', path: '/tools/timer' },
  { icon: FileText, name: 'Text Editor', description: 'Rich text editing and formatting', path: '/tools/editor' },
  { icon: Image, name: 'Image Tools', description: 'Resize, crop, and convert images', path: '/tools/image' },
  { icon: Link, name: 'URL Shortener', description: 'Create short links', path: '/tools/url' },
  { icon: Mail, name: 'Email Validator', description: 'Validate email addresses', path: '/tools/email' },
  { icon: QrCode, name: 'QR Generator', description: 'Create QR codes instantly', path: '/tools/qr' },
  { icon: Palette, name: 'Color Picker', description: 'Pick and convert colors', path: '/tools/color' },
  { icon: Type, name: 'Case Converter', description: 'Convert text case styles', path: '/tools/case' },
  { icon: Zap, name: 'Hash Generator', description: 'Generate MD5, SHA hashes', path: '/tools/hash' },
];

const Tools = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          Utility Tools
        </h1>
        <p className="text-muted-foreground">
          Powerful productivity tools for everyday tasks
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card 
              key={tool.name}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate(tool.path)}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg opacity-50">
            <p className="font-medium">Password Generator</p>
            <p className="text-sm text-muted-foreground">Secure password creation</p>
          </div>
          <div className="p-4 border rounded-lg opacity-50">
            <p className="font-medium">JSON Formatter</p>
            <p className="text-sm text-muted-foreground">Format and validate JSON</p>
          </div>
          <div className="p-4 border rounded-lg opacity-50">
            <p className="font-medium">Base64 Encoder</p>
            <p className="text-sm text-muted-foreground">Encode/decode Base64</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Tools;
