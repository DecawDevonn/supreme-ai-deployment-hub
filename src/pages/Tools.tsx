import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  Calendar, 
  FileText, 
  Image, 
  Music, 
  Code, 
  Palette,
  Lock,
  Globe,
  Zap
} from "lucide-react";

const Tools = () => {
  const tools = [
    { name: "Unit Converter", icon: Calculator, description: "Convert between different units" },
    { name: "Date Calculator", icon: Calendar, description: "Calculate dates and time differences" },
    { name: "Text Editor", icon: FileText, description: "Advanced text editing tools" },
    { name: "Image Editor", icon: Image, description: "Edit and enhance images" },
    { name: "Audio Tools", icon: Music, description: "Audio manipulation and conversion" },
    { name: "Code Formatter", icon: Code, description: "Format and beautify code" },
    { name: "Color Picker", icon: Palette, description: "Choose and convert colors" },
    { name: "Password Generator", icon: Lock, description: "Generate secure passwords" },
    { name: "URL Shortener", icon: Globe, description: "Shorten long URLs" },
    { name: "QR Generator", icon: Zap, description: "Create QR codes" },
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Tools
        </h1>
        <p className="text-muted-foreground">
          Useful utilities and tools for everyday tasks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card key={tool.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-primary" />
                  {tool.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {tool.description}
                </p>
                <Button variant="outline" className="w-full">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Tools;
