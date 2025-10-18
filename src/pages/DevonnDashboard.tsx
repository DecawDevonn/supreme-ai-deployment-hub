
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import AgentBuilder from '@/components/builder/AgentBuilder';
import OpenManusEditor from '@/components/builder/OpenManusEditor';
import AgentDashboard from '@/components/dashboard/AgentDashboard';
import SkillParser from '@/components/skills/SkillParser';
import ChatUI from '@/components/chat/ChatUI';
import MarketplaceView from '@/components/marketplace/MarketplaceView';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

const DevonnDashboard = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'dashboard');

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="py-8">
      <Container>
        <SectionHeading
          tag="Beta"
          centered
          className="mb-8"
          subheading="Build, deploy, and manage AI agents with OpenManus"
        >
          Devonn.AI Dashboard
        </SectionHeading>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="inline-flex w-full max-w-5xl mx-auto overflow-x-auto md:grid md:grid-cols-6 gap-1 p-1">
            <TabsTrigger value="dashboard" className="whitespace-nowrap flex-shrink-0">Dashboard</TabsTrigger>
            <TabsTrigger value="builder" className="whitespace-nowrap flex-shrink-0">Agent Builder</TabsTrigger>
            <TabsTrigger value="yaml" className="whitespace-nowrap flex-shrink-0">OpenManus Editor</TabsTrigger>
            <TabsTrigger value="skills" className="whitespace-nowrap flex-shrink-0">Skill Parser</TabsTrigger>
            <TabsTrigger value="marketplace" className="whitespace-nowrap flex-shrink-0">Marketplace</TabsTrigger>
            <TabsTrigger value="chat" className="whitespace-nowrap flex-shrink-0">Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            <AgentDashboard />
          </TabsContent>
          
          <TabsContent value="builder" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <AgentBuilder />
            </div>
          </TabsContent>
          
          <TabsContent value="yaml" className="mt-6">
            <div className="max-w-3xl mx-auto">
              <OpenManusEditor />
            </div>
          </TabsContent>
          
          <TabsContent value="skills" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <SkillParser />
            </div>
          </TabsContent>
          
          <TabsContent value="marketplace" className="mt-6">
            <MarketplaceView />
          </TabsContent>
          
          <TabsContent value="chat" className="mt-6">
            <div className="max-w-3xl mx-auto">
              <ChatUI />
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default DevonnDashboard;
