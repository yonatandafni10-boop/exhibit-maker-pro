import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { catalogSets } from "@/lib/catalog-data";
import { BrickStrip, Logo, ThemeBadge, formatPrice, themeOf } from "@/components/brick";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BRICKYARD — קטלוג סטי לגו" },
      { name: "description", content: "קטלוג סטי לגו אמיתיים: תמונות, גילאים, מספר חלקים ומחירים." },
      { property: "og:title", content: "BRICKYARD — קטלוג סטי לגו" },
      { property: "og:description", content: "קטלוג סטי לגו אמיתיים: תמונות, גילאים, מספר חלקים ומחירים." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Sort = "pieces-asc" | "pieces-desc" | "price-asc" | "price-desc";

function Index() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("pieces-asc");
  const total = catalogSets.reduce((a, s) => a + (Number(s.pieces) || 0), 0);

  const list = useMemo(() => {
    const f = catalogSets.filter(
      (s) => s.name.toLowerCase().includes(q.toLowerCase()) || themeOf(s.name).toLowerCase().includes(q.toLowerCase()),
    );
    const key = (s: (typeof f)[number]) => (sort.startsWith("pieces") ? Number(s.pieces) || 0 : s.price ?? 0);
    return [...f].sort((a, b) => (sort.endsWith("asc") ? key(a) - key(b) : key(b) - key(a)));
  }, [q, sort]);

  return (
    <div dir="rtl" className="studs-bg min-h-screen text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Logo />

        <section className="mt-10 grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              כל לבנה,
              <br />
              נספרת.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              קטלוג סטי לגו אמיתיים — מספר חלקים, גילאים ומחירים של כל סט, במקום אחד.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">חלקים בכל הקטלוג</p>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-6xl font-black text-brick-red">{total.toLocaleString("he-IL")}</span>
              <span className="pb-2 text-xs font-bold tracking-widest text-muted-foreground">חלקים בסך הכל</span>
            </div>
            <div className="mt-4"><BrickStrip /></div>
            <p className="mt-4 text-sm text-muted-foreground">ב-{catalogSets.length} סטים שונים.</p>
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חיפוש לפי שם סט או סדרה..."
            className="flex-1 rounded-2xl border border-border bg-card px-5 py-3.5 outline-none focus:ring-2 focus:ring-ring"
          />
          <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3">
            <span className="text-xs font-bold tracking-widest text-muted-foreground">מיון</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="bg-transparent font-medium outline-none">
              <option value="pieces-asc">חלקים: מהקטן לגדול</option>
              <option value="pieces-desc">חלקים: מהגדול לקטן</option>
              <option value="price-asc">מחיר: מהזול ליקר</option>
              <option value="price-desc">מחיר: מהיקר לזול</option>
            </select>
          </label>
        </div>

        <div className="mt-10 flex items-baseline justify-between">
          <h2 className="text-2xl font-black">הקטלוג</h2>
          <span className="text-xs font-bold tracking-widest text-muted-foreground">{list.length} סטים</span>
        </div>

        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <Link
              key={s.slug}
              to="/sets/$slug"
              params={{ slug: s.slug }}
              className="group flex flex-col rounded-3xl border border-border bg-card p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
                <img src={s.image} alt={s.name} loading="lazy" className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute right-3 top-3"><ThemeBadge name={s.name} /></div>
              </div>
              <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                <h3 className="text-lg font-bold leading-snug">{s.name}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.age && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">גיל {s.age}</span>}
                  {s.price != null && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">{formatPrice(s.price)}</span>}
                </div>
                <div className="mt-auto border-t border-border pt-4">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black">{(Number(s.pieces) || 0).toLocaleString("he-IL")}</span>
                    <span className="pb-1 text-xs font-bold tracking-widest text-muted-foreground">חלקים</span>
                  </div>
                  <div className="mt-3"><BrickStrip /></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
