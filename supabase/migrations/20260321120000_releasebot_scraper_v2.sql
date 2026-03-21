-- ── Releasebot Scraper V2: better dedup + source URLs ──

-- Add releasebot_entry_id for stable deduplication (Releasebot's unique integer ID)
ALTER TABLE public.timeline_entries ADD COLUMN IF NOT EXISTS releasebot_entry_id INTEGER;

-- Add source_url for linking back to the original release page
ALTER TABLE public.timeline_entries ADD COLUMN IF NOT EXISTS source_url TEXT;

-- Unique index: one releasebot entry per card (prevents duplicate imports)
CREATE UNIQUE INDEX IF NOT EXISTS idx_timeline_releasebot_dedup
  ON public.timeline_entries(card_id, releasebot_entry_id)
  WHERE releasebot_entry_id IS NOT NULL;

-- ── Seed releasebot_slug on verified cards ──
UPDATE public.cards SET releasebot_slug = 'openai'      WHERE slug = 'chatgpt-openai';
UPDATE public.cards SET releasebot_slug = 'anthropic'    WHERE slug = 'claude-anthropic';
UPDATE public.cards SET releasebot_slug = 'google'       WHERE slug = 'gemini-google';
UPDATE public.cards SET releasebot_slug = 'deepseek'     WHERE slug = 'deepseek';
UPDATE public.cards SET releasebot_slug = 'xai'          WHERE slug = 'grok-xai';
UPDATE public.cards SET releasebot_slug = 'mistral'      WHERE slug = 'mistral';
UPDATE public.cards SET releasebot_slug = 'cursor'       WHERE slug = 'cursor';
UPDATE public.cards SET releasebot_slug = 'midjourney'   WHERE slug = 'midjourney';
UPDATE public.cards SET releasebot_slug = 'eleven-labs'  WHERE slug = 'elevenlabs';
UPDATE public.cards SET releasebot_slug = 'runway'       WHERE slug = 'runway';
UPDATE public.cards SET releasebot_slug = 'notion'       WHERE slug = 'notion-ai';
UPDATE public.cards SET releasebot_slug = 'replit'       WHERE slug = 'replit';
UPDATE public.cards SET releasebot_slug = 'cohere'       WHERE slug = 'cohere';
