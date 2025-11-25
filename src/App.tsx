
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
import MoneyHub from "./pages/MoneyHub";
import Therapy from "./pages/Therapy";
import Music from "./pages/Music";
import Sovereignty from "./pages/Sovereignty";
import PlanetaryChart from "./pages/PlanetaryChart";
import Backtesting from "./pages/Backtesting";
import TV from "./pages/TV";
import Tools from "./pages/Tools";
import Workflows from "./pages/Workflows";
import { Toaster } from "./components/ui/sonner";
import { ChatProvider } from "./contexts/ChatContext";
import { ThemeProvider } from 'next-themes';
import { DeploymentProvider } from "./contexts/DeploymentContext";
import { APIProvider } from "./contexts/APIContext";
import { AGUIProvider } from "./contexts/agui/AGUIContext";

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
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/film" element={<FilmPage />} />
                    <Route path="/deployment" element={<DeploymentDashboard />} />
                    <Route path="/api" element={<APIManagement />} />
                    <Route path="/documentation" element={<Documentation />} />
                    <Route path="/agents" element={<AgentDashboard />} />
                    <Route path="/devonn" element={<DevonnDashboard />} />
                    <Route path="/flow" element={<FlowEditor />} />
                    <Route path="/workflows" element={<WorkflowManagement />} />
                    <Route path="/agent-demo" element={<AgentDemo />} />
                    <Route path="/enhanced-agents" element={<EnhancedAgentDemo />} />
                    <Route path="/money-hub" element={<MoneyHub />} />
                    <Route path="/therapy" element={<Therapy />} />
                    <Route path="/music" element={<Music />} />
                    <Route path="/sovereignty" element={<Sovereignty />} />
                    <Route path="/planetary-chart" element={<PlanetaryChart />} />
                    <Route path="/backtesting" element={<Backtesting />} />
                    <Route path="/tv" element={<TV />} />
                    <Route path="/tools" element={<Tools />} />
                    <Route path="/devonn-workflows" element={<Workflows />} />
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
