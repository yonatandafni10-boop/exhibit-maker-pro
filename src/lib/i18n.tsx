import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const LANGS = {
  en: { label: "English", dir: "ltr", currency: "USD", locale: "en-US" },
  he: { label: "עברית", dir: "rtl", currency: "ILS", locale: "he-IL" },
  ar: { label: "العربية", dir: "rtl", currency: "USD", locale: "ar" },
  ru: { label: "Русский", dir: "ltr", currency: "USD", locale: "ru-RU" },
  fr: { label: "Français", dir: "ltr", currency: "EUR", locale: "fr-FR" },
  es: { label: "Español", dir: "ltr", currency: "EUR", locale: "es-ES" },
  de: { label: "Deutsch", dir: "ltr", currency: "EUR", locale: "de-DE" },
} as const;
export type Lang = keyof typeof LANGS;

type Dict = Record<string, string>;
const he: Dict = {
  heroA: "כל לבנה,", heroB: "נספרת.", heroSub: "כל סטי הלגו במקום אחד — תמונות, גילאים ומחירים של כל סט.",
  inCatalog: "סטים בקטלוג", sets: "סטים", inStockNow: "מהם זמינים במלאי עכשיו.", search: "חיפוש לפי שם סט, מספר או סדרה...",
  sort: "מיון", newest: "חדשים", priceAsc: "מחיר: מהזול ליקר", priceDesc: "מחיר: מהיקר לזול", mostPieces: "הכי הרבה חלקים",
  onlyStock: "רק במלאי", catalog: "הקטלוג", age: "גיל", pieces: "חלקים", soldOut: "אזל מהמלאי", more: "הצג עוד סטים",
  back: "חזרה לקטלוג", buy: "לרכישה 🛒", about: "על הסט", notFound: "הסט לא נמצא",
  purchase: "רכישה", stepDetails: "פרטים וכתובת", stepPay: "תשלום", stepDone: "סיום", next: "הבא",
  fullName: "שם מלא", email: "אימייל", phone: "טלפון", country: "מדינה", city: "עיר", street: "רחוב ומספר בית",
  zip: "מיקוד (לא חובה)", notes: "הערות למשלוח (לא חובה)", required: "שדה חובה", badEmail: "אימייל לא תקין", badPhone: "טלפון לא תקין",
  fixRed: "יש למלא את השדות המסומנים באדום", shipTo: "משלוח אל:", edit: "עריכת פרטים", choosePay: "בחר אמצעי תשלום:",
  secure: "🔒 התשלום מאובטח ע״י PayPal. פרטי האשראי לא נשמרים אצלנו.", payFail: "התשלום נכשל, נסה שוב.",
  thanks: "תודה רבה על הקנייה!", thanksSub: "התשלום התקבל וההזמנה בטיפול.", admin: "ניהול", noPieces: "—",
};
const en: Dict = {
  heroA: "Every brick,", heroB: "counted.", heroSub: "Every LEGO set in one place — photos, ages and prices for every set.",
  inCatalog: "Sets in catalog", sets: "sets", inStockNow: "of them in stock now.", search: "Search by set name, number or theme...",
  sort: "Sort", newest: "Newest", priceAsc: "Price: low to high", priceDesc: "Price: high to low", mostPieces: "Most pieces",
  onlyStock: "In stock only", catalog: "Catalog", age: "Age", pieces: "pieces", soldOut: "Sold out", more: "Show more sets",
  back: "Back to catalog", buy: "Buy now 🛒", about: "About this set", notFound: "Set not found",
  purchase: "Checkout", stepDetails: "Details & address", stepPay: "Payment", stepDone: "Done", next: "Next",
  fullName: "Full name", email: "Email", phone: "Phone", country: "Country", city: "City", street: "Street & number",
  zip: "ZIP (optional)", notes: "Delivery notes (optional)", required: "Required", badEmail: "Invalid email", badPhone: "Invalid phone",
  fixRed: "Please fill in the fields marked in red", shipTo: "Ship to:", edit: "Edit details", choosePay: "Choose payment method:",
  secure: "🔒 Payment secured by PayPal. Card details are never stored by us.", payFail: "Payment failed, please try again.",
  thanks: "Thank you for your purchase!", thanksSub: "Payment received, your order is being processed.", admin: "Admin", noPieces: "—",
};
const ar: Dict = { ...en,
  heroA: "كل قطعة،", heroB: "محسوبة.", heroSub: "جميع مجموعات ليغو في مكان واحد — صور وأعمار وأسعار.",
  inCatalog: "مجموعات في الكتالوج", sets: "مجموعات", inStockNow: "منها متوفرة الآن.", search: "ابحث باسم المجموعة أو الرقم...",
  sort: "ترتيب", newest: "الأحدث", priceAsc: "السعر: من الأقل", priceDesc: "السعر: من الأعلى", mostPieces: "أكثر القطع",
  onlyStock: "المتوفر فقط", catalog: "الكتالوج", age: "العمر", pieces: "قطعة", soldOut: "نفد", more: "عرض المزيد",
  back: "العودة للكتالوج", buy: "اشترِ الآن 🛒", about: "عن المجموعة", purchase: "الشراء", stepDetails: "التفاصيل والعنوان",
  stepPay: "الدفع", stepDone: "تم", next: "التالي", fullName: "الاسم الكامل", email: "البريد الإلكتروني", phone: "الهاتف",
  country: "الدولة", city: "المدينة", street: "الشارع والرقم", zip: "الرمز البريدي (اختياري)", notes: "ملاحظات (اختياري)",
  required: "حقل مطلوب", fixRed: "يرجى ملء الحقول المحددة باللون الأحمر", shipTo: "الشحن إلى:", edit: "تعديل", choosePay: "اختر طريقة الدفع:",
  thanks: "شكراً جزيلاً على الشراء!", thanksSub: "تم استلام الدفع.",
};
const ru: Dict = { ...en,
  heroA: "Каждый кубик", heroB: "на счету.", heroSub: "Все наборы LEGO в одном месте — фото, возраст и цены.",
  inCatalog: "Наборов в каталоге", sets: "наборов", inStockNow: "из них в наличии.", search: "Поиск по названию или номеру...",
  sort: "Сортировка", newest: "Новые", priceAsc: "Цена: по возрастанию", priceDesc: "Цена: по убыванию", mostPieces: "Больше деталей",
  onlyStock: "Только в наличии", catalog: "Каталог", age: "Возраст", pieces: "деталей", soldOut: "Нет в наличии", more: "Показать ещё",
  back: "Назад в каталог", buy: "Купить 🛒", about: "О наборе", purchase: "Оформление", stepDetails: "Данные и адрес",
  stepPay: "Оплата", stepDone: "Готово", next: "Далее", fullName: "Полное имя", phone: "Телефон", country: "Страна", city: "Город",
  street: "Улица и дом", zip: "Индекс (необязательно)", notes: "Примечания (необязательно)", required: "Обязательное поле",
  fixRed: "Заполните поля, отмеченные красным", shipTo: "Доставка:", edit: "Изменить", choosePay: "Способ оплаты:",
  thanks: "Большое спасибо за покупку!", thanksSub: "Оплата получена.",
};
const fr: Dict = { ...en,
  heroA: "Chaque brique", heroB: "compte.", heroSub: "Tous les sets LEGO au même endroit — photos, âges et prix.",
  inCatalog: "Sets au catalogue", sets: "sets", inStockNow: "en stock maintenant.", search: "Rechercher par nom ou numéro...",
  sort: "Trier", newest: "Nouveautés", priceAsc: "Prix croissant", priceDesc: "Prix décroissant", mostPieces: "Plus de pièces",
  onlyStock: "En stock uniquement", catalog: "Catalogue", age: "Âge", pieces: "pièces", soldOut: "Épuisé", more: "Voir plus",
  back: "Retour au catalogue", buy: "Acheter 🛒", about: "À propos", purchase: "Paiement", stepDetails: "Coordonnées",
  stepPay: "Paiement", stepDone: "Terminé", next: "Suivant", fullName: "Nom complet", phone: "Téléphone", country: "Pays", city: "Ville",
  street: "Rue et numéro", zip: "Code postal (facultatif)", notes: "Remarques (facultatif)", required: "Champ obligatoire",
  fixRed: "Veuillez remplir les champs en rouge", shipTo: "Livraison à :", edit: "Modifier", choosePay: "Mode de paiement :",
  thanks: "Merci beaucoup pour votre achat !", thanksSub: "Paiement reçu.",
};
const es: Dict = { ...en,
  heroA: "Cada pieza", heroB: "cuenta.", heroSub: "Todos los sets de LEGO en un lugar — fotos, edades y precios.",
  inCatalog: "Sets en catálogo", sets: "sets", inStockNow: "disponibles ahora.", search: "Buscar por nombre o número...",
  sort: "Ordenar", newest: "Nuevos", priceAsc: "Precio: menor a mayor", priceDesc: "Precio: mayor a menor", mostPieces: "Más piezas",
  onlyStock: "Solo disponibles", catalog: "Catálogo", age: "Edad", pieces: "piezas", soldOut: "Agotado", more: "Ver más",
  back: "Volver al catálogo", buy: "Comprar 🛒", about: "Sobre el set", purchase: "Compra", stepDetails: "Datos y dirección",
  stepPay: "Pago", stepDone: "Listo", next: "Siguiente", fullName: "Nombre completo", phone: "Teléfono", country: "País", city: "Ciudad",
  street: "Calle y número", zip: "Código postal (opcional)", notes: "Notas (opcional)", required: "Campo obligatorio",
  fixRed: "Completa los campos marcados en rojo", shipTo: "Enviar a:", edit: "Editar", choosePay: "Método de pago:",
  thanks: "¡Muchas gracias por tu compra!", thanksSub: "Pago recibido.",
};
const de: Dict = { ...en,
  heroA: "Jeder Stein", heroB: "zählt.", heroSub: "Alle LEGO Sets an einem Ort — Fotos, Alter und Preise.",
  inCatalog: "Sets im Katalog", sets: "Sets", inStockNow: "davon jetzt verfügbar.", search: "Nach Name oder Nummer suchen...",
  sort: "Sortieren", newest: "Neueste", priceAsc: "Preis aufsteigend", priceDesc: "Preis absteigend", mostPieces: "Meiste Teile",
  onlyStock: "Nur verfügbar", catalog: "Katalog", age: "Alter", pieces: "Teile", soldOut: "Ausverkauft", more: "Mehr anzeigen",
  back: "Zurück zum Katalog", buy: "Jetzt kaufen 🛒", about: "Über das Set", purchase: "Kasse", stepDetails: "Daten & Adresse",
  stepPay: "Zahlung", stepDone: "Fertig", next: "Weiter", fullName: "Vollständiger Name", phone: "Telefon", country: "Land", city: "Stadt",
  street: "Straße & Nr.", zip: "PLZ (optional)", notes: "Hinweise (optional)", required: "Pflichtfeld",
  fixRed: "Bitte die rot markierten Felder ausfüllen", shipTo: "Lieferung an:", edit: "Bearbeiten", choosePay: "Zahlungsart:",
  thanks: "Vielen Dank für Ihren Einkauf!", thanksSub: "Zahlung erhalten.",
};
const DICTS: Record<Lang, Dict> = { en, he, ar, ru, fr, es, de };

