مشروع VELORA — متجر إكسسوارات مصري. واجهة Angular 17.3 بنظام NgModule
(مش standalone)، مع SSR.

الحالة: الطبقة الأساسية خلصت بالكامل — 98 خدمة API، الـ models والـ enums،
5 interceptors، 4 signal stores، 5 جاردات، APP_INITIALIZER، ونظام تصميم.
الهيكل كله متسقفل (161 كومبوننت + 23 موديول) والملفات فاضية.

المراجع في مجلد docs/:
- __VELORA_API_Contract_last.txt ← عقد الـ API، المرجع الوحيد
- VELORA_SERVICES_MODELS_PLAN_AR.md ← خطة البناء

الأدوات: PrimeNG 18 + ثيم Aura (مربوط بتوكنات VELORA عبر
core/theme/velora-preset.ts) · Bootstrap للتخطيط فقط · ngx-translate 16

القواعد الثابتة:
1. ممنوع اختراع endpoints أو حقول — العقد هو المرجع.
2. ممنوع any.
3. ممنوع localStorage/window/document من غير isPlatformBrowser (فيه SSR).
4. الألوان والمسافات من src/styles/_tokens.scss فقط، كلها var(--...).
5. الخصائص المنطقية فقط (margin-inline-start مش margin-left) — الموقع
   بيتقلب RTL/LTR وقت التشغيل.
6. Mobile-first إجباري.
7. ممنوع نص ظاهر للمستخدم مكتوب في template — كله مفاتيح ترجمة.
8. المكوّنات من PrimeNG. Bootstrap للتخطيط فقط.
9. ng build لازم يعدّي في الآخر.

اقرأ الملفين في docs/ الأول، وبعدها المهمة:

