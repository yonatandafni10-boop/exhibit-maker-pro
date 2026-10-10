import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { catalogSets } from "@/lib/catalog-data";
import { BrickStrip, ThemeBadge, themeOf } from "@/components/brick";
import { SiteHeader } from "@/components/site-header";
import { useI18n } from "@/lib/i18n";
import { applyOverride, useOverrides, useSiteTexts } from "@/lib/site-data";
import shareImage from "@/assets/brickyard-share-he.jpg.asset.json";

const shareImageUrl = new URL(shareImage.url, "https://exhibit-maker-pro.lovable.app").href;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BRICKYARD — כל סטי הלגו במקום אחד" },
      { name: "description", content: "קטלוג של כל סטי הלגו בישראל: תמונות, גילאים, מספר חלקים ומחירים." },
      { property: "og:title", content: "BRICKYARD — כל סטי הלגו במקום אחד" },
      { property: "og:description", content: "קטלוג של כל סטי הלגו בישראל: תמונות, גילאים, מספר חלקים ומחירים." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: shareImageUrl },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1376" },
      { property: "og:image:height", content: "768" },
      { property: "og:image:alt", content: "BRICKYARD — כל סוגי הלגו — חדש ומקורי" },
      { name: "twitter:image", content: shareImageUrl },
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
  const { t, price, dir, lang } = useI18n();
  const { data: ov } = useOverrides();
  const { data: texts } = useSiteTexts();
  const tx = (k: string) => (lang === "he" && texts?.[k]) || t(k);
  const all = useMemo(() => catalogSets.filter((s) => !ov?.[s.slug]?.hidden).map((s) => applyOverride(s, ov?.[s.slug])), [ov]);
  const inStockCount = all.filter((s) => s.available).length;
  const n = (x: number) => x.toLocaleString();

  const list = useMemo(() => {
    const ql = q.toLowerCase();
    const f = all.filter(
      (s) => (!inStock || s.available) && (s.name.toLowerCase().includes(ql) || themeOf(s.name).toLowerCase().includes(ql)),
    );
    if (sort === "default") return f;
    const key = (s: (typeof f)[number]) => (sort === "pieces-desc" ? Number(s.pieces) || 0 : s.price);
    return [...f].sort((a, b) => (sort === "price-asc" ? key(a) - key(b) : key(b) - key(a)));
  }, [q, sort, inStock, all]);

  const reset = () => setShown(PAGE);

  return (
    <div dir={dir} className="studs-bg min-h-screen text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <SiteHeader />

        <section className="mt-10 grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              {tx("heroA")}
              <br />
              {tx("heroB")}
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              {tx("heroSub")}
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{t("inCatalog")}</p>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-6xl font-black text-brick-red">{n(all.length)}</span>
              <span className="pb-2 text-xs font-bold tracking-widest text-muted-foreground">{t("sets")}</span>
            </div>
            <div className="mt-4"><BrickStrip /></div>
            <p className="mt-4 text-sm text-muted-foreground">{n(inStockCount)} {t("inStockNow")}</p>
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); reset(); }}
            placeholder={t("search")}
            className="flex-1 rounded-2xl border border-border bg-card px-5 py-3.5 outline-none focus:ring-2 focus:ring-ring"
          />
          <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3">
            <span className="text-xs font-bold tracking-widest text-muted-foreground">{t("sort")}</span>
            <select value={sort} onChange={(e) => { setSort(e.target.value as Sort); reset(); }} className="bg-transparent font-medium outline-none">
              <option value="default">{t("newest")}</option>
              <option value="price-asc">{t("priceAsc")}</option>
              <option value="price-desc">{t("priceDesc")}</option>
              <option value="pieces-desc">{t("mostPieces")}</option>
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-sm font-medium">
            <input type="checkbox" checked={inStock} onChange={(e) => { setInStock(e.target.checked); reset(); }} />
            {t("onlyStock")}
          </label>
        </div>

        <div className="mt-10 flex items-baseline justify-between">
          <h2 className="text-2xl font-black">{t("catalog")}</h2>
          <span className="text-xs font-bold tracking-widest text-muted-foreground">{n(list.length)} {t("sets")}</span>
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
                <div className="absolute end-3 top-3"><ThemeBadge name={s.name} /></div>
              </div>
              <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                <h3 className="text-lg font-bold leading-snug">{s.name}</h3>
                {s.price != null && <div className="mt-1.5 text-xl font-black text-brick-red">{price(s.price)}</div>}
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.age && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{t("age")} {s.age}</span>}
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{s.pieces ? `${n(Number(s.pieces))} ${t("pieces")}` : `${t("pieces")}: ${t("noPieces")}`}</span>
                  {!s.available && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{t("soldOut")}</span>}
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
              {t("more")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
