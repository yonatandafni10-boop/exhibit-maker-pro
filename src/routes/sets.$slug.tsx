import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { catalogSets } from "@/lib/catalog-data";
import { BrickStrip, Logo, ThemeBadge, formatPrice } from "@/components/brick";

export const Route = createFileRoute("/sets/$slug")({
  loader: ({ params }) => {
    const set = catalogSets.find((s) => s.slug === params.slug);
    if (!set) throw notFound();
    return { set };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "הסט לא נמצא — BRICKYARD" }, { name: "robots", content: "noindex" }] };
    const { set } = loaderData;
    const desc = set.description.slice(0, 155) || `${set.name} — ${set.pieces} חלקים`;
    return {
      meta: [
        { title: `${set.name} — BRICKYARD` },
        { name: "description", content: desc },
        { property: "og:title", content: `${set.name} — BRICKYARD` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:image", content: set.image },
        { name: "twitter:image", content: set.image },
      ],
    };
  },
  notFoundComponent: SetNotFound,
  component: SetPage,
});

function SetNotFound() {
  return (
    <div dir="rtl" className="studs-bg grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="text-3xl font-black">הסט לא נמצא</h1>
        <Link to="/" className="mt-4 inline-block font-bold text-brick-blue">חזרה לקטלוג</Link>
      </div>
    </div>
  );
}

function SetPage() {
  const { set } = Route.useLoaderData();
  const images = set.images.length ? set.images : [set.image];
  const [active, setActive] = useState(images[0]);

  return (
    <div dir="rtl" className="studs-bg min-h-screen text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-between">
          <Link to="/"><Logo /></Link>
          <Link to="/" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-bold shadow-sm">→ חזרה לקטלוג</Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm">
              <img src={active} alt={set.name} className="h-full w-full object-contain" />
              <div className="absolute right-4 top-4"><ThemeBadge name={set.name} /></div>
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-6 gap-2">
                {images.map((img) => (
                  <button
                    key={img}
                    onClick={() => setActive(img)}
                    className={`aspect-square overflow-hidden rounded-xl border-2 bg-card p-1 ${active === img ? "border-brick-red" : "border-border"}`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-black leading-tight md:text-4xl">{set.name}</h1>
            {set.price != null && <div className="text-4xl font-black text-brick-red">{formatPrice(set.price)}</div>}

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-end gap-3">
                <span className="text-6xl font-black">{(Number(set.pieces) || 0).toLocaleString("he-IL")}</span>
                <span className="pb-2 text-xs font-bold tracking-widest text-muted-foreground">חלקים</span>
              </div>
              <div className="mt-4"><BrickStrip /></div>
              {set.age && (
                <div className="mt-4 flex gap-2">
                  <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">גיל {set.age}</span>
                </div>
              )}
            </div>

            {set.description && (
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-3 text-lg font-black">על הסט</h2>
                <p className="leading-relaxed text-muted-foreground">{set.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
