import { MusicGenerator } from '@/components/music/MusicGenerator';

const MusicStudio = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Music Studio</h1>
        <p className="text-muted-foreground">
          AI-powered music generation inspired by OpenUdio Matrix. Create, analyze, and remix music compositions.
        </p>
      </div>
      
      <MusicGenerator />
    </div>
  );
};

export default MusicStudio;
