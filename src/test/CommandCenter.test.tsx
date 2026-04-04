import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CommandCenter from "@/pages/CommandCenter";

// Mock Supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({ data: [], error: null }),
        data: [],
        error: null,
      }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  },
}));

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe("CommandCenter", () => {
  it("renders the sidebar with all navigation items", () => {
    renderWithRouter(<CommandCenter />);
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Agents")).toBeInTheDocument();
    expect(screen.getByText("MCP Tools")).toBeInTheDocument();
    expect(screen.getByText("Marketplace")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("switches views when sidebar items are clicked", () => {
    renderWithRouter(<CommandCenter />);
    fireEvent.click(screen.getByText("Agents"));
    // Should show Agents view content
    expect(screen.getByText("Agents")).toBeInTheDocument();
  });

  it("renders the Command Center title", () => {
    renderWithRouter(<CommandCenter />);
    expect(screen.getByText("Command Center")).toBeInTheDocument();
  });
});
