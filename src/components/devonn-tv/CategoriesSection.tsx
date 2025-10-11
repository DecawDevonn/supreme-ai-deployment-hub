import React, { useEffect, useState } from 'react';
import { Brain, Video, GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const iconMap: Record<string, any> = {
  'Brain': Brain,
  'Video': Video,
  'GraduationCap': GraduationCap,
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
    <section className="py-16">
      <h2 className="text-4xl font-bold mb-8">Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Brain;
          return (
            <Card
              key={category.id}
              onClick={() => navigate(`/devonn-tv/category/${category.slug}`)}
              className={`bg-gradient-to-br ${category.gradient} p-8 cursor-pointer hover:scale-105 transition-transform border-0`}
            >
              <Icon className="w-16 h-16 mb-4 text-white" />
              <h3 className="text-2xl font-bold text-white">{category.name}</h3>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default CategoriesSection;
