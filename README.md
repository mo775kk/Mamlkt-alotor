# مملكة العطور — CROWN Maison de Parfum

متجر عطور ملكي (أسود وذهبي، عربي RTL) مع لوحة إدارة وإرسال الطلبات عبر واتساب.

## هيكل الملفات

```
mamlkt-alotor/
├── README.md
├── data/
│   ├── catalog.json            الكتالوج الحالي (50 منتجاً، مراجَع وجاهز)
│   ├── real_perfumes_raw.json  قائمة الأسماء الحقيقية المستوردة (157 اسماً)
│   ├── catalog.merged.json     الكتالوج بعد الدمج (159 منتجاً)
│   └── import_report.txt       تقرير الدمج: المضاف والمتخطى
└── scripts/
    ├── build_catalog.py        يدمج القائمة في الكتالوج (بدون عشوائية)
    └── validate_catalog.py     يفحص الملف: تكرار، حقول ناقصة، مقاسات/أسعار
```

ملفات الموقع (`index.html`، `style.css`، `app.js`) تبقى في جذر المستودع كما هي.

## الاستخدام

```bash
python scripts/build_catalog.py       # يدمج ويولّد data/catalog.merged.json
python scripts/validate_catalog.py    # يفحص النتيجة
```

## المنتجات المستوردة

كل منتج مضاف حديثاً يحمل `needsReview: true` و`active: false` ومخزونه 0،
فلا يظهر للزبائن حتى يراجعه المالك ويكمل: `nameEn`، `manufactureDate`،
`description`، `stock`، `family`، `type`، ثم يفعّله.

## الأسعار (جنيه مصري)

3مل=50 · 5مل=75 · 10مل=100 · 22مل=130 · 30مل=150 · 50مل=200 · 100مل=450

## التواصل

الإسكندرية، شارع خالد بن الوليد — 01272776928 (اتصال / واتساب)
