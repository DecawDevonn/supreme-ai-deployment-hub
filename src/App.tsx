
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FilmPage from "./pages/Film";
import WorkflowManagement from "./pages/WorkflowManagement";
import DeploymentDashboard from "./pages/DeploymentDashboard";
import APIManagement from "./pages/APIManagement";
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
import { Toaster } from "./components/ui/sonner";
import { ChatProvider } from "./contexts/ChatContext";
import { ThemeProvider } from 'next-themes';
import { DeploymentProvider } from "./contexts/DeploymentContext";
import { APIProvider } from "./contexts/APIContext";
import { AGUIProvider } from "./contexts/agui/AGUIContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DeploymentProvider>
        <APIProvider>
          <ChatProvider>
            <AGUIProvider>
              <Router>
                <Navbar />
                <main className="min-h-screen">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/film" element={<ProtectedRoute><FilmPage /></ProtectedRoute>} />
                    <Route path="/deployment" element={<ProtectedRoute><DeploymentDashboard /></ProtectedRoute>} />
                    <Route path="/api" element={<ProtectedRoute><APIManagement /></ProtectedRoute>} />
                    <Route path="/documentation" element={<Documentation />} />
                    <Route path="/agents" element={<ProtectedRoute><AgentDashboard /></ProtectedRoute>} />
                    <Route path="/devonn" element={<ProtectedRoute><DevonnDashboard /></ProtectedRoute>} />
                    <Route path="/flow" element={<ProtectedRoute><FlowEditor /></ProtectedRoute>} />
                    <Route path="/workflows" element={<ProtectedRoute><WorkflowManagement /></ProtectedRoute>} />
                    <Route path="/agent-demo" element={<ProtectedRoute><AgentDemo /></ProtectedRoute>} />
                    <Route path="/enhanced-agents" element={<ProtectedRoute><EnhancedAgentDemo /></ProtectedRoute>} />
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
    </ThemeProvider>
  );
}

export default App;
