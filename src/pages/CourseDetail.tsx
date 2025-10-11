import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@/components/Container';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setCourse(data);
      }
    };

    const fetchLessons = async () => {
      const { data, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true });

      if (!error && data) {
        setLessons(data);
      }
    };

    const checkEnrollment = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('enrollments')
          .select('*')
          .eq('course_id', id)
          .eq('user_id', user.id)
          .single();

        if (!error && data) {
          setEnrollment(data);
          setIsEnrolled(true);
        }
      }
    };

    fetchCourse();
    fetchLessons();
    checkEnrollment();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please sign in to enroll');
      navigate('/auth');
      return;
    }

    const { error } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: id,
        progress: 0
      });

    if (!error) {
      toast.success('Successfully enrolled!');
      setIsEnrolled(true);
      // Refresh enrollment data
      const { data } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', id)
        .eq('user_id', user.id)
        .single();
      if (data) setEnrollment(data);
    } else {
      toast.error('Failed to enroll');
    }
  };

  if (!course) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-xl text-white/90 mb-6">{course.description}</p>
              <div className="flex gap-4 mb-4">
                {course.difficulty && (
                  <span className="px-4 py-2 bg-white/20 text-white rounded-lg capitalize">
                    {course.difficulty}
                  </span>
                )}
                <span className="px-4 py-2 bg-white/20 text-white rounded-lg">
                  {lessons.length} Lessons
                </span>
              </div>
              {!isEnrolled ? (
                <Button size="lg" onClick={handleEnroll} className="text-lg px-8">
                  Enroll Now
                </Button>
              ) : (
                <div className="bg-white/10 p-4 rounded-lg">
                  <p className="text-white mb-2">Your Progress</p>
                  <Progress value={enrollment?.progress || 0} className="mb-2" />
                  <p className="text-white/80 text-sm">{enrollment?.progress || 0}% Complete</p>
                </div>
              )}
            </div>
            <div className="bg-white/10 rounded-lg aspect-video flex items-center justify-center">
              {course.thumbnail_url ? (
                <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <PlayCircle className="w-32 h-32 text-white/50" />
              )}
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <h2 className="text-3xl font-bold mb-8">Course Curriculum</h2>
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <Card key={lesson.id} className="hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {isEnrolled ? (
                        <Check className="w-6 h-6 text-primary" />
                      ) : (
                        <span className="font-bold text-primary">{index + 1}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{lesson.title}</h3>
                    <p className="text-muted-foreground text-sm">{lesson.description}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default CourseDetail;
