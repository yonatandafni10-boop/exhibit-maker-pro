import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { catalogSets } from "@/lib/catalog-data";
import { SiteHeader } from "@/components/site-header";
import { useIsAdmin, useOverrides, useSiteTexts } from "@/lib/site-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "ניהול — BRICKYARD" },
    { name: "description", content: "כניסת בעל האתר לניהול קטלוג BRICKYARD." },
    { property: "og:title", content: "ניהול — BRICKYARD" },
    { property: "og:description", content: "כניסת בעל האתר לניהול קטלוג BRICKYARD." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AdminPage,
});

const TEXT_KEYS = [["heroA", "כותרת שורה 1"], ["heroB", "כותרת שורה 2"], ["heroSub", "תיאור מתחת לכותרת"]] as const;

function AdminPage() {
  const isAdmin = useIsAdmin();
  const qc = useQueryClient();
  const { data: ov } = useOverrides();
  const { data: texts } = useSiteTexts();
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const list = useMemo(() => catalogSets.filter((s) => s.name.toLowerCase().includes(q.toLowerCase())).slice(0, 30), [q]);

  const signIn = async () => { await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/admin" }); };

  if (!isAdmin) {
    return (
      <div dir="rtl" className="studs-bg grid min-h-screen place-items-center p-6 text-center">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-black">כניסת מנהל</h1>
          <p className="mt-2 text-sm text-muted-foreground">רק לבעל האתר</p>
          <button onClick={signIn} className="mt-5 rounded-full bg-brick-red px-6 py-3 font-black text-primary-foreground">כניסה עם Google</button>
        </div>
      </div>
    );
  }

  const saveSet = async (slug: string, f: FormData) => {
    const p = String(f.get("price") || "");
    const row = { slug, price: p ? Number(p) : null, name: String(f.get("name") || "") || null, pieces: String(f.get("pieces") || "") || null, description: String(f.get("description") || "") || null, hidden: f.get("hidden") === "on", updated_at: new Date().toISOString() };
    const { error } = await supabase.from("set_overrides").upsert(row);
    setMsg(error ? "שגיאה בשמירה" : "נשמר ✓"); void qc.invalidateQueries({ queryKey: ["overrides"] });
  };
  const saveTexts = async (f: FormData) => {
    const rows = TEXT_KEYS.map(([k]) => ({ key: k, value: String(f.get(k) || "") })).filter((r) => r.value);
    const { error } = await supabase.from("site_texts").upsert(rows);
    setMsg(error ? "שגיאה בשמירה" : "נשמר ✓"); void qc.invalidateQueries({ queryKey: ["site_texts"] });
  };
  const inp = "w-full rounded-xl border-2 border-border bg-card px-3 py-2 text-sm";

  return (
    <div dir="rtl" className="studs-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <SiteHeader back />
        <div className="mt-6 flex items-center justify-between">
          <h1 className="text-3xl font-black">עיצוב ועריכת האתר</h1>
          <button onClick={() => supabase.auth.signOut()} className="text-sm font-bold text-brick-blue">יציאה</button>
        </div>
        {msg && <p className="mt-2 font-bold text-brick-green">{msg}</p>}

        <form onSubmit={(e) => { e.preventDefault(); void saveTexts(new FormData(e.currentTarget)); }} className="mt-6 grid gap-3 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-lg font-black">טקסטים בדף הבית</h2>
          {TEXT_KEYS.map(([k, l]) => (
            <label key={k} className="text-xs font-bold">{l}<input name={k} defaultValue={texts?.[k] ?? ""} className={inp} /></label>
          ))}
          <button className="rounded-2xl bg-brick-red py-3 font-black text-primary-foreground">שמור</button>
        </form>

        <div className="mt-6 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-lg font-black">סטים (מחיר, שם, חלקים, הסתרה)</h2>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש סט..." className={`${inp} mt-3`} />
          <div className="mt-4 flex flex-col gap-4">
            {list.map((s) => {
              const o = ov?.[s.slug];
              return (
                <form key={s.slug + (o?.slug ?? "")} onSubmit={(e) => { e.preventDefault(); void saveSet(s.slug, new FormData(e.currentTarget)); }} className="grid gap-2 rounded-2xl border border-border p-3 sm:grid-cols-[64px_1fr]">
                  <img src={s.image} alt="" className="h-16 w-16 object-contain" />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input name="name" defaultValue={o?.name ?? ""} placeholder={s.name} className={`${inp} sm:col-span-2`} />
                    <input name="price" type="number" step="0.01" defaultValue={o?.price ?? ""} placeholder={`מחיר ₪ (${s.price})`} className={inp} />
                    <input name="pieces" defaultValue={o?.pieces ?? ""} placeholder={`חלקים (${s.pieces || "—"})`} className={inp} />
                    <textarea name="description" defaultValue={o?.description ?? ""} placeholder="תיאור (לא חובה)" className={`${inp} sm:col-span-2`} />
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="hidden" defaultChecked={o?.hidden} /> הסתר מהאתר</label>
                    <button className="rounded-xl bg-brick-red py-2 font-black text-primary-foreground">שמור</button>
                  </div>
                </form>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
