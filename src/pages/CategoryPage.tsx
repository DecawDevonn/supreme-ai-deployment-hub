import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@/components/Container';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchData = async () => {
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (catData) {
        setCategory(catData);

        let videoQuery = supabase
          .from('videos')
          .select('*')
          .eq('category_id', catData.id);

        if (difficultyFilter !== 'all') {
          videoQuery = videoQuery.eq('difficulty', difficultyFilter);
        }

        const { data: videoData } = await videoQuery;
        if (videoData) setVideos(videoData);

        let courseQuery = supabase
          .from('courses')
          .select('*')
          .eq('category_id', catData.id);

        if (difficultyFilter !== 'all') {
          courseQuery = courseQuery.eq('difficulty', difficultyFilter);
        }

        const { data: courseData } = await courseQuery;
        if (courseData) setCourses(courseData);
      }
    };

    fetchData();
  }, [slug, difficultyFilter]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!category) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className={`bg-gradient-to-br ${category.gradient} py-24`}>
        <Container>
          <h1 className="text-5xl font-bold text-white mb-4">{category.name}</h1>
          <p className="text-xl text-white/90">
            Explore videos and courses about {category.name.toLowerCase()}
          </p>
        </Container>
      </div>

      <Container className="py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>

        {filteredVideos.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Videos</h2>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredVideos.map((video) => (
                <Card
                  key={video.id}
                  onClick={() => navigate(`/devonn-tv/video/${video.id}`)}
                  className="overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="bg-gradient-to-br from-slate-800 to-slate-950 h-48 flex items-center justify-center">
                    {video.thumbnail_url ? (
                      <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <PlayCircle className="w-20 h-20 text-white/80" />
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{video.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{video.description}</p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{formatDuration(video.duration)}</span>
                      {video.difficulty && <span className="capitalize">{video.difficulty}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {filteredCourses.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Courses</h2>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  onClick={() => navigate(`/devonn-tv/course/${course.id}`)}
                  className="overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="bg-gradient-to-br from-blue-900 to-blue-950 h-48 flex items-center justify-center">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <PlayCircle className="w-20 h-20 text-white/80" />
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{course.description}</p>
                    {course.difficulty && (
                      <span className="text-sm text-muted-foreground capitalize">{course.difficulty}</span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
};

export default CategoryPage;
