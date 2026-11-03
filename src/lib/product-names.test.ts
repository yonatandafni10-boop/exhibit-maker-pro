import { describe, test } from "node:test";
import assert from "node:assert/strict";
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
        assert.ok((localized[set.slug]?.[lang]?.length ?? 0) > 0);
        assert.equal(productName(set, lang), localized[set.slug]?.[lang]);
        assert.deepEqual(set, before);
      }
    });
  }

  test("Hebrew keeps original catalog names", () => {
    for (const set of catalogSets) assert.equal(productName(set, "he"), set.name);
  });

  test("owner name overrides remain authoritative", () => {
    const set = catalogSets[0];
    if (!set) throw new Error("Catalog must contain products");
    const override = { ...set, name: "Owner custom name" };
    for (const lang of languages) assert.equal(productName(override, lang, set.name), override.name);
  });

  test("search finds localized names, original names and stable product identifiers", () => {
    const set = catalogSets[0];
    if (!set) throw new Error("Catalog must contain products");
    for (const lang of languages) {
      assert.equal(matchesProductName(set, lang, productName(set, lang)), true);
      assert.equal(matchesProductName(set, lang, set.name), true);
      assert.equal(matchesProductName(set, lang, set.slug), true);
      assert.equal(matchesProductName(set, lang, "nonexistent-product-xyz987654321"), false);
    }
  });
});