
-- Fix cards policies: drop restrictive, recreate as permissive
DROP POLICY IF EXISTS "Anyone can read cards" ON public.cards;
DROP POLICY IF EXISTS "Authenticated users can delete cards" ON public.cards;
DROP POLICY IF EXISTS "Authenticated users can insert cards" ON public.cards;
DROP POLICY IF EXISTS "Authenticated users can update cards" ON public.cards;

CREATE POLICY "Anyone can read cards" ON public.cards FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert cards" ON public.cards FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update cards" ON public.cards FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete cards" ON public.cards FOR DELETE TO authenticated USING (true);

-- Fix sub_products policies
DROP POLICY IF EXISTS "Anyone can read sub_products" ON public.sub_products;
DROP POLICY IF EXISTS "Authenticated users can delete sub_products" ON public.sub_products;
DROP POLICY IF EXISTS "Authenticated users can insert sub_products" ON public.sub_products;
DROP POLICY IF EXISTS "Authenticated users can update sub_products" ON public.sub_products;

CREATE POLICY "Anyone can read sub_products" ON public.sub_products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert sub_products" ON public.sub_products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update sub_products" ON public.sub_products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete sub_products" ON public.sub_products FOR DELETE TO authenticated USING (true);

-- Fix timeline_entries policies
DROP POLICY IF EXISTS "Anyone can read timeline_entries" ON public.timeline_entries;
DROP POLICY IF EXISTS "Authenticated users can delete timeline_entries" ON public.timeline_entries;
DROP POLICY IF EXISTS "Authenticated users can insert timeline_entries" ON public.timeline_entries;
DROP POLICY IF EXISTS "Authenticated users can update timeline_entries" ON public.timeline_entries;

CREATE POLICY "Anyone can read timeline_entries" ON public.timeline_entries FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert timeline_entries" ON public.timeline_entries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update timeline_entries" ON public.timeline_entries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete timeline_entries" ON public.timeline_entries FOR DELETE TO authenticated USING (true);

-- Fix tool_deep_dives policies
DROP POLICY IF EXISTS "Anyone can read deep dives" ON public.tool_deep_dives;
DROP POLICY IF EXISTS "Authenticated users can insert deep dives" ON public.tool_deep_dives;
DROP POLICY IF EXISTS "Authenticated users can update deep dives" ON public.tool_deep_dives;

CREATE POLICY "Anyone can read deep dives" ON public.tool_deep_dives FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert deep dives" ON public.tool_deep_dives FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update deep dives" ON public.tool_deep_dives FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Fix canvas_state and sticky_notes
DROP POLICY IF EXISTS "Public access to canvas_state" ON public.canvas_state;
CREATE POLICY "Public access to canvas_state" ON public.canvas_state FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to sticky_notes" ON public.sticky_notes;
CREATE POLICY "Public access to sticky_notes" ON public.sticky_notes FOR ALL USING (true) WITH CHECK (true);
