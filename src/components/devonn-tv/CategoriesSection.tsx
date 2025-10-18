import React, { useEffect, useState } from 'react';
import { Brain, Video, GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import categoryAI from '@/assets/category-ai.jpg';
import categoryVideo from '@/assets/category-video.jpg';
import categoryCourses from '@/assets/category-courses.jpg';

const iconMap: Record<string, any> = {
  'Brain': Brain,
  'Video': Video,
  'GraduationCap': GraduationCap,
};

const imageMap: Record<string, string> = {
  'Brain': categoryAI,
  'Video': categoryVideo,
  'GraduationCap': categoryCourses,
};

const CategoriesSection = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (!error && data) {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-12 -mt-32 relative z-10">
      <h2 className="text-3xl font-bold mb-6 px-4 md:px-0">Browse by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Brain;
          const bgImage = imageMap[category.icon] || categoryAI;
          return (
            <Card
              key={category.id}
              onClick={() => navigate(`/devonn-tv/category/${category.slug}`)}
              className="relative overflow-hidden h-48 cursor-pointer group border-0 rounded-lg"
            >
              {/* Background Image */}
              <img 
                src={bgImage} 
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              
              {/* Content */}
              <div className="relative h-full p-6 flex flex-col justify-end">
                <Icon className="w-12 h-12 mb-3 drop-shadow-lg" />
                <h3 className="text-2xl font-bold drop-shadow-lg">{category.name}</h3>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default CategoriesSection;
