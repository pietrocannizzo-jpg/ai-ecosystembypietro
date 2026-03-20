
-- Add releasebot_slug column to cards for mapping to releasebot.io/updates/{slug}
ALTER TABLE public.cards ADD COLUMN releasebot_slug text;

-- Index for quick lookups
CREATE INDEX idx_cards_releasebot_slug ON public.cards(releasebot_slug) WHERE releasebot_slug IS NOT NULL;
