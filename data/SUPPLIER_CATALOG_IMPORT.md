# Supplier catalog and fragrance taxonomy

The owner panel now has **Supplier Catalog** and **Classification & Blending** tabs.

## Import supplier data
1. Open the GitHub Pages site and choose ⚙ Owner Settings.
2. Sign in with the local owner PIN.
3. Open **كتالوج الموردين** and choose **استيراد كتالوج JSON**.
4. Select `mamlaket_otoor_supplier_catalog_enriched.json` from the downloaded package.
5. Confirm import. The catalog is stored in this browser and is separate from storefront retail products/prices.
6. Use **تصدير نسخة الكتالوج** for a backup.

The supplier price lists dated 2026-06-16 contain 589 records across Golden and Niche lines, with five weights and prices before/after 14% VAT.

## Important chemistry limitation
The supplier price lists do not disclose product-specific chemical formulas or ingredient percentages. Family/nature classifications are indicative and need sensory/technical review. Molecule examples are general industry examples, not confirmed ingredients of a listed oil. Request SDS, IFRA documentation, allergen disclosures and the supplier's recommended dilution/use limits before commercial blending.

## Storage limitation
The catalog, owner PIN, and site settings currently use browser localStorage. They are not shared across devices and are not a cloud database. Export/import is required to transfer data.
