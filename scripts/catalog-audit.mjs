import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const productsData = read('data/products.json');
const oilData = read('oil-catalog-public.json');
const ready = productsData.products || [];
const oils = oilData.products || [];
const today = new Date().toISOString().slice(0, 10);

function count(rows, predicate) { return rows.filter(predicate).length; }
function groupByType(rows) {
  const groups = new Map();
  for (const row of rows) {
    const type = row.productType || 'غير محدد';
    if (!groups.has(type)) groups.set(type, []);
    groups.get(type).push(row);
  }
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}
function uniqueNames(rows) {
  return new Set(rows.map(row => String(row.nameAr || row.nameEn || '').trim().toLocaleLowerCase('ar')).filter(Boolean)).size;
}
function duplicateGroups(rows) {
  const map = new Map();
  for (const row of rows) {
    const name = String(row.nameAr || row.nameEn || '').trim().toLocaleLowerCase('ar');
    const key = `${row.productType || 'غير محدد'}:${name}`;
    if (!key) continue;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()].filter(([, n]) => n > 1).length;
}
function section(title, rows) {
  const hasPyramid = p => Boolean(p.topNotes?.length || p.heartNotes?.length || p.baseNotes?.length);
  const hasNotes = p => hasPyramid(p) || Boolean(p.scentNotesProfile && !/غير محدد|غير موثقة|لم تُخمن|تحتاج مراجعة/i.test(p.scentNotesProfile));
  const hasSource = p => /^https?:\/\//i.test(String(p.sourceUrl || p.notesSource || ''));
  const metrics = [
    ['عدد السجلات', rows.length],
    ['أسماء عربية/إنجليزية فريدة', uniqueNames(rows)],
    ['صور مرتبطة', count(rows, p => Boolean(String(p.image || '').trim()))],
    ['صورة مع مصدر صورة مسجل', count(rows, p => Boolean(p.image && p.imageSource))],
    ['هرم عطري ثلاثي أو نوتات موصوفة', count(rows, hasNotes)],
    ['هرم مقدمة/قلب/قاعدة مكتمل', count(rows, p => Boolean(p.topNotes?.length && p.heartNotes?.length && p.baseNotes?.length))],
    ['رابط مصدر بيانات', count(rows, hasSource)],
    ['مقاسات العبوة الأصلية موثقة', count(rows, p => Array.isArray(p.originalSizes) && p.originalSizes.length > 0)],
    ['اسم الماركة محدد', count(rows, p => p.brand && p.brand !== 'غير محدد')],
    ['اسم إنجليزي محدد', count(rows, p => Boolean(p.nameEn))],
    ['عائلة عطرية محددة', count(rows, p => p.family && p.family !== 'غير محدد')],
    ['سعر بيع مسجل', count(rows, p => p.price != null || Object.values(p.prices || {}).some(v => Number(v) > 0))],
    ['مؤكد التوفر للبيع', count(rows, p => p.available === true && p.needsReview !== true)],
    ['يحتاج مراجعة', count(rows, p => p.needsReview === true || p.available !== true)],
    ['مجموعات أسماء مكررة داخل النوع نفسه', duplicateGroups(rows)]
  ];
  return `## ${title}\n\n| المؤشر | العدد |\n|---|---:|\n${metrics.map(([k,v]) => `| ${k} | ${v} |`).join('\n')}\n`;
}
const readyTypes = groupByType(ready).map(([type, rows]) => `| ${type} | ${rows.length} | ${uniqueNames(rows)} | ${count(rows, p => Boolean(p.image))} | ${count(rows, p => Boolean(p.topNotes?.length || p.heartNotes?.length || p.baseNotes?.length || p.scentNotesProfile))} |`).join('\n');
const report = `# تقرير اكتمال بيانات كتالوج مملكة العطور\n\nآخر إعادة حساب: ${today}. هذا التقرير مولّد من ملفات البيانات الحالية، وليس دليلًا على توفر المنتج فعليًا.\n\n${section('العطور والمنتجات الرئيسية', ready)}\n${section('كتالوج الزيوت المرجعي', oils)}\n## توزيع سجلات المنتجات حسب النوع\n\n| النوع | السجلات | الأسماء الفريدة | الصور | سجلات بها نوتات |\n|---|---:|---:|---:|---:|\n${readyTypes}\n\n## قواعد تفسير الأرقام\n\n- السجل المرجعي لا يعني أن المنتج موجود في المخزون أو متاح للبيع.\n- تكرار الاسم بين سجل العطر الجاهز وسجل زيت التركيب لا يُعد تكرارًا خاطئًا؛ النوع مختلف.\n- الصورة لا تُعد موثقة المصدر إلا إذا كان حقل 'imageSource' موجودًا.\n- لا تُعرض النوتات كهرم ثلاثي إلا إذا كان المصدر يثبت تقسيم المقدمة والقلب والقاعدة. قد يحتوي بعض العطور على وصف نوتات عام فقط.\n- مقاسات العبوة الأصلية تختلف عن أحجام التعبئة التي يبيعها المتجر.\n- لا تُعتمد الأسعار أو المخزون إلا بعد مراجعة صاحب المتجر ومصدر السعر/الكمية.\n\n## الأولويات\n\n1. إكمال الصور المباشرة ومصادرها لكل عطر جاهز وزيت مرجعي.\n2. استكمال أسماء الماركات والإصدارات الإنجليزية وإزالة الغموض بين الإصدارات المتشابهة.\n3. إضافة هرم النوتات فقط من صفحة العلامة أو مصدر عطري موثوق مع رابط وتاريخ مراجعة.\n4. فصل تكلفة المورد عن سعر بيع العميل، وإضافة حجم العبوة وتاريخ السعر والمخزون بعد تأكيد المتجر.\n5. مراجعة التكرارات داخل النوع نفسه فقط، وعدم حذف أي سجل تلقائيًا.\n\n## الحقول المطلوبة قبل اعتماد المنتج\n\nnameAr, nameEn, brand, productType, gender, family, image, imageSource, topNotes, heartNotes, baseNotes, sourceUrl, originalSizes, sizes, prices, available, needsReview, reviewedAt. الحقول غير المعروفة تظل غير محددة ولا تُملأ بالتخمين.\n`;
if (process.argv.includes('--write')) {
  fs.writeFileSync(path.join(root, 'data/CATALOG_COMPLETENESS_AR.md'), report, 'utf8');
}
process.stdout.write(report);
