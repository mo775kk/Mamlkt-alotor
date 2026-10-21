# إعداد التخزين السحابي لمملكة العطور

## حالة الربط
- مشروع Supabase الحالي: `qomuwnhefhbecjgugsev`.
- ملف `supabase-config.js` مرتبط بعنوان المشروع والمفتاح العام Publishable Key.
- `supabase-cloud.js` هو المسؤول عن زر الحفظ السحابي والمزامنة ورفع الصور.
- `supabase-setup.sql` يحتوي على بنية الجداول وسياسات الوصول. لا تضع `service_role` أو أي مفتاح Secret في ملفات الموقع.

## تفعيل حساب الإدارة مرة واحدة
1. افتح https://supabase.com/dashboard/project/qomuwnhefhbecjgugsev/auth/users
2. أنشئ مستخدمًا خاصًا بالمالك من Authentication → Users، مع كلمة مرور قوية. لا تفعّل التسجيل العام للزوار.
3. بعد إنشاء المستخدم، افتح SQL Editor ونفّذ الاستعلام التالي مع استبدال البريد بالبريد الذي أنشأت به حساب الإدارة:

```sql
insert into public.admin_users (user_id)
select id from auth.users
where lower(email) = lower('YOUR_ADMIN_EMAIL@example.com')
on conflict (user_id) do nothing;
```

4. إذا كانت النتيجة لا تضيف أي صف، تأكد من البريد المسجل في Authentication → Users. لا تضف مستخدمًا لا تعرفه إلى جدول الإدارة.
5. افتح https://mo775kk.github.io/Mamlkt-alotor/ ثم لوحة الإدارة → الإعدادات → الموقع والهوية → الحفظ السحابي. سجّل الدخول بالبريد وكلمة المرور اللذين أنشأتهما.

## اختبار الحفظ
1. من نافذة الحفظ السحابي اضغط «اختبار الاتصال». يجب أن يؤكد الاتصال بقاعدة البيانات.
2. سجّل دخول الإدارة ثم ارفع صورة خلفية أو صورة منتج.
3. احفظ التعديل، أعد تحميل الموقع، وتأكد أن الصورة ما زالت ظاهرة.
4. جرّب من جهاز آخر بعد تسجيل الدخول إلى الإدارة؛ ظهور الصور العامة لا يتطلب تسجيل دخول، أما الرفع والتعديل فيتطلبان حساب الإدارة المعتمد.

## ملاحظات مهمة
- إعداد الرابط والمفتاح العام لا ينشئ حساب الإدارة تلقائيًا؛ يجب اعتماد UID المالك في جدول `admin_users` مرة واحدة.
- صور الموقع محفوظة في مخزن `mamlakat-images`، بحد أقصى 5 ميجابايت للصورة. الأنواع المقبولة JPG وPNG وWEBP وAVIF.
- جداول المزامنة الحالية هي `mamlaka_settings` و`mamlaka_products`. توجد أيضًا جداول منفصلة للكتالوج والطلبات والمخزون لتوسعة وظائف الإدارة.
- السلة والمفضلة ومعلومات الجلسة وPIN المحلي مستثناة من المزامنة السحابية.
- المفتاح الموجود في `supabase-config.js` مفتاح عام مخصص للمتصفح؛ الأمان يعتمد على سياسات RLS وعدم مشاركة بيانات دخول الإدارة.


## تفعيل الدخول باستخدام Google

تمت إضافة زر **الدخول باستخدام Google** إلى نافذة الحفظ السحابي في الموقع. يلزم تفعيل مزود Google مرة واحدة من لوحة Supabase:

1. افتح [إعدادات Google Auth في Supabase](https://supabase.com/dashboard/project/qomuwnhefhbecjgugsev/auth/providers) وفعّل Google.
2. افتح [Google Cloud Console](https://console.cloud.google.com/apis/credentials) وأنشئ OAuth Client ID من النوع **Web application**.
3. في Google Cloud، أضف Authorized JavaScript origin:
   `https://mo775kk.github.io`
4. أضف Authorized redirect URI التالي كما هو:
   `https://qomuwnhefhbecjgugsev.supabase.co/auth/v1/callback`
5. انسخ **Client ID** و**Client Secret** إلى إعدادات مزود Google داخل Supabase، ثم احفظ.
6. في Supabase افتح Authentication → URL Configuration، واجعل Site URL:
   `https://mo775kk.github.io/Mamlkt-alotor/`
   وأضف إلى Redirect URLs:
   `https://mo775kk.github.io/Mamlkt-alotor/`
7. افتح الموقع، ثم الإعدادات → الحفظ السحابي → **الدخول باستخدام Google**.

**أمان الإدارة:** تسجيل الدخول بجوجل لا يجعل الحساب مديرًا تلقائيًا. بعد تسجيل الدخول لأول مرة، أضف معرّف المستخدم إلى جدول `public.admin_users` من لوحة Supabase باستخدام SQL Editor، وتأكد من مطابقة البريد للحساب الذي تملكه. لا تضع Client Secret أو مفاتيح سرية في ملفات GitHub أو ترسلها في المحادثة.
