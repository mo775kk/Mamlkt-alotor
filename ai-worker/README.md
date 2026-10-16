# خدمة AI الخاصة بمملكة العطور
خادم مستشار العطور يعمل كـ Cloudflare Worker؛ لا تضع مفتاح API في ملفات الموقع.

1. أنشئ Worker باسم mamlakat-al-otor-ai وانشر src/index.js.
2. أضف Worker Secret باسم OPENAI_API_KEY من لوحة Cloudflare، ولا ترفعه إلى GitHub.
3. اجعل ALLOWED_ORIGINS يقتصر على نطاقات الموقع الفعلية.
4. افحص https://YOUR-WORKER.workers.dev/health ويجب أن يكون configured=true.
5. رابط API المطلوب https://YOUR-WORKER.workers.dev/api/ask. أدخله من تبويب الذكاء الاصطناعي في إعدادات المالك للاختبار على هذا المتصفح. لتفعيله لجميع الزوار، ضع الرابط في DEFAULT_ENDPOINT داخل ai-service.js ثم انشر الموقع.
6. مثال اختبار: عطر رجالي خشبي للدوام بميزانية 150 جنيه.

الخدمة تقترح من الكتالوج المرسل فقط، ولا تخترع الأسعار أو المخزون. CORS وحده ليس حماية من إساءة الاستخدام؛ أضف Cloudflare rate limiting أو Turnstile قبل الإطلاق التجاري. يلزم نشر Worker وضبط المفتاح والرابط لتصبح الخدمة حية.