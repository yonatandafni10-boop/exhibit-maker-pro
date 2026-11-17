DROP POLICY IF EXISTS "public read texts" ON public.site_texts;
CREATE POLICY "public read homepage texts" ON public.site_texts FOR SELECT TO anon, authenticated
USING (key IN ('heroA','heroB','heroSub'));

DROP POLICY IF EXISTS "public read overrides" ON public.set_overrides;
CREATE POLICY "public read catalog overrides" ON public.set_overrides FOR SELECT TO anon, authenticated
USING (slug ~ '^[A-Za-z0-9._-]{1,200}$');