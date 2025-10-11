import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@/components/Container';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, Share2, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const VideoDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);

  useEffect(() => {
    const fetchVideo = async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setVideo(data);

        // Update view count
        await supabase
          .from('videos')
          .update({ view_count: data.view_count + 1 })
          .eq('id', id);

        // Track watch history if user is logged in
        if (user) {
          await supabase
            .from('watch_history')
            .upsert({
              user_id: user.id,
              video_id: id,
              watched_at: new Date().toISOString()
            });
        }

        // Fetch related videos
        const { data: related } = await supabase
          .from('videos')
          .select('*')
          .eq('category_id', data.category_id)
          .neq('id', id)
          .limit(3);

        if (related) setRelatedVideos(related);
      }
    };

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('video_id', id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setComments(data);
      }
    };

    fetchVideo();
    fetchComments();
  }, [id, user]);

  const handleCommentSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) return;

    const { error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        video_id: id,
        content: newComment
      });

    if (!error) {
      setNewComment('');
      toast.success('Comment posted!');
      // Refresh comments
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('video_id', id)
        .order('created_at', { ascending: false });
      if (data) setComments(data);
    } else {
      toast.error('Failed to post comment');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!video) return null;

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-black aspect-video rounded-lg overflow-hidden mb-6 flex items-center justify-center">
              {video.video_url ? (
                <video controls className="w-full h-full" src={video.video_url} />
              ) : (
                <PlayCircle className="w-24 h-24 text-white/50" />
              )}
            </div>

            <h1 className="text-3xl font-bold mb-4">{video.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{video.view_count} views</p>
              </div>
              <Button variant="outline" size="sm">
                <ThumbsUp className="w-4 h-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <p className="text-muted-foreground">{video.description}</p>
                {video.instructor_name && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="font-semibold">Instructor: {video.instructor_name}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>
                
                <div className="mb-6">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-2"
                  />
                  <Button onClick={handleCommentSubmit}>Post Comment</Button>
                </div>

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                      <p>{comment.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Related Videos</h3>
            <div className="space-y-4">
              {relatedVideos.map((related) => (
                <Card
                  key={related.id}
                  onClick={() => window.location.href = `/devonn-tv/video/${related.id}`}
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  <CardContent className="p-4">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-950 h-32 rounded-lg mb-3 flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-white/80" />
                    </div>
                    <h4 className="font-semibold mb-2 line-clamp-2">{related.title}</h4>
                    <p className="text-sm text-muted-foreground">{formatDuration(related.duration)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default VideoDetail;