// ILS -> currency fallback rates (refreshed live when possible)
const FALLBACK: Record<string, number> = { ILS: 1, USD: 0.27, EUR: 0.25 };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string; price: (ils: number | null) => string; convert: (ils: number) => number; currency: string; dir: "rtl" | "ltr" };
const I18n = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("he");
  const [rates, setRates] = useState(FALLBACK);
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && saved in LANGS) setLangState(saved);
    fetch("https://open.er-api.com/v6/latest/ILS").then((r) => r.json()).then((d) => {
      if (d?.rates) setRates({ ILS: 1, USD: d.rates.USD, EUR: d.rates.EUR });
    }).catch(() => {});
  }, []);
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem("lang", l); };
  const info = LANGS[lang];
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = info.dir; }, [lang, info.dir]);
  const convert = (ils: number) => Math.round(ils * (rates[info.currency] ?? 1) * 100) / 100;
  const price = (ils: number | null) =>
    ils == null ? "" : new Intl.NumberFormat(info.locale, { style: "currency", currency: info.currency, maximumFractionDigits: 2 }).format(convert(ils));
  const t = (k: string) => DICTS[lang][k] ?? en[k] ?? k;
  return <I18n.Provider value={{ lang, setLang, t, price, convert, currency: info.currency, dir: info.dir }}>{children}</I18n.Provider>;
}

export function useI18n() {
  const c = useContext(I18n);
  if (!c) throw new Error("I18nProvider missing");
  return c;
}

export function LangPicker() {
  const { lang, setLang } = useI18n();
  return (
    <select
      aria-label="Language"
      value={lang}
      onChange={(e) => setLang(e.target.value as Lang)}
      className="rounded-full border border-border bg-card px-3 py-2 text-sm font-bold shadow-sm outline-none"
    >
      {(Object.keys(LANGS) as Lang[]).map((l) => <option key={l} value={l}>🌐 {LANGS[l].label}</option>)}
    </select>
  );
}
