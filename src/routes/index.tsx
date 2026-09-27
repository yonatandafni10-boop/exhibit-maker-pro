import { createFileRoute } from "@tanstack/react-router";

import oldtownMain from "@/assets/oldtown-main.png";
import oldtown2 from "@/assets/oldtown-2.png";
import oldtown3 from "@/assets/oldtown-3.png";
import oldtown4 from "@/assets/oldtown-4.png";
import oldtownModules from "@/assets/oldtown-modules.jpg";
import oldtownMinifigs from "@/assets/oldtown-minifigs.jpg";
import oldtownDetails from "@/assets/oldtown-details.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "לגו NINJAGO® — העיר העתיקה, מהדורת חגיגות 15 שנה (71861)" },
      {
        name: "description",
        content:
          "סט הבנייה LEGO® NINJAGO® העיר העתיקה — מהדורת חגיגות 15 שנה (71861): 4,851 חלקים, 23 מיני-דמויות ו-4 מודולים מתחברים. לגילאי 14+.",
      },
      { property: "og:title", content: "לגו NINJAGO® — העיר העתיקה, מהדורת חגיגות 15 שנה (71861)" },
      {
        property: "og:description",
        content:
          "חגגו 15 שנה לסדרת הטלוויזיה LEGO® NINJAGO® עם סט העיר העתיקה: 4,851 חלקים, 23 מיני-דמויות ו-4 מודולים מתחברים.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const specs = [
  { label: "מק״ט", value: "71861" },
  { label: "גיל", value: "14+" },
  { label: "חלקים", value: "4,851" },
  { label: "מיני-דמויות", value: "23" },
];

const gallery = [
  { src: oldtownMain, alt: "סט הבנייה של העיר העתיקה — מבט קדמי" },
  { src: oldtown2, alt: "העיר העתיקה — מבט על המודולים" },
  { src: oldtown3, alt: "העיר העתיקה — פרטי הבניינים" },
  { src: oldtown4, alt: "העיר העתיקה — מבט נוסף" },
];

const features = [
  {
    src: oldtownModules,
    alt: "4 מודולים של בניינים מתחברים",
    title: "4 מודולים של בניינים מתחברים",
    text: "שער קדמי, סניף דואר ובית מלאכה, מגדל ונקודת תצפית — אפשר לחבר במעגל, לסדר מחדש בקו או לשחק בכל מודול בנפרד. בתצוגה אופקית הסט משתרע על רוחב של מעל 100 ס״מ.",
  },
  {
    src: oldtownMinifigs,
    alt: "23 מיני-דמויות של NINJAGO",
    title: "23 מיני-דמויות של NINJAGO®‎",
    text: "הסט שופע ב-23 מיני-דמויות מההיסטוריה של תוכנית הטלוויזיה, כולל 3 דמויות אספנות על מעמד.",
  },
  {
    src: oldtownDetails,
    alt: "פרטים נוסטלגיים בסט",
    title: "פרטים נוסטלגיים",
    text: "כולל עגורן עובד, עגלת תה, חנות חפצי עץ, פרטי רכוש של נינג׳ה ומחבוא סודי.",
  },
];

function Index() {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight">הקטלוג שלנו</span>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            NINJAGO®‎
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        {/* Product intro */}
        <section className="grid gap-10 py-14 md:grid-cols-2 md:items-center">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <img
              src={oldtownMain}
              alt="לגו NINJAGO®‎ — העיר העתיקה, מהדורת חגיגות 15 שנה (71861)"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              מהדורת חגיגות 15 שנה · סט 71861
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              לגו NINJAGO®‎ — העיר העתיקה
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              חגגו 15 שנה לתוכנית הטלוויזיה LEGO®‎ NINJAGO®‎ עם סט הבנייה המדהים
              של העיר העתיקה. הסט כולל 4 מודולים שניתן לחבר במעגל, לסדר מחדש
              בקו או לשחק בנפרד — עם מתקן אומגה, עגלת תה, חנות חפצי עץ, פרטי
              רכוש של נינג׳ה ומחבוא סודי.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-xl border border-border bg-card p-4 text-center"
                >
                  <dt className="text-xs font-medium text-muted-foreground">
                    {spec.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold">{spec.value}</dd>
                </div>
              ))}
            </dl>
            <a
              href="https://www.lego.com/en-us/service/building-instructions/71861"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              הוראות בנייה רשמיות
            </a>
          </div>
        </section>

        {/* Gallery */}
        <section className="border-t border-border py-14">
          <h2 className="text-2xl font-bold tracking-tight">גלריית תמונות</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((img) => (
              <figure
                key={img.alt}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </figure>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border py-14">
          <h2 className="text-2xl font-bold tracking-tight">מה יש בסט?</h2>
          <div className="mt-8 space-y-12">
            {features.map((feature, i) => (
              <article
                key={feature.title}
                className={`grid items-center gap-8 md:grid-cols-2 ${
                  i % 2 === 1 ? "md:[&>figure]:order-2" : ""
                }`}
              >
                <figure className="overflow-hidden rounded-2xl border border-border bg-card">
                  <img
                    src={feature.src}
                    alt={feature.alt}
                    loading="lazy"
                    className="w-full object-cover"
                  />
                </figure>
                <div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {feature.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Builder app note */}
        <section className="border-t border-border py-14">
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-bold">
              הוראות בנייה תלת-ממדיות ואינטראקטיביות
            </h2>
            <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              בונים יכולים לקרב ולסובב את הסט בתצוגה תלת-ממדית ולעקוב אחר
              ההתקדמות שלהם בעזרת אפליקציית LEGO®‎ Builder האינטואיטיבית.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-muted-foreground">
          LEGO®‎ ו-NINJAGO®‎ הם סימנים מסחריים של קבוצת LEGO. האתר אינו מכירה —
          מידע בלבד.
        </div>
      </footer>
    </div>
  );
}
