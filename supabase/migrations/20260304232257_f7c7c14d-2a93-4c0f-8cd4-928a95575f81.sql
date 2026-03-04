
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Public access to cards" ON public.cards;
DROP POLICY IF EXISTS "Public access to sub_products" ON public.sub_products;
DROP POLICY IF EXISTS "Public access to timeline_entries" ON public.timeline_entries;

-- Cards: anyone can read, only authenticated can write
CREATE POLICY "Anyone can read cards" ON public.cards FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert cards" ON public.cards FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update cards" ON public.cards FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete cards" ON public.cards FOR DELETE TO authenticated USING (true);

-- Sub_products: anyone can read, only authenticated can write
CREATE POLICY "Anyone can read sub_products" ON public.sub_products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert sub_products" ON public.sub_products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update sub_products" ON public.sub_products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete sub_products" ON public.sub_products FOR DELETE TO authenticated USING (true);

-- Timeline_entries: anyone can read, only authenticated can write
CREATE POLICY "Anyone can read timeline_entries" ON public.timeline_entries FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert timeline_entries" ON public.timeline_entries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update timeline_entries" ON public.timeline_entries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete timeline_entries" ON public.timeline_entries FOR DELETE TO authenticated USING (true);
