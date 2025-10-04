
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import WorkflowManagement from "./pages/WorkflowManagement";
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
import AgentDemo from "./pages/AgentDemo"; // Import the new AgentDemo page
import EnhancedAgentDemo from "./pages/EnhancedAgentDemo"; // Enhanced multi-provider platform
import AdvancedAI from "./pages/AdvancedAI";
import DeploymentReadiness from "./pages/DeploymentReadiness";
import LocalAI from "./pages/LocalAI";
import MusicStudio from "./pages/MusicStudio";
import DevonnChat from "./pages/DevonnChat";
import Cookbook from "./pages/Cookbook";
import { Toaster } from "./components/ui/sonner";
import { ChatProvider } from "./contexts/ChatContext";
import { ThemeProvider } from 'next-themes';
import { DeploymentProvider } from "./contexts/DeploymentContext";
import { APIProvider } from "./contexts/APIContext";
import { AGUIProvider } from "./contexts/agui/AGUIContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Auth from "./pages/Auth";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
      <DeploymentProvider>
        <APIProvider>
          <ChatProvider>
            <AGUIProvider>
              <Router>
                <Navbar />
                <main className="min-h-screen">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/deployment" element={<DeploymentDashboard />} />
                    <Route path="/api" element={<ApiConnections />} />
                    <Route path="/documentation" element={<Documentation />} />
                    <Route path="/agents" element={<AgentDashboard />} />
                    <Route path="/devonn" element={<DevonnDashboard />} />
                    <Route path="/flow" element={<FlowEditor />} />
                    <Route path="/workflows" element={<WorkflowManagement />} />
                    <Route path="/agent-demo" element={<AgentDemo />} /> {/* Add the new route */}
                    <Route path="/enhanced-agents" element={<EnhancedAgentDemo />} /> {/* Enhanced multi-LLM platform */}
                    <Route path="/advanced-ai" element={<AdvancedAI />} /> {/* Advanced AI Agent with cutting-edge features */}
                    <Route path="/deployment-readiness" element={<DeploymentReadiness />} /> {/* Supreme AI Deployment Hub */}
                    <Route path="/local-ai" element={<LocalAI />} /> {/* Pinokio-style local AI tools manager */}
                    <Route path="/music-studio" element={<MusicStudio />} /> {/* OpenUdio Matrix-inspired music generation */}
                    <Route path="/auth" element={<Auth />} /> {/* Authentication page */}
                    <Route path="/devonn-chat" element={<ProtectedRoute><DevonnChat /></ProtectedRoute>} /> {/* Devonn.ai Copilot with KG tracking */}
                    <Route path="/cookbook" element={<Cookbook />} /> {/* Devonn.ai Cookbook documentation */}
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </Router>
              <Toaster />
            </AGUIProvider>
          </ChatProvider>
        </APIProvider>
      </DeploymentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
