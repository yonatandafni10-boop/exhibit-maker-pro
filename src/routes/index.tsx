import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { catalogSets } from "@/lib/catalog-data";
import { BrickStrip, Logo, ThemeBadge, formatPrice, themeOf } from "@/components/brick";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BRICKYARD — כל סטי הלגו במקום אחד" },
      { name: "description", content: "קטלוג של כל סטי הלגו בישראל: תמונות, גילאים, מספר חלקים ומחירים." },
      { property: "og:title", content: "BRICKYARD — כל סטי הלגו במקום אחד" },
      { property: "og:description", content: "קטלוג של כל סטי הלגו בישראל: תמונות, גילאים, מספר חלקים ומחירים." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Sort = "default" | "price-asc" | "price-desc" | "pieces-desc";
const PAGE = 48;

function Index() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("default");
  const [inStock, setInStock] = useState(true);
  const [shown, setShown] = useState(PAGE);
  const inStockCount = catalogSets.filter((s) => s.available).length;

  const list = useMemo(() => {
    const ql = q.toLowerCase();
    const f = catalogSets.filter(
      (s) => (!inStock || s.available) && (s.name.toLowerCase().includes(ql) || themeOf(s.name).toLowerCase().includes(ql)),
    );
    if (sort === "default") return f;
    const key = (s: (typeof f)[number]) => (sort === "pieces-desc" ? Number(s.pieces) || 0 : s.price);
    return [...f].sort((a, b) => (sort === "price-asc" ? key(a) - key(b) : key(b) - key(a)));
  }, [q, sort, inStock]);

  const reset = () => setShown(PAGE);

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
              כל סטי הלגו במקום אחד — תמונות, גילאים ומחירים של כל סט.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">סטים בקטלוג</p>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-6xl font-black text-brick-red">{catalogSets.length.toLocaleString("he-IL")}</span>
              <span className="pb-2 text-xs font-bold tracking-widest text-muted-foreground">סטים</span>
            </div>
            <div className="mt-4"><BrickStrip /></div>
            <p className="mt-4 text-sm text-muted-foreground">{inStockCount.toLocaleString("he-IL")} מהם זמינים במלאי עכשיו.</p>
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); reset(); }}
            placeholder="חיפוש לפי שם סט, מספר או סדרה..."
            className="flex-1 rounded-2xl border border-border bg-card px-5 py-3.5 outline-none focus:ring-2 focus:ring-ring"
          />
          <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3">
            <span className="text-xs font-bold tracking-widest text-muted-foreground">מיון</span>
            <select value={sort} onChange={(e) => { setSort(e.target.value as Sort); reset(); }} className="bg-transparent font-medium outline-none">
              <option value="default">חדשים</option>
              <option value="price-asc">מחיר: מהזול ליקר</option>
              <option value="price-desc">מחיר: מהיקר לזול</option>
              <option value="pieces-desc">הכי הרבה חלקים</option>
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-sm font-medium">
            <input type="checkbox" checked={inStock} onChange={(e) => { setInStock(e.target.checked); reset(); }} />
            רק במלאי
          </label>
        </div>

        <div className="mt-10 flex items-baseline justify-between">
          <h2 className="text-2xl font-black">הקטלוג</h2>
          <span className="text-xs font-bold tracking-widest text-muted-foreground">{list.length.toLocaleString("he-IL")} סטים</span>
        </div>

        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.slice(0, shown).map((s) => (
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
                {s.price != null && <div className="mt-1.5 text-xl font-black text-brick-red">{formatPrice(s.price)}</div>}
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.age && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">גיל {s.age}</span>}
                  {s.pieces && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{Number(s.pieces).toLocaleString("he-IL")} חלקים</span>}
                  {!s.available && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">אזל</span>}
                </div>
                <div className="mt-auto pt-4"><BrickStrip /></div>
              </div>
            </Link>
          ))}
        </div>

        {shown < list.length && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShown((n) => n + PAGE)}
              className="rounded-full bg-brick-red px-8 py-3 font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              הצג עוד סטים
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
