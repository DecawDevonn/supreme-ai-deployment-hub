
import React from 'react';
import { Download as DownloadIcon, Box } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DownloadSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-6 rounded-lg border bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 my-8">
      <div className="px-6">
        <h3 className="text-xl font-bold mb-2">Download & Deploy</h3>
        <p className="text-muted-foreground mb-4">Get all the components you need to build your AI deployment hub</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 px-6">
        <Card className="bg-background/80 backdrop-blur hover:bg-background transition-colors border-primary/20">
          <CardHeader className="pb-2 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Box className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Complete Sandbox</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">Docker environment with all services</p>
          </CardHeader>
          <CardFooter>
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => navigate('/sandbox')}
            >
              <Box className="mr-2 h-4 w-4" />
              Open Sandbox
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-background/80 backdrop-blur hover:bg-background transition-colors">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Backend (FastAPI)</CardTitle>
            <p className="text-xs text-muted-foreground">API server with AI integrations</p>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-background/80 backdrop-blur hover:bg-background transition-colors">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Frontend (React)</CardTitle>
            <p className="text-xs text-muted-foreground">Dashboard with deployment UI</p>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-background/80 backdrop-blur hover:bg-background transition-colors">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Config Files</CardTitle>
            <p className="text-xs text-muted-foreground">Docker & environment setup</p>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default DownloadSection;
