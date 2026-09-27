import { createFileRoute } from "@tanstack/react-router";
import { catalogSets } from "@/lib/catalog-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "הקטלוג — סטי לגו אמיתיים מהחנות המורשית" },
      {
        name: "description",
        content:
          "קטלוג סטי לגו אמיתיים: NINJAGO, Batman, Harry Potter, Technic, Icons ועוד — עם תמונות, גילאים ומספר חלקים. ללא מחירים.",
      },
      { property: "og:title", content: "הקטלוג — סטי לגו אמיתיים מהחנות המורשית" },
      {
        property: "og:description",
        content:
          "קטלוג סטי לגו אמיתיים: NINJAGO, Batman, Harry Potter, Technic, Icons ועוד — עם תמונות, גילאים ומספר חלקים.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function themeOf(name: string): string {
  const themes = [
    "NINJAGO", "Icons", "Marvel", "Batman", "BrickHeadz", "Harry Potter",
    "Technic", "Disney", "DISNEY", "Ideas", "Art", "Minifigures", "Editions", "DC",
  ];
  for (const t of themes) {
    if (name.includes(t)) return t === "DISNEY" ? "Disney" : t;
  }
  return "LEGO";
}

function Index() {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">הקטלוג</h1>
            <p className="text-sm text-muted-foreground">
              {catalogSets.length} סטים אמיתיים מהחנות המורשית של לגו בישראל
            </p>
          </div>
          <span className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
            LEGO®‎
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {catalogSets.map((set) => (
            <a
              key={set.url}
              href={set.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden bg-secondary">
                <img
                  src={set.image}
                  alt={set.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <span className="w-fit rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                  {themeOf(set.name)}
                </span>
                <h2 className="text-sm font-bold leading-snug">{set.name}</h2>
                <div className="mt-auto flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                  {set.age && (
                    <span>
                      גיל <strong className="text-foreground">{set.age}</strong>
                    </span>
                  )}
                  {set.pieces && (
                    <span>
                      <strong className="text-foreground">
                        {Number(set.pieces).toLocaleString("he-IL")}
                      </strong>{" "}
                      חלקים
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-muted-foreground">
          LEGO®‎ היא סימן מסחרי של קבוצת LEGO. האתר מציג מידע בלבד, ללא מחירים
          וללא מכירה.
        </div>
      </footer>
    </div>
  );
}
