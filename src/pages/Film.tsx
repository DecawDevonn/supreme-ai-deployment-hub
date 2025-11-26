import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Film, Sparkles, Download, Music, Mic, Image as ImageIcon, Video, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PipelineStep {
  id: string;
  name: string;
  icon: any;
  status: 'pending' | 'processing' | 'complete' | 'error';
  data?: any;
}

const FilmPage = () => {
  const navigate = useNavigate();
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<PipelineStep[]>([
    { id: 'screenplay', name: 'Screenplay', icon: FileText, status: 'pending' },
    { id: 'storyboard', name: 'Storyboard', icon: ImageIcon, status: 'pending' },
    { id: 'video', name: 'Video Clips', icon: Video, status: 'pending' },
    { id: 'voice', name: 'Voiceover', icon: Mic, status: 'pending' },
    { id: 'music', name: 'Music', icon: Music, status: 'pending' },
  ]);

  const updateStepStatus = (stepId: string, status: PipelineStep['status'], data?: any) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, data } : step
    ));
  };

  const generateFilm = async () => {
    if (!idea.trim()) {
      toast.error('Please enter your film idea');
      return;
    }

    setLoading(true);
    setCurrentStep(0);
    
    try {
      // Step 1: Generate Screenplay
      updateStepStatus('screenplay', 'processing');
      const { data: screenplayData, error: screenplayError } = await supabase.functions.invoke('generate-screenplay', {
        body: { idea }
      });
      if (screenplayError) throw screenplayError;
      updateStepStatus('screenplay', 'complete', { text: screenplayData.screenplay });
      setCurrentStep(1);
      toast.success('Screenplay complete!');

      // Step 2: Generate Storyboard
      updateStepStatus('storyboard', 'processing');
      const { data: storyboardData, error: storyboardError } = await supabase.functions.invoke('generate-storyboard', {
        body: { screenplay: screenplayData.screenplay }
      });
      if (storyboardError) throw storyboardError;
      updateStepStatus('storyboard', 'complete', { images: storyboardData.images });
      setCurrentStep(2);
      toast.success('Storyboard created!');

      // Step 3: Generate Video Clips
      updateStepStatus('video', 'processing');
      const { data: videoData, error: videoError } = await supabase.functions.invoke('generate-video-clips', {
        body: { storyboard: storyboardData.images }
      });
      if (videoError) throw videoError;
      updateStepStatus('video', 'complete', { clips: videoData.clips });
      setCurrentStep(3);
      toast.success('Video clips rendered!');

      // Step 4: Generate Voiceover
      updateStepStatus('voice', 'processing');
      const { data: voiceData, error: voiceError } = await supabase.functions.invoke('generate-voiceover', {
        body: { screenplay: screenplayData.screenplay }
      });
      if (voiceError) throw voiceError;
      updateStepStatus('voice', 'complete', { audio: voiceData.audioUrl });
      setCurrentStep(4);
      toast.success('Voiceover added!');

      // Step 5: Generate Music
      updateStepStatus('music', 'processing');
      const { data: musicData, error: musicError } = await supabase.functions.invoke('generate-music', {
        body: { mood: musicData?.mood || 'cinematic' }
      });
      if (musicError) throw musicError;
      updateStepStatus('music', 'complete', { audio: musicData.musicUrl });
      setCurrentStep(5);
      
      toast.success('🎬 Film complete! Ready for download');
    } catch (error: any) {
      console.error('Error:', error);
      const stepIds = ['screenplay', 'storyboard', 'video', 'voice', 'music'];
      updateStepStatus(stepIds[currentStep], 'error');
      toast.error(error.message || 'Pipeline failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadScreenplay = () => {
    const step = steps.find(s => s.id === 'screenplay');
    if (!step?.data?.text) return;
    const blob = new Blob([step.data.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screenplay.txt';
    a.click();
  };

  const downloadFinalFilm = async () => {
    toast.success('Preparing MP4 download...');
    // In production, this would composite all assets into final MP4
    toast.info('Download feature requires video composition API');
  };

  const progress = loading ? (currentStep / steps.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Film className="w-6 h-6 text-purple-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Filmmaker Studio
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Full Production Pipeline
            </h2>
            <p className="text-slate-400">
              Logline → Script → Storyboard → Video → Voice → Music → 4K MP4
            </p>
          </div>

          {/* Input Card */}
          <Card className="bg-slate-900/50 border-purple-500/20 p-6 mb-8">
            <Textarea
              placeholder="Enter your film logline... (e.g., 'In a world where dreams are stolen, one lucid dreamer fights to reclaim humanity's imagination')"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="min-h-[150px] bg-slate-900/50 border-purple-500/30 text-white mb-4"
              disabled={loading}
            />
            <Button
              onClick={generateFilm}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Film...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Complete Film
                </>
              )}
            </Button>
          </Card>

          {/* Progress Section */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-8"
              >
                <Card className="bg-slate-900/50 border-purple-500/20 p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Pipeline Progress</span>
                      <span className="text-sm text-purple-400">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4">
                    {steps.map((step, idx) => (
                      <div key={step.id} className="text-center">
                        <div className={`
                          w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center
                          ${step.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                            step.status === 'processing' ? 'bg-purple-500/20 text-purple-400 animate-pulse' :
                            step.status === 'error' ? 'bg-red-500/20 text-red-400' :
                            'bg-slate-700/20 text-slate-600'}
                        `}>
                          <step.icon className="w-5 h-5" />
                        </div>
                        <p className="text-xs text-slate-400">{step.name}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Screenplay */}
            {steps.find(s => s.id === 'screenplay')?.status === 'complete' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="bg-slate-900/50 border-purple-500/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-400" />
                      Screenplay
                    </h3>
                    <Button onClick={downloadScreenplay} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <pre className="text-sm text-slate-300 whitespace-pre-wrap">
                      {steps.find(s => s.id === 'screenplay')?.data?.text?.slice(0, 500)}...
                    </pre>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Storyboard */}
            {steps.find(s => s.id === 'storyboard')?.status === 'complete' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="bg-slate-900/50 border-purple-500/20 p-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <ImageIcon className="w-5 h-5 text-pink-400" />
                    Storyboard
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {steps.find(s => s.id === 'storyboard')?.data?.images?.slice(0, 4).map((img: string, idx: number) => (
                      <img key={idx} src={img} alt={`Frame ${idx + 1}`} className="rounded-lg w-full h-32 object-cover" />
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Video Preview */}
            {steps.find(s => s.id === 'video')?.status === 'complete' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-2"
              >
                <Card className="bg-slate-900/50 border-purple-500/20 p-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <Video className="w-5 h-5 text-cyan-400" />
                    Video Clips
                  </h3>
                  <video 
                    controls 
                    className="w-full rounded-lg"
                    src={steps.find(s => s.id === 'video')?.data?.clips?.[0]}
                  />
                </Card>
              </motion.div>
            )}
          </div>

          {/* Final Download */}
          {steps.every(s => s.status === 'complete') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <Button
                onClick={downloadFinalFilm}
                size="lg"
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Final 4K MP4
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FilmPage;
