import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@/components/Container';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [watchHistory, setWatchHistory] = useState<any[]>([]);
  const [recommendedVideos, setRecommendedVideos] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      toast.error('Please sign in to view your dashboard');
      navigate('/auth');
      return;
    }

    const fetchUserData = async () => {
      // Fetch enrollments with course details
      const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (*)
        `)
        .eq('user_id', user.id);

      if (enrollmentData) setEnrollments(enrollmentData);

      // Fetch watch history with video details
      const { data: historyData } = await supabase
        .from('watch_history')
        .select(`
          *,
          videos (*)
        `)
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false })
        .limit(5);

      if (historyData) setWatchHistory(historyData);

      // Fetch recommended videos (simple recommendation based on watch history)
      const { data: recommendedData } = await supabase
        .from('videos')
        .select('*')
        .order('view_count', { ascending: false })
        .limit(4);

      if (recommendedData) setRecommendedVideos(recommendedData);
    };

    fetchUserData();
  }, [user, navigate]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-primary/80 py-16">
        <Container>
          <h1 className="text-4xl font-bold text-white mb-2">My Learning Dashboard</h1>
          <p className="text-xl text-white/90">Track your progress and continue learning</p>
        </Container>
      </div>

      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <BookOpen className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{enrollments.length}</p>
                  <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Clock className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{watchHistory.length}</p>
                  <p className="text-sm text-muted-foreground">Videos Watched</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / (enrollments.length || 1))}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <PlayCircle className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {enrollments.filter(e => e.progress === 100).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((enrollment) => (
              <Card
                key={enrollment.id}
                onClick={() => navigate(`/devonn-tv/course/${enrollment.courses.id}`)}
                className="cursor-pointer hover:border-primary transition-colors"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{enrollment.courses.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {enrollment.courses.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <Progress value={enrollment.progress} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Watch History</h2>
          <div className="space-y-4">
            {watchHistory.map((history) => (
              <Card
                key={history.id}
                onClick={() => navigate(`/devonn-tv/video/${history.videos.id}`)}
                className="cursor-pointer hover:border-primary transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-950 w-32 h-20 rounded-lg flex items-center justify-center">
                      <PlayCircle className="w-8 h-8 text-white/80" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{history.videos.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Watched {new Date(history.watched_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDuration(history.videos.duration)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {recommendedVideos.map((video) => (
              <Card
                key={video.id}
                onClick={() => navigate(`/devonn-tv/video/${video.id}`)}
                className="cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="bg-gradient-to-br from-slate-800 to-slate-950 h-40 flex items-center justify-center">
                  <PlayCircle className="w-12 h-12 text-white/80" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">{formatDuration(video.duration)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
};

export default UserDashboard;
