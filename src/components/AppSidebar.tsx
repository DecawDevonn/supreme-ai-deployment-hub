import { 
  Home, 
  Workflow, 
  Rocket, 
  Code2, 
  Bot, 
  MessagesSquare,
  Music,
  BookOpen,
  Settings,
  Cpu,
  FlaskConical,
  Network,
  FileCode,
  Sparkles,
  Shield,
  LayoutDashboard,
  ChevronRight,
  type LucideIcon
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { title: 'Home', url: '/', icon: Home },
      { title: 'Documentation', url: '/documentation', icon: BookOpen },
      { title: 'Cookbook', url: '/cookbook', icon: FileCode },
    ],
  },
  {
    title: 'AI & Agents',
    items: [
      { title: 'Agent Dashboard', url: '/agents', icon: Bot },
      { title: 'Devonn Dashboard', url: '/devonn', icon: Sparkles },
      { title: 'Devonn Chat', url: '/devonn-chat', icon: MessagesSquare },
      { title: 'Agent Demo', url: '/agent-demo', icon: FlaskConical },
      { title: 'Enhanced Agents', url: '/enhanced-agents', icon: Network },
      { title: 'Advanced AI', url: '/advanced-ai', icon: Cpu },
    ],
  },
  {
    title: 'Development',
    items: [
      { title: 'AI Workflow Generator', url: '/workflows?tab=ai-generator', icon: Sparkles },
      { title: 'Workflows', url: '/workflows', icon: Workflow },
      { title: 'Flow Editor', url: '/flow', icon: Code2 },
      { title: 'API Connections', url: '/api', icon: Settings },
      { title: 'Deployment', url: '/deployment', icon: Rocket },
      { title: 'Deployment Readiness', url: '/deployment-readiness', icon: Shield },
    ],
  },
  {
    title: 'Tools',
    items: [
      { title: 'Local AI', url: '/local-ai', icon: Cpu },
      { title: 'Music Studio', url: '/music-studio', icon: Music },
      { title: 'Sandbox', url: '/sandbox', icon: FlaskConical },
    ],
  },
  {
    title: 'Admin',
    items: [
      { title: 'Legacy Workflows', url: '/legacy-workflows', icon: LayoutDashboard },
      { title: 'Admin Dashboard', url: '/admin', icon: Shield },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;

  const getNavCls = (isActive: boolean) =>
    isActive 
      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
      : 'hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground';

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {navGroups.map((group) => {
          const hasActiveItem = group.items.some(item => currentPath === item.url);
          
          return (
            <Collapsible
              key={group.title}
              defaultOpen={hasActiveItem || group.title === 'Main'}
              className="group/collapsible"
            >
              <SidebarGroup>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md transition-colors">
                    {!collapsed && (
                      <>
                        {group.title}
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </>
                    )}
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => {
                        const isActive = currentPath === item.url;
                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <NavLink 
                                to={item.url} 
                                className={getNavCls(isActive)}
                                end
                              >
                                <item.icon className="h-4 w-4" />
                                {!collapsed && <span>{item.title}</span>}
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-2">
          <SidebarTrigger className="w-full" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
