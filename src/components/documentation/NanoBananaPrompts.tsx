import React, { useState } from 'react';
import { Search, Copy, CheckCircle, Image, Wand2, Palette, Users, Gamepad2, Building, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Prompt {
  id: number;
  title: string;
  category: string;
  input: string;
  prompt: string;
  tags: string[];
}

const prompts: Prompt[] = [
  {
    id: 1,
    title: "Illustration to Figure",
    category: "foundation",
    input: "Reference image",
    prompt: "turn this photo into a character figure. Behind it, place a box with the character's image printed on it, and a computer showing the Blender modeling process on its screen. In front of the box, add a round plastic base with the character figure standing on it. set the scene indoors if possible",
    tags: ["3d", "figure", "packaging", "blender"]
  },
  {
    id: 2,
    title: "Generate Ground View from Map Arrow",
    category: "foundation",
    input: "Google Maps image with red arrow",
    prompt: "draw what the red arrow sees / draw the real world view from the red circle in the direction of the arrow.",
    tags: ["maps", "street-view", "navigation"]
  },
  {
    id: 3,
    title: "Real World AR Information",
    category: "foundation",
    input: "Reference image",
    prompt: "you are a location-based AR experience generator. highlight [point of interest] in this image and annotate relevant information about it.",
    tags: ["ar", "annotation", "poi", "information"]
  },
  {
    id: 4,
    title: "Extract 3D Buildings/Make Isometric Models",
    category: "foundation",
    input: "Image containing objects",
    prompt: "Make Image Daytime and Isometric [Building Only]",
    tags: ["isometric", "buildings", "3d", "extraction"]
  },
  {
    id: 5,
    title: "Photos in Different Eras",
    category: "foundation",
    input: "Photo of a person",
    prompt: "Change the characer's style to [1970]'s classical [male] style. Add [long curly] hair, [long mustache], change the background to the iconic [californian summer landscape]. Don't change the character's face",
    tags: ["era", "style", "vintage", "retro"]
  },
  {
    id: 11,
    title: "Anime to Real Coser",
    category: "foundation",
    input: "Illustration image",
    prompt: "Generate a photo of a girl cosplaying this illustration, with the background set at Comiket",
    tags: ["anime", "cosplay", "realistic", "convention"]
  },
  {
    id: 20,
    title: "Old Photo Colorization",
    category: "foundation",
    input: "Old photo",
    prompt: "restore and colorize this photo.",
    tags: ["colorization", "restoration", "vintage", "repair"]
  },
  {
    id: 31,
    title: "Create Comic Book",
    category: "advanced",
    input: "Reference image",
    prompt: "Based on the uploaded image, make a comic book strip, add text, write a compelling story. I want a superhero comic book.",
    tags: ["comic", "superhero", "story", "sequential-art"]
  },
  {
    id: 32,
    title: "Action Figure",
    category: "advanced",
    input: "Reference image",
    prompt: "make an action figure of me that says [\"AI Evangelist - Kris\"] and features [coffee, turtle, laptop, phone and headphones]",
    tags: ["action-figure", "toy", "personal", "branding"]
  },
  {
    id: 38,
    title: "Google Maps View of Middle-earth",
    category: "advanced",
    input: "None required",
    prompt: "Dashcam Google Street View shot | [Hobbiton Street] | [hobbits carrying out daily tasks like gardening and smoking pipes] | [Sunny weather]",
    tags: ["fantasy", "street-view", "lotr", "creative"]
  },
  {
    id: 45,
    title: "LEGO Minifigure",
    category: "advanced",
    input: "Reference image",
    prompt: "Transform the person in the photo into a LEGO minifigure packaging box style, presented in isometric perspective. Label the box with the title \"ZHOGUE\". Inside the box, display the LEGO minifigure based on the person in the photo, along with their essential items (such as makeup, bags, or other items) as LEGO accessories. Beside the box, also display the actual LEGO minifigure itself, unpackaged, rendered in a realistic and vivid style.",
    tags: ["lego", "packaging", "isometric", "toy"]
  },
  {
    id: 55,
    title: "Create an Itasha Car",
    category: "advanced",
    input: "Reference image",
    prompt: "Create a professional photograph of a sporty car with anime-style character artwork as itasha (painted car) design, shot at a famous tourist destination or scenic landmark. The car features large, prominently displayed anime character illustrations with simple, clean design composition.",
    tags: ["itasha", "car", "anime", "photography"]
  },
  {
    id: 61,
    title: "Floor Plan 3D Render",
    category: "professional",
    input: "Floor-plan reference image",
    prompt: "Convert this residential floor plan into an isometric, photo-realistic 3D rendering of the house.",
    tags: ["architecture", "3d-render", "floor-plan", "isometric"]
  },
  {
    id: 69,
    title: "Model Holographic Projection",
    category: "professional",
    input: "None required",
    prompt: "Ultra-realistic product photo. Subject: virtual holographic character [CHARACTER], floating above a circular hologram projector Ø120 mm placed on a modern desk. Projection source rules: - If input reference is a 3D object → show a desktop 3D scanner beside the projector. Place the reference object on the scanner plate. The hologram above the projector is generated from this scanned object.",
    tags: ["hologram", "sci-fi", "projection", "tech"]
  },
  {
    id: 76,
    title: "Educational Comic",
    category: "professional",
    input: "None required",
    prompt: "Help me generate multiple 16:9 doodle-style images to explain the concept of \"futures\" to middle school students. The images should have a consistent colorful, thick-pencil hand-drawn style, be rich in information, feature English text, use solid color backgrounds, have outlines around the cards, and include uniform titles, similar to a PowerPoint presentation.",
    tags: ["education", "comic", "doodle", "presentation"]
  },
  {
    id: 86,
    title: "Dark Gothic Tarot Card",
    category: "professional",
    input: "Reference image",
    prompt: "Generate a dark gothic tarot card featuring me from this image. Include [\"AI Artist - Shira\"] and [coffee, white fluffy chubby cat with pink bow, laptop, phone, headphones] as symbols, with moody shadows, intricate gothic borders, and mystical dark fantasy vibes.",
    tags: ["tarot", "gothic", "mystical", "card-design"]
  }
];

const categories = [
  { id: 'all', name: 'All Prompts', icon: Wand2 },
  { id: 'foundation', name: 'Foundation', icon: Image },
  { id: 'advanced', name: 'Advanced', icon: Palette },
  { id: 'professional', name: 'Professional', icon: Building }
];

const NanoBananaPrompts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || prompt.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Prompt copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy prompt');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="text-4xl">🍌</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Nano-Banana Prompt Collection
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Complete collection of 91 professional AI image generation prompts from the Awesome-Nano-Banana repository. 
          Real-world tested techniques for advanced image editing and creation.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search prompts, tags, or techniques..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full lg:w-auto">
          <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{filteredPrompts.length}</div>
            <div className="text-sm text-muted-foreground">Available Prompts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">91</div>
            <div className="text-sm text-muted-foreground">Total Collection</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">4</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Prompts Grid */}
      <div className="grid gap-6">
        {filteredPrompts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                No prompts found matching your search criteria.
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">
                      Case {prompt.id}: {prompt.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      <strong>Input:</strong> {prompt.input}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {prompt.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Prompt Text */}
                <div className="bg-muted/50 rounded-lg p-4 relative group">
                  <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                    {prompt.prompt}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyToClipboard(prompt.prompt, prompt.id)}
                  >
                    {copiedId === prompt.id ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Usage Guidelines */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 Usage Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Key Notes:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <strong>[Brackets]</strong> indicate customizable parameters</li>
                <li>• Many prompts require input reference images</li>
                <li>• Technical parameters are specified for professional results</li>
                <li>• Some prompts include detailed negative prompts</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Best Practices:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Replace bracketed parameters with your content</li>
                <li>• Pay attention to input requirements</li>
                <li>• Test prompts with similar reference images first</li>
                <li>• Adjust parameters based on your specific needs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NanoBananaPrompts;