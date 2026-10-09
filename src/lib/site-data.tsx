import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { CatalogSet } from "@/lib/catalog-data";

export type Override = { slug: string; price: number | null; name: string | null; description: string | null; pieces: string | null; hidden: boolean };

export function useOverrides() {
  return useQuery({
    queryKey: ["overrides"],
    queryFn: async () => {
      const { data, error } = await supabase.from("set_overrides").select("slug,price,name,description,pieces,hidden");
      if (error) throw error;
      return Object.fromEntries((data ?? []).map((o) => [o.slug, o as Override])) as Record<string, Override>;
    },
    staleTime: 60_000,
  });
}

export function useSiteTexts() {
  return useQuery({
    queryKey: ["site_texts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_texts").select("key,value");
      if (error) throw error;
      return Object.fromEntries((data ?? []).map((r) => [r.key, r.value])) as Record<string, string>;
    },
    staleTime: 60_000,
  });
}

export function applyOverride<T extends CatalogSet & { description?: string }>(s: T, o?: Override): T {
  if (!o) return s;
  return {
    ...s,
    price: o.price ?? s.price,
    name: o.name || s.name,
    pieces: o.pieces || s.pieces,
    ...(o.description ? { description: o.description } : {}),
  };
}

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const qc = useQueryClient();
  useEffect(() => {
    const check = async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return setIsAdmin(false);
      const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      setIsAdmin(!!data);
    };
    void check();
    const { data: sub } = supabase.auth.onAuthStateChange((e) => {
      if (e === "SIGNED_IN" || e === "SIGNED_OUT") { void check(); void qc.invalidateQueries(); }
    });
    return () => sub.subscription.unsubscribe();
  }, [qc]);
  return isAdmin;
}
