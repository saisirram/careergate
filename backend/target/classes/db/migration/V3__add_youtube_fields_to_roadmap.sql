-- Add YouTube fields to roadmap_items
ALTER TABLE roadmap_items ADD COLUMN IF NOT EXISTS youtube_video_id VARCHAR(20);
ALTER TABLE roadmap_items ADD COLUMN IF NOT EXISTS youtube_search_query TEXT;
ALTER TABLE roadmap_items ADD COLUMN IF NOT EXISTS article_links TEXT;
ALTER TABLE roadmap_items ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE;
