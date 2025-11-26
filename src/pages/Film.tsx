import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Film, Sparkles, Download, CheckCircle, Loader2, Image, Video, Mic, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface FilmData {
  screenplay: string;
  storyboard: { scene: string; imageUrl: string }[];
  videoClips: string[];
  voiceoverUrl: string;
  musicUrl: string;
}

type PipelineStep = 'idle' | 'screenplay' | 'storyboard' | 'video' | 'voiceover' | 'music' | 'finished' | 'error';

interface StepStatus {
  name: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  icon: any;
}

const FilmPage = () => {
  const navigate = useNavigate();
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<PipelineStep>('idle');
  const [progress, setProgress] = useState(0);
  const [filmData, setFilmData] = useState<FilmData>({
    screenplay: '',
    storyboard: [],
    videoClips: [],
    voiceoverUrl: '',
    musicUrl: '',
  });

  const [steps, setSteps] = useState<StepStatus[]>([
    { name: 'Screenplay', status: 'pending', icon: Film },
    { name: 'Storyboard', status: 'pending', icon: Image },
    { name: 'Video Clips', status: 'pending', icon: Video },
    { name: 'Voiceover', status: 'pending', icon: Mic },
    { name: 'Music', status: 'pending', icon: Music },
  ]);

  const updateStepStatus = (index: number, status: 'pending' | 'processing' | 'complete' | 'error') => {
    setSteps(prev => prev.map((step, i) => i === index ? { ...step, status } : step));
  };

  const generateScreenplay = async () => {
    setCurrentStep('screenplay');
    updateStepStatus(0, 'processing');
    setProgress(10);

    try {
      const { data, error } = await supabase.functions.invoke('generate-screenplay', {
        body: { idea }
      });

      if (error) throw error;
      
      setFilmData(prev => ({ ...prev, screenplay: data.screenplay }));
      updateStepStatus(0, 'complete');
      setProgress(20);
      toast.success('Screenplay generated!');
      return data.screenplay;
    } catch (error: any) {
      updateStepStatus(0, 'error');
      throw error;
    }
  };

  const generateStoryboard = async (screenplay: string) => {
    setCurrentStep('storyboard');
    updateStepStatus(1, 'processing');
    setProgress(30);

    try {
      const { data, error } = await supabase.functions.invoke('generate-storyboard', {
        body: { screenplay }
      });

      if (error) throw error;
      
      setFilmData(prev => ({ ...prev, storyboard: data.storyboard }));
      updateStepStatus(1, 'complete');
      setProgress(45);
      toast.success('Storyboard created!');
      return data.storyboard;
    } catch (error: any) {
      updateStepStatus(1, 'error');
      throw error;
    }
  };

  const generateVideoClips = async (screenplay: string, storyboard: any[]) => {
    setCurrentStep('video');
    updateStepStatus(2, 'processing');
    setProgress(55);

    try {
      const { data, error } = await supabase.functions.invoke('generate-video-clips', {
        body: { screenplay, storyboard }
      });

      if (error) throw error;
      
      setFilmData(prev => ({ ...prev, videoClips: data.videoClips }));
      updateStepStatus(2, 'complete');
      setProgress(70);
      toast.success('Video clips generated!');
      return data.videoClips;
    } catch (error: any) {
      updateStepStatus(2, 'error');
      throw error;
    }
  };

  const generateVoiceover = async (screenplay: string) => {
    setCurrentStep('voiceover');
    updateStepStatus(3, 'processing');
    setProgress(80);

    try {
      const { data, error } = await supabase.functions.invoke('generate-voiceover', {
        body: { screenplay }
      });

      if (error) throw error;
      
      setFilmData(prev => ({ ...prev, voiceoverUrl: data.audioUrl }));
      updateStepStatus(3, 'complete');
      setProgress(90);
      toast.success('Voiceover created!');
      return data.audioUrl;
    } catch (error: any) {
      updateStepStatus(3, 'error');
      throw error;
    }
  };

  const generateMusic = async (screenplay: string) => {
    setCurrentStep('music');
    updateStepStatus(4, 'processing');
    setProgress(95);

    try {
      const { data, error } = await supabase.functions.invoke('generate-music', {
        body: { screenplay, mood: 'cinematic' }
      });

      if (error) throw error;
      
      setFilmData(prev => ({ ...prev, musicUrl: data.musicUrl }));
      updateStepStatus(4, 'complete');
      setProgress(100);
      toast.success('Music generated!');
      return data.musicUrl;
    } catch (error: any) {
      updateStepStatus(4, 'error');
      throw error;
    }
  };

  const startFilmmakerPipeline = async () => {
    if (!idea.trim()) {
      toast.error('Please enter your film idea');
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      // Sequential pipeline execution
      const screenplay = await generateScreenplay();
      if (!screenplay) return;

      const storyboard = await generateStoryboard(screenplay);
      if (!storyboard) return;

      const videoClips = await generateVideoClips(screenplay, storyboard);
      if (!videoClips) return;

      const voiceover = await generateVoiceover(screenplay);
      if (!voiceover) return;

      const music = await generateMusic(screenplay);
      if (!music) return;

      setCurrentStep('finished');
      toast.success('🎬 Film creation complete!');
    } catch (error: any) {
      console.error('Pipeline error:', error);
      setCurrentStep('error');
      toast.error(error.message || 'Failed to create film');
    } finally {
      setLoading(false);
    }
  };

  const downloadScreenplay = () => {
    const blob = new Blob([filmData.screenplay], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screenplay.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadFinalFilm = () => {
    toast.info('Assembling final MP4... This will be available soon!');
  };

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
                AI Filmmaker
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
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Create Your AI Film
            </h2>
            <p className="text-slate-400">
              Logline → Script → Storyboard → Video → Voice → Music → 4K MP4
            </p>
          </div>

          {/* Input Card */}
          <Card className="bg-slate-900/50 border-purple-500/20 p-6 mb-6">
            <Textarea
              placeholder="Describe your film idea... (e.g., 'A futuristic city where AI and humans coexist, showing daily life and challenges')"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="min-h-[150px] bg-slate-900/50 border-purple-500/30 text-white mb-4"
              disabled={loading}
            />
            <Button
              onClick={startFilmmakerPipeline}
              disabled={loading || currentStep === 'finished'}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Magic...
                </>
              ) : currentStep === 'finished' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Film Complete!
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Full Film
                </>
              )}
            </Button>
          </Card>

          {/* Progress Bar */}
          {loading && (
            <Card className="bg-slate-900/50 border-purple-500/20 p-6 mb-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Pipeline Progress</span>
                  <span className="text-purple-400 font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </Card>
          )}

          {/* Pipeline Steps */}
          {(loading || currentStep === 'finished') && (
            <Card className="bg-slate-900/50 border-purple-500/20 p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Production Pipeline</h3>
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                        step.status === 'processing' ? 'bg-purple-500/20 text-purple-400' :
                        step.status === 'error' ? 'bg-red-500/20 text-red-400' :
                        'bg-slate-800/50 text-slate-500'
                      }`}>
                        {step.status === 'complete' ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : step.status === 'processing' ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          step.status === 'complete' ? 'text-green-400' :
                          step.status === 'processing' ? 'text-purple-400' :
                          step.status === 'error' ? 'text-red-400' :
                          'text-slate-400'
                        }`}>
                          {step.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Screenplay Output */}
          {filmData.screenplay && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="bg-slate-900/50 border-purple-500/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">📜 Screenplay</h3>
                  <Button
                    onClick={downloadScreenplay}
                    variant="outline"
                    size="sm"
                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                <pre className="text-slate-300 whitespace-pre-wrap text-sm max-h-[400px] overflow-y-auto">
                  {filmData.screenplay}
                </pre>
              </Card>
            </motion.div>
          )}

          {/* Storyboard Output */}
          {filmData.storyboard.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="bg-slate-900/50 border-purple-500/20 p-6">
                <h3 className="text-xl font-bold text-white mb-4">🎨 Storyboard</h3>
                <div className="grid grid-cols-2 gap-4">
                  {filmData.storyboard.map((frame, index) => (
                    <div key={index} className="space-y-2">
                      <img 
                        src={frame.imageUrl} 
                        alt={`Scene ${index + 1}`}
                        className="w-full rounded-lg border border-purple-500/20"
                      />
                      <p className="text-sm text-slate-400">{frame.scene}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Video Clips Output */}
          {filmData.videoClips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="bg-slate-900/50 border-purple-500/20 p-6">
                <h3 className="text-xl font-bold text-white mb-4">🎬 Video Clips</h3>
                <div className="grid grid-cols-1 gap-4">
                  {filmData.videoClips.map((clip, index) => (
                    <video
                      key={index}
                      src={clip}
                      controls
                      className="w-full rounded-lg border border-purple-500/20"
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Audio Outputs */}
          {(filmData.voiceoverUrl || filmData.musicUrl) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="bg-slate-900/50 border-purple-500/20 p-6">
                <h3 className="text-xl font-bold text-white mb-4">🎧 Audio</h3>
                <div className="space-y-4">
                  {filmData.voiceoverUrl && (
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Voiceover</p>
                      <audio src={filmData.voiceoverUrl} controls className="w-full" />
                    </div>
                  )}
                  {filmData.musicUrl && (
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Background Music</p>
                      <audio src={filmData.musicUrl} controls className="w-full" />
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Final Download */}
          {currentStep === 'finished' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30 p-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
                  <h3 className="text-2xl font-bold text-white">🎉 Film Production Complete!</h3>
                  <p className="text-slate-300">
                    Your AI-generated film is ready. All assets have been created.
                  </p>
                  <Button
                    onClick={downloadFinalFilm}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Final 4K MP4
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FilmPage;
