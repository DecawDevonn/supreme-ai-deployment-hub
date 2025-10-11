import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import WorkflowManagement from "./pages/WorkflowManagement";
import RemoveDuplicatesDemo from "./pages/RemoveDuplicatesDemo";
import DeploymentDashboard from "./pages/DeploymentDashboard";
import APIManagement from "./pages/APIManagement";
import ApiConnections from "./pages/ApiConnections";
import Documentation from "./pages/Documentation";
import DevonnDashboard from "./pages/DevonnDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AgentDashboard from "./pages/AgentDashboard";
import FlowEditor from "./pages/FlowEditor";
import AgentDemo from "./pages/AgentDemo";
import EnhancedAgentDemo from "./pages/EnhancedAgentDemo";
import AdvancedAI from "./pages/AdvancedAI";
import DeploymentReadiness from "./pages/DeploymentReadiness";
import LocalAI from "./pages/LocalAI";
import MusicStudio from "./pages/MusicStudio";
import DevonnChat from "./pages/DevonnChat";
import Cookbook from "./pages/Cookbook";
import Sandbox from "./pages/Sandbox";
import LegacyDashboard from "./pages/LegacyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "./components/ui/sonner";
import { ChatProvider } from "./contexts/ChatContext";
import { ThemeProvider } from 'next-themes';
import { DeploymentProvider } from "./contexts/DeploymentContext";
import { APIProvider } from "./contexts/APIContext";
import { AGUIProvider } from "./contexts/agui/AGUIContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Auth from "./pages/Auth";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <DeploymentProvider>
            <APIProvider>
              <ChatProvider>
                <AGUIProvider>
                  <Router>
                    <SidebarProvider>
                      <div className="min-h-screen flex w-full">
                        <AppSidebar />
                        <div className="flex-1 flex flex-col">
                          <Navbar />
                          <main className="flex-1">
                            <Routes>
                              <Route path="/" element={<Index />} />
                              <Route path="/deployment" element={<DeploymentDashboard />} />
                              <Route path="/api" element={<ApiConnections />} />
                              <Route path="/documentation" element={<Documentation />} />
                              <Route path="/agents" element={<AgentDashboard />} />
                              <Route path="/devonn" element={<DevonnDashboard />} />
                              <Route path="/flow" element={<FlowEditor />} />
            <Route path="/workflows" element={<ProtectedRoute><WorkflowManagement /></ProtectedRoute>} />
            <Route path="/remove-duplicates-demo" element={<RemoveDuplicatesDemo />} />
                              <Route path="/agent-demo" element={<AgentDemo />} />
                              <Route path="/enhanced-agents" element={<EnhancedAgentDemo />} />
                              <Route path="/advanced-ai" element={<AdvancedAI />} />
                              <Route path="/deployment-readiness" element={<DeploymentReadiness />} />
                              <Route path="/local-ai" element={<LocalAI />} />
                              <Route path="/music-studio" element={<MusicStudio />} />
                              <Route path="/auth" element={<Auth />} />
                              <Route path="/devonn-chat" element={<ProtectedRoute><DevonnChat /></ProtectedRoute>} />
                              <Route path="/cookbook" element={<Cookbook />} />
                              <Route path="/about" element={<About />} />
                              <Route path="/contact" element={<Contact />} />
                              <Route path="/sandbox" element={<Sandbox />} />
                              <Route path="/legacy-workflows" element={<ProtectedRoute><LegacyDashboard /></ProtectedRoute>} />
                              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                              <Route path="/terms" element={<Terms />} />
                              <Route path="/privacy" element={<Privacy />} />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </main>
                          <Footer />
                        </div>
                      </div>
                    </SidebarProvider>
                    <Toaster />
                  </Router>
                </AGUIProvider>
              </ChatProvider>
            </APIProvider>
          </DeploymentProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
