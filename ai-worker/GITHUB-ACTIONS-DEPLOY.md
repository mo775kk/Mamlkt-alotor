# نشر خدمة AI من GitHub Actions

أُضيف سير عمل النشر `.github/workflows/deploy-ai-worker.yml` ويُشغّل يدويًا من Actions بعد إعداد الأسرار. كما يشغّل `.github/workflows/ai-worker-tests.yml` اختبارات الخدمة تلقائيًا عند دفع تغييرات مرتبطة بها أو فتح Pull Request، ويمكن تشغيله يدويًا دون أسرار.

## إعداد مرة واحدة
1. افتح المستودع على GitHub ثم Settings → Secrets and variables → Actions.
2. أضف Repository secrets التالية:
   - `CLOUDFLARE_API_TOKEN`: رمز Cloudflare API بصلاحية نشر Workers Scripts للحساب المطلوب.
   - `CLOUDFLARE_ACCOUNT_ID`: معرّف حساب Cloudflare.
   - `OPENAI_API_KEY`: مفتاح API من OpenAI. أضفه هنا كـ Secret فقط، ولا تضعه في المحادثة أو ملفات الموقع.
3. افتح Settings → Secrets and variables → Actions → Variables، وأضف المتغير الاختياري `MAMLAKA_AI_WORKER_URL` بقيمة عنوان Worker الأساسي مثل `https://اسم-الخدمة.اسم-الحساب.workers.dev` (من دون `/health`).
4. افتح Actions → Deploy Mamlaka AI Worker → Run workflow.

ينقل سير العمل مفتاح OpenAI إلى Worker Secret باسم `OPENAI_API_KEY` ثم ينشر Worker باستخدام `ai-worker/wrangler.toml`. إذا لم تضف الأسرار المطلوبة، سيتوقف مع رسالة توضح اسم السر الناقص.

## بعد النشر
- افتح `https://عنوان-worker/health`. المتوقع `ok: true` و`configured: true`.
- عنوان المستشار الذي يجب ربطه بالموقع هو `https://عنوان-worker/api/ask`.
- ضع عنوان API في `DEFAULT_ENDPOINT` داخل `ai-service.js` ثم ارفع التعديل حتى يستخدمه جميع زوار الموقع. حفظ العنوان من إعدادات المالك محلي لهذا المتصفح فقط.
- راجع قائمة `ALLOWED_ORIGINS` في `ai-worker/wrangler.toml` لتشمل نطاقات الموقع الصحيحة فقط.

## حدود مهمة
هذا الملف وسير العمل لا ينشئان حساب Cloudflare أو مفتاح OpenAI ولا يستطيعان إدخال أسرار لا تملكها. النشر الفعلي لا يحدث حتى تضيف الأسرار وتشغّل Workflow. فحص `/health` اختياري ما لم تضف متغير الرابط. قبل الإطلاق العام، فعّل Cloudflare rate limiting أو Turnstile وراقب استخدام API والتكلفة.
