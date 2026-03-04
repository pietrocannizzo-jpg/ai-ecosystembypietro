
-- Create cards table
CREATE TABLE public.cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT DEFAULT '',
  category TEXT NOT NULL,
  subcategory TEXT DEFAULT '',
  color TEXT NOT NULL DEFAULT '#6366f1',
  summary TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  links TEXT[] DEFAULT '{}',
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sub_products table
CREATE TABLE public.sub_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '',
  description TEXT DEFAULT '',
  release_date TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create timeline_entries table
CREATE TABLE public.timeline_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  entry_type TEXT DEFAULT 'update',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sticky_notes table
CREATE TABLE public.sticky_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT DEFAULT '',
  color TEXT DEFAULT 'yellow',
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create canvas_state table (single row for persisting view)
CREATE TABLE public.canvas_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zoom FLOAT DEFAULT 1,
  pan_x FLOAT DEFAULT 0,
  pan_y FLOAT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sticky_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canvas_state ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (personal knowledge board, no auth required initially)
CREATE POLICY "Public access to cards" ON public.cards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to sub_products" ON public.sub_products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to timeline_entries" ON public.timeline_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to sticky_notes" ON public.sticky_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to canvas_state" ON public.canvas_state FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_sub_products_card_id ON public.sub_products(card_id);
CREATE INDEX idx_timeline_entries_card_id ON public.timeline_entries(card_id);
CREATE INDEX idx_cards_category ON public.cards(category);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON public.cards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sticky_notes_updated_at BEFORE UPDATE ON public.sticky_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_canvas_state_updated_at BEFORE UPDATE ON public.canvas_state FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
