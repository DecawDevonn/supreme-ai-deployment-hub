-- Seed data for Devonn.AI Sandbox

-- Insert sample users
INSERT INTO users (username, email, hashed_password, is_active) VALUES
('demo_user', 'demo@devonn.ai', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lW7o/gXz0nCu', true),
('test_user', 'test@devonn.ai', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lW7o/gXz0nCu', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (user_id, name, description, project_type, status, metadata) VALUES
(1, 'AI Movie Demo', 'Sample movie project showcasing AI capabilities', 'movie', 'active', '{"duration": 60, "resolution": "1080p"}'),
(1, 'Product Showcase', 'Marketing video for new product', 'movie', 'active', '{"duration": 30, "resolution": "4K"}'),
(2, 'Tutorial Series', 'Educational content series', 'movie', 'active', '{"duration": 300, "episodes": 5}')
ON CONFLICT DO NOTHING;

-- Insert sample assets
INSERT INTO assets (project_id, asset_type, file_path, metadata) VALUES
(1, 'script', '/assets/scripts/demo_script.txt', '{"word_count": 500, "language": "en"}'),
(1, 'image', '/assets/images/scene1.png', '{"width": 1920, "height": 1080, "format": "png"}'),
(1, 'audio', '/assets/audio/narration.wav', '{"duration": 45, "format": "wav"}'),
(2, 'video', '/assets/videos/product_demo.mp4', '{"duration": 30, "resolution": "4K"}')
ON CONFLICT DO NOTHING;

-- Insert sample jobs
INSERT INTO jobs (project_id, job_type, status, result) VALUES
(1, 'generate_script', 'completed', '{"script_id": 1, "word_count": 500}'),
(1, 'generate_images', 'completed', '{"images_generated": 5}'),
(2, 'render_video', 'pending', NULL)
ON CONFLICT DO NOTHING;
