import translations from "./product-names.json";
import type { Lang } from "./i18n";

type Product = { slug: string; name: string };
const names: Record<string, Partial<Record<Lang, string>>> = translations;

/** Localized display only: never change product identity, owner names or pricing. */
export function productName(product: Product, lang: Lang, originalName = product.name): string {
  if (lang === "he" || product.name !== originalName) return product.name;
  return names[product.slug]?.[lang] || product.name;
}

export function matchesProductName(product: Product, lang: Lang, query: string, originalName = product.name): boolean {
  const needle = query.trim().toLocaleLowerCase();
  return [product.name, originalName, product.slug, productName(product, lang, originalName)]
    .some((value) => value.toLocaleLowerCase().includes(needle));
}