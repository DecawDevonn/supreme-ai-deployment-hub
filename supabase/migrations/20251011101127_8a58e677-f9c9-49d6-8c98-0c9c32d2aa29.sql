-- Create categories table
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text NOT NULL,
  gradient text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create videos table
CREATE TABLE public.videos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  video_url text,
  thumbnail_url text,
  category_id uuid REFERENCES public.categories(id),
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration integer NOT NULL DEFAULT 0,
  instructor_name text,
  instructor_avatar text,
  view_count integer NOT NULL DEFAULT 0,
  is_premium boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  category_id uuid REFERENCES public.categories(id),
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  instructor_name text,
  instructor_avatar text,
  is_premium boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create course lessons table
CREATE TABLE public.course_lessons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  video_url text,
  order_index integer NOT NULL,
  duration integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress integer NOT NULL DEFAULT 0,
  enrolled_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create watch history table
CREATE TABLE public.watch_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  video_id uuid NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  progress integer NOT NULL DEFAULT 0,
  watched_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Create comments table
CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  video_id uuid NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create subscription tiers table
CREATE TABLE public.subscription_tiers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price_monthly numeric NOT NULL,
  price_yearly numeric NOT NULL,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  stripe_price_id_monthly text,
  stripe_price_id_yearly text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  tier_id uuid NOT NULL REFERENCES public.subscription_tiers(id),
  status text NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  billing_period text NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
  stripe_subscription_id text,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  ends_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create live events table
CREATE TABLE public.live_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  scheduled_at timestamp with time zone NOT NULL,
  stream_url text,
  thumbnail_url text,
  is_live boolean NOT NULL DEFAULT false,
  is_premium boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for videos (public read, admin write)
CREATE POLICY "Anyone can view videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Admins can manage videos" ON public.videos FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for courses (public read, admin write)
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for course lessons (public read, admin write)
CREATE POLICY "Anyone can view course lessons" ON public.course_lessons FOR SELECT USING (true);
CREATE POLICY "Admins can manage lessons" ON public.course_lessons FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for enrollments
CREATE POLICY "Users can view own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own enrollments" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own enrollments" ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for watch history
CREATE POLICY "Users can view own watch history" ON public.watch_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own watch history" ON public.watch_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own watch history" ON public.watch_history FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for subscription tiers (public read)
CREATE POLICY "Anyone can view subscription tiers" ON public.subscription_tiers FOR SELECT USING (true);
CREATE POLICY "Admins can manage subscription tiers" ON public.subscription_tiers FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for user subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own subscriptions" ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON public.user_subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for live events (public read, admin write)
CREATE POLICY "Anyone can view live events" ON public.live_events FOR SELECT USING (true);
CREATE POLICY "Admins can manage live events" ON public.live_events FOR ALL USING (is_admin(auth.uid()));

-- Insert default categories
INSERT INTO public.categories (name, slug, icon, gradient) VALUES
  ('AI', 'ai', 'Brain', 'from-purple-600 to-purple-800'),
  ('Filmmaking', 'filmmaking', 'Video', 'from-blue-700 to-blue-900'),
  ('eLearning', 'elearning', 'GraduationCap', 'from-orange-500 to-orange-700');