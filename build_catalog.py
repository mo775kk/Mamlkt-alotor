#!/usr/bin/env python3
"""
دمج قائمة العطور الحقيقية في كتالوج مملكة العطور.

المدخلات : data/catalog.json            (الكتالوج الحالي)
           data/real_perfumes_raw.json  (قائمة الأسماء الحقيقية)
المخرجات : data/catalog.merged.json     (الكتالوج بعد الدمج)
           data/import_report.txt       (تقرير الدمج)

لا يوجد أي توليد عشوائي: النتيجة ثابتة في كل تشغيل.
الاستخدام: python scripts/build_catalog.py
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

PRICES = {"3": 50, "5": 75, "10": 100, "22": 130, "30": 150, "50": 200, "100": 450}

# أسماء تكرر عطراً موجوداً بكتابة مختلفة (لا يلتقطها التطبيع التلقائي)
DUPLICATE_ALIASES = {
    "دنهل دزاير بلو", "اسكلبشر", "وان مان شو", "باكارا روج 540",
    "ميجمار", "مسك رومان", "فانتازيا", "سجنشر", "كريد سيلفر",
}
# أسماء مشكوك في وجودها كعطر حقيقي
EXCLUDE = {"إنفكتوس التكسير"}

BRAND_FIX = {  # توحيد كتابة الشركات
    "كيالى": "كيالي", "بريتنى سبيرز": "بريتني سبيرز",
    "جان بول غولتييه": "جان بول غوتييه", "جاك بوجارت": "جاك بوغارت",
    "ميزون فرانسيس كركجيان": "ميزون فرانسيس كوركدجيان",
    "عطور محلية": "عطور عربية محلية", "عطور عمانية": "عطور عربية محلية",
}
BRAND_EN = {
    "لاكوست": "Lacoste", "لطافة": "Lattafa", "كارولينا هيريرا": "Carolina Herrera",
    "ديور": "Dior", "شانيل": "Chanel", "باكو رابان": "Paco Rabanne",
    "إيف سان لوران": "Yves Saint Laurent", "توم فورد": "Tom Ford",
    "فيرساتشي": "Versace", "جورجيو أرماني": "Giorgio Armani",
    "إيمبوريو أرماني": "Emporio Armani", "كريد": "Creed",
    "جان بول غوتييه": "Jean Paul Gaultier", "دنهل": "Dunhill", "أزارو": "Azzaro",
    "اسكادا": "Escada", "فيكتوريا سيكريت": "Victoria's Secret",
    "بريتني سبيرز": "Britney Spears", "جاك بوغارت": "Jacques Bogart",
    "كيالي": "Kayali", "مانسيرا": "Mancera", "أكويلينا": "Aquolina",
    "روبرتو كافالي": "Roberto Cavalli", "جيمي تشو": "Jimmy Choo", "زارا": "Zara",
    "جاي لاروش": "Guy Laroche", "غوتشي": "Gucci", "بالمان": "Balmain",
    "روشاس": "Rochas", "كينزو": "Kenzo", "بيربري": "Burberry", "كلوي": "Chloé",
    "ميزون فرانسيس كوركدجيان": "Maison Francis Kurkdjian", "نوتيكا": "Nautica",
    "بي إم دبليو": "BMW", "كالفن كلاين": "Calvin Klein", "ناسوماتو": "Nasomatto",
    "فالنتينو": "Valentino", "تيد لابيدوس": "Ted Lapidus", "هوجو بوس": "Hugo Boss",
    "جيفنشي": "Givenchy", "دافيدوف": "Davidoff", "باريس هيلتون": "Paris Hilton",
    "أرماف": "Armaf", "عطور عربية محلية": "Local/Arab",
}
GENDER = {"male": ("men", "رجالي"), "female": ("women", "حريمي"), "unisex": ("unisex", "للجنسين")}


def norm(s: str) -> str:
    s = re.sub(r"[\u064B-\u0652\u0640]", "", s)
    s = re.sub("[أإآ]", "ا", s).replace("ى", "ي").replace("ة", "ه").replace("ئ", "ي").replace("ؤ", "و")
    return re.sub(r"[^0-9a-zA-Z\u0600-\u06FF]", "", s).lower()


def main():
    catalog = json.loads((DATA / "catalog.json").read_text(encoding="utf-8"))
    raw = json.loads((DATA / "real_perfumes_raw.json").read_text(encoding="utf-8"))

    seen = {norm(p["name"]) for p in catalog}
    seen |= {norm(a) for a in DUPLICATE_ALIASES}
    next_id = max(p["id"] for p in catalog) + 1
    added, skipped = [], []

    for r in raw:
        name = re.sub(r"\s+", " ", r["name"]).strip()
        key = norm(name)
        if name in EXCLUDE:
            skipped.append((name, "مستبعد (اسم مشكوك)")); continue
        if key in seen:
            skipped.append((name, "مكرر")); continue
        seen.add(key)

        brand_ar = BRAND_FIX.get(r["brand"], r["brand"])
        gender, gender_ar = GENDER[r["gender"]]
        oriental = r["category"] == "شرقي"
        cats = [gender_ar] + (["شرقي"] if oriental else [])

        added.append({
            "id": next_id, "name": name, "nameEn": "",
            "company": BRAND_EN.get(brand_ar, brand_ar),
            "gender": gender, "family": "oriental" if oriental else "",
            "type": "Eau de Parfum", "manufactureDate": "", "description": "",
            "stock": 0, "rating": 0, "sizes": list(PRICES), "prices": dict(PRICES),
            "image": "", "active": False,           # يبقى مخفياً حتى يراجعه المالك
            "currency": "EGP", "sku": f"CRN-{next_id}", "companyAr": brand_ar,
            "genderAr": gender_ar, "familyAr": "شرقي" if oriental else "",
            "typeAr": "أو دو بارفان", "categories": cats, "releaseYear": None,
            "hall": "", "featured": False, "lowStock": False, "needsReview": True,
            "searchKeywords": sorted({w.lower() for w in re.split(r"[\s/\-']+", f"{name} {brand_ar}") if w}),
        })
        next_id += 1

    merged = catalog + added
    assert len({p["id"] for p in merged}) == len(merged)
    (DATA / "catalog.merged.json").write_text(
        json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8")

    lines = [f"الكتالوج الأصلي : {len(catalog)}", f"أُضيف          : {len(added)}",
             f"تم تخطيه       : {len(skipped)}", f"الإجمالي       : {len(merged)}", "", "-- المتخطى --"]
    lines += [f"{n} ({why})" for n, why in skipped]
    (DATA / "import_report.txt").write_text("\n".join(lines), encoding="utf-8")
    print("\n".join(lines[:4]))


if __name__ == "__main__":
    main()
