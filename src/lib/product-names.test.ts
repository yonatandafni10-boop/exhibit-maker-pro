import { describe, expect, test } from "bun:test";
import { catalogSets } from "./catalog-data";
import { productName, matchesProductName } from "./product-names";
import translations from "./product-names.json";
import type { Lang } from "./i18n";

const localized: Record<string, Partial<Record<Lang, string>>> = translations;
const languages: Lang[] = ["en", "ar", "ru", "fr", "es", "de"];

describe("product language selection", () => {
  for (const lang of languages) {
    test(`every catalog product resolves its ${lang} translation without changing identity or price`, () => {
      for (const set of catalogSets) {
        const before = { ...set };
        expect(localized[set.slug]?.[lang]?.length).toBeGreaterThan(0);
        expect(productName(set, lang)).toBe(localized[set.slug]?.[lang]);
        expect(set).toEqual(before);
      }
    });
  }

  test("Hebrew keeps original catalog names", () => {
    for (const set of catalogSets) expect(productName(set, "he")).toBe(set.name);
  });

  test("owner name overrides remain authoritative", () => {
    const set = catalogSets[0];
    if (!set) throw new Error("Catalog must contain products");
    const override = { ...set, name: "Owner custom name" };
    for (const lang of languages) expect(productName(override, lang, set.name)).toBe(override.name);
  });

  test("search finds localized names, original names and stable product identifiers", () => {
    const set = catalogSets[0];
    if (!set) throw new Error("Catalog must contain products");
    for (const lang of languages) {
      expect(matchesProductName(set, lang, productName(set, lang))).toBe(true);
      expect(matchesProductName(set, lang, set.name)).toBe(true);
      expect(matchesProductName(set, lang, set.slug)).toBe(true);
      expect(matchesProductName(set, lang, "nonexistent-product-xyz987654321")).toBe(false);
    }
  });
});