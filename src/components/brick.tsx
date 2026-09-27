const colors = ["bg-brick-red", "bg-brick-blue", "bg-brick-yellow", "bg-brick-green", "bg-brick-orange"];

export function BrickStrip({ count = 12 }: { count?: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={`h-2.5 flex-1 rounded-sm ${colors[i % colors.length]}`} />
      ))}
    </div>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-card p-2 shadow-sm">
        <span className="h-3 w-3 rounded-sm bg-brick-red" />
        <span className="h-3 w-3 rounded-sm bg-brick-yellow" />
        <span className="h-3 w-3 rounded-sm bg-brick-blue" />
        <span className="h-3 w-3 rounded-sm bg-brick-green" />
      </div>
      <span className="text-xl font-black tracking-tight">BRICKYARD</span>
    </div>
  );
}

const badgeColors = [
  "bg-brick-red text-primary-foreground",
  "bg-brick-blue text-primary-foreground",
  "bg-brick-green text-primary-foreground",
  "bg-brick-orange text-primary-foreground",
  "bg-brick-yellow text-foreground",
];

export function themeOf(name: string): string {
  const themes = ["NINJAGO", "Icons", "Marvel", "Batman", "BrickHeadz", "Harry Potter", "Technic", "Disney", "DISNEY", "Ideas", "Art", "Minifigures", "Editions", "DC"];
  for (const t of themes) if (name.includes(t)) return t === "DISNEY" ? "Disney" : t;
  return "LEGO";
}

export function ThemeBadge({ name }: { name: string }) {
  const t = themeOf(name);
  const c = badgeColors[[...t].reduce((a, ch) => a + ch.charCodeAt(0), 0) % badgeColors.length];
  return <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase shadow-sm ${c}`}>{t}</span>;
}

export const formatPrice = (p: number | null) =>
  p == null ? "" : `₪${p.toLocaleString("he-IL", { maximumFractionDigits: 2 })}`;
