#!/usr/bin/env python3
"""فحص ملف الكتالوج: python scripts/validate_catalog.py [المسار]"""
import json, sys
from pathlib import Path

path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / "data" / "catalog.merged.json"
items = json.loads(path.read_text(encoding="utf-8"))
REQUIRED = ["id", "name", "company", "gender", "type", "stock", "sizes", "prices", "active"]
errors = []
ids, names = set(), set()
for p in items:
    for k in REQUIRED:
        if k not in p: errors.append(f"{p.get('id')}: ينقصه الحقل {k}")
    if p["id"] in ids: errors.append(f"{p['id']}: id مكرر")
    ids.add(p["id"])
    if p["name"] in names: errors.append(f"{p['id']}: اسم مكرر {p['name']}")
    names.add(p["name"])
    if set(p["sizes"]) != set(p["prices"]): errors.append(f"{p['id']}: المقاسات لا تطابق الأسعار")
    if p["gender"] not in ("men", "women", "unisex"): errors.append(f"{p['id']}: gender غير صالح")
review = sum(1 for p in items if p.get("needsReview"))
print(f"{len(items)} منتج | {review} يحتاج مراجعة | {len(errors)} خطأ")
print(*errors, sep="\n")
sys.exit(1 if errors else 0)
