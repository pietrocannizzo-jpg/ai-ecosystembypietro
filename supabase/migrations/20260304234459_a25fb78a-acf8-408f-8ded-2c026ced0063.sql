CREATE TABLE public.tool_deep_dives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tool_deep_dives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read deep dives" ON public.tool_deep_dives
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users can insert deep dives" ON public.tool_deep_dives
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update deep dives" ON public.tool_deep_dives
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);