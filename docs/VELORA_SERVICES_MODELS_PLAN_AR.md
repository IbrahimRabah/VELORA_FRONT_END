# VELORA — خطة بناء الـ Models والـ Services

> مبنية على `__VELORA_API_Contract_last.txt` — **98 endpoint**، كلهم مغطّون في جدول التحقق آخر الملف.
> 8 دفعات، كل دفعة برومبت مستقل للـ agent و`git commit` في الآخر.

---

# ٠. عقد الـ agent — الصق ده في أول كل جولة

```
مشروع VELORA — واجهة Angular بنظام NgModule (مش standalone). الهيكل موجود
والملفات فاضية. المرجع الوحيد للـ API هو ملف __VELORA_API_Contract_last.txt.

قواعد ثابتة في كل دفعة:
1. لا تخترع أي endpoint أو حقل غير موجود في العقد. لو حاجة ناقصة، اكتب
   // TODO: not in contract وكمّل.
2. كل الأنواع صريحة. ممنوع any. ممنوع الرد المجرد من نوع Object.
3. الخدمات providedIn: 'root'، وبتستخدم inject() مش constructor injection.
4. كل خدمة API بترجّع Observable<T> مكتوب بالأنواع، وما فيهاش أي حالة
   (لا signals ولا BehaviorSubject) — الحالة كلها في core/state.
5. المبالغ نوعها Money، وأي حساب يمر على money().
6. ممنوع localStorage أو window أو document من غير isPlatformBrowser —
   المشروع فيه SSR (app.module.server.ts موجود).
7. مسارات الـ API تتبني من API_ROUTES، وأحجام الصفحات من APP_CONFIG.
   ممنوع أي string مسار أو رقم صفحة مكتوب في الخدمة.
8. في الآخر شغّل ng build ولازم يعدّي بدون أخطاء.
```

---

# الدفعة ١ — الأساس (`core/common` + enums + constants)

**كل حاجة بعد كده بتعتمد على الدفعة دي. لو فيها غلط، هيتكرر في 90 ملف.**

## الملفات

```
core/models/common/
  money.model.ts            Money · money() · formatMoney()
  page-response.model.ts    PageResponse<T> · emptyPage<T>()
  api-error.model.ts        ApiError (RFC 7807) · FieldError · isApiError()
  simple.model.ts           IdResponse · MessageResponse

core/enums/
  error-code.enum.ts        ErrorCode — 55 كود
  fulfillment-status.enum.ts  12 قيمة + جدول الانتقالات + NOTE_REQUIRED
  payment-status.enum.ts      7 قيم + جدول الانتقالات
  cart-warning.enum.ts        4 + BLOCKING_CART_WARNINGS
  sort-option.enum.ts         newest · price_asc · price_desc · name
  product-status.enum.ts      DRAFT · ACTIVE · ARCHIVED
  stock-movement.enum.ts      7 + MANUAL_MOVEMENT_TYPES
  otp-purpose.enum.ts         REGISTER · LOGIN · RESET · CHANGE_PHONE
  attribute-data-type.enum.ts LIST · TEXT · NUMBER · BOOLEAN
  invoice-status.enum.ts      ISSUED · CANCELLED
  remittance-status.enum.ts   SETTLED · SHORT · CANCELLED
  language.enum.ts            ar · en

core/constants/
  api-routes.ts             كل الـ 98 مسار
  app-config.ts             أحجام الصفحات والحدود
  error-messages.ts         ERROR_MESSAGES_AR + ERROR_MESSAGES_EN
  order-status.constants.ts جداول الانتقالات + التسميات العربية
```

## التفاصيل الحرجة

**`Money`** — العقد بيرجّع المبالغ string في مكان و number في مكان:

```ts
export type Money = string | number;

export const money = (v: Money | null | undefined): number =>
  v == null ? 0 : typeof v === 'number' ? v : parseFloat(v);
```

**`ErrorCode`** — 55 كود، والأسماء اللي في الوثائق القديمة **غلط**:
`STOCK_UNAVAILABLE` (مش `INSUFFICIENT_STOCK`) · `PRODUCT_NOT_ACTIVE` (مش `PRODUCT_UNAVAILABLE`) · `GOVERNORATE_NOT_SERVED` (مش `SHIPPING_UNAVAILABLE`) · `ORDER_NOT_FOUND`.

**`app-config.ts`** — أحجام الصفحات مختلفة لكل endpoint، خدها من العقد:
products 24 (سقف 60) · featured/new-arrivals 12 · adminProducts 20 · **myOrders 10** · adminOrders 20 · customers 25 · invoices 20 · remittances 20 · **movements 50** · **audit 50**.
وكمان: السلة 50 سطر × 99 قطعة · العناوين 10 · الصور 5MB و20 صورة · التوكن 1800 ثانية.

⚠️ **`price.filterMin/Max` ثابتة في الإعدادات** (0–50000). `categories/filters` بيرجّع `minPrice`/`maxPrice` **دايماً `null`** — مش مطبّق في السيرفر.

## برومبت الـ agent

```
[عقد الـ agent]

الدفعة 1: اكتب core/models/common و core/enums و core/constants بالكامل
حسب قسم "الدفعة ١" في ملف الخطة.

نقاط لازم تتنفذ بالظبط:
- Money = string | number، ودالة money() بتحوّل بأمان.
- ErrorCode: استخرج كل كود مذكور في العقد (جداول Error responses + قسم
  Conventions). المتوقع حوالي 55 كود. رتّبهم بتعليقات حسب المجال.
- ERROR_MESSAGES_AR و ERROR_MESSAGES_EN: Record<ErrorCode, string> كاملين،
  مفيش كود ناقص. الرسائل موجّهة للمستخدم مش للمطوّر.
- FULFILLMENT_TRANSITIONS و PAYMENT_TRANSITIONS: انسخ جدولي الانتقالات
  المسموحة من العقد حرفياً.
- NOTE_REQUIRED_STATUSES = DELIVERY_FAILED, REFUSED_ON_DELIVERY,
  RETURNED_TO_SELLER, CANCELLED
- BLOCKING_CART_WARNINGS = QUANTITY_REDUCED, OUT_OF_STOCK, PRODUCT_UNAVAILABLE
  (PRICE_CHANGED بيتعرض ولا بيمنع)
- api-routes.ts: دوال بترجّع مسارات، مثال:
  products: () => `${BASE}/products`,
  productBySlug: (slug: string) => `${BASE}/products/${slug}`,
  غطّي الـ 98 كلهم.
- sort-option: newest, price_asc, price_desc, name فقط. مفيش best_selling.
```

✅ `git commit -m "feat(core): foundation types, enums, constants"`

---

# الدفعة ٢ — الـ Models

## البنية

```
core/models/
├── common/       (خلصت في الدفعة ١)
├── identity/     auth · user · otp · password
├── catalog/      product · category · brand · attribute · variant · image
├── cart/         cart · guest-token
├── order/        order · checkout
├── address/      address
├── geo/          governorate · shipping
├── inventory/    inventory · stock-movement
├── invoice/      invoice
├── settlement/   remittance
├── admin/        dashboard · customer · audit · store-profile · export
└── index.ts      ← barrel واحد
```

## المخارج المتوقعة

| المجلد | الواجهات |
|---|---|
| `identity` | `UserResponse` · `AuthResponse` · `RegisterRequest` · `LoginRequest` · `RefreshRequest` · `LogoutRequest` · `OtpSendRequest` · `OtpVerifyRequest` · `ForgotPasswordRequest` · `ResetPasswordRequest` |
| `catalog` | `ProductSummaryResponse` · `ProductDetailResponse` · `VariantResponse` · `VariantAvailabilityResponse` · `CategoryNode` · `CategoryDetailResponse` · `BrandResponse` · `AttributeValueResponse` · `AttributeGroupResponse` · `FilterFacetsResponse` · `ImageResponse` · `ProductFilter` |
| `catalog/admin` | `ProductAdminResponse` · `ProductUpsertRequest` · `TranslationInput` · `VariantAdminResponse` · `VariantPreviewRequest` · `VariantPreviewResponse` · `VariantUpsertItem` · `VariantBulkUpsertRequest` · `AdminImageResponse` · `ImageUpdateRequest` · `CategoryUpsertRequest` · `BrandUpsertRequest` · `AttributeUpsertRequest` · `AttributeAdminResponse` |
| `cart` | `CartResponse` · `CartItemResponse` · `CartWarning` · `AddCartItemRequest` · `UpdateCartItemRequest` · `MergeCartRequest` · **`GuestTokenResponse`** |
| `order` | `OrderResponse` · `OrderSummaryResponse` · `OrderItemResponse` · `OrderTimelineEntry` · `OrderAddressSnapshot` · `PlaceOrderRequest` · `CheckoutAddressInput` · `CancelOrderRequest` · `UpdateFulfillmentRequest` |
| `address` | `AddressResponse` · `AddressUpsertRequest` |
| `geo` | `GovernorateResponse` · `ShippingQuoteRequest` · `ShippingQuoteResponse` · `ShippingZoneResponse` · `ShippingRateRequest` |
| `inventory` | `StockPositionResponse` · `ReceiveStockRequest` · `AdjustStockRequest` · `StockMovementResponse` |
| `invoice` | `InvoiceResponse` · `CancelInvoiceRequest` · `UninvoicedReport` |
| `settlement` | `OutstandingRemittanceResponse` · `CreateRemittanceRequest` · `RemittanceResponse` |
| `admin` | `DashboardResponse` · `CustomerSummaryResponse` · `CustomerDetailResponse` · `AuditEntryResponse` · `StoreProfileResponse` · `OrderExportFilter` |
| — | `PingResponse` |

## نقاط لازم تتقال للـ agent صراحة

**١. `AttributeAdminResponse` شكله مختلف عن الواجهة العامة.** الإداري بيرجّع `nameAr`/`nameEn` منفصلين و`variantDefining` و`filterable`، والعام بيرجّع `name` واحد مترجم. **مش نفس الواجهة** — ما تعيدش استخدامها.

**٢. `UserResponse.firstName` و `lastName` و `fullName` كلهم `string | null`** — بيرجعوا `null` من `POST /auth/me`.

**٣. `OrderResponse.cancellable` حقل من السيرفر.** ما تحسبش الإلغاء من الحالة.

**٤. `ProductAdminResponse.warnings: string[]`** — السيرفر بيقولك ليه المنتج مش قابل للنشر. اعرضها زي ما هي.

**٥. `CustomerDetailResponse.purchases.failedOrders`** — الرقم اللي بيغذّي `failed-orders-warning`.

**٦. `ShippingQuoteResponse` فيه `freeShippingApplied` و `amountToFreeShipping`** — الشحن المجاني **مفعّل**، عكس اللي في وثيقة العمل.

**٧. `codFee` سطر مستقل** على الطلب وعلى الـ quote.

## برومبت الـ agent

```
[عقد الـ agent]

الدفعة 2: اكتب كل الـ interfaces في core/models حسب الجدول في قسم "الدفعة ٢".

المصدر الوحيد هو أمثلة الـ JSON في العقد. لكل مثال، اقرأ كل حقل واستنتج
نوعه، وخلّي الحقول اللي بتظهر null في أي مثال nullable.

قواعد:
- كل المبالغ نوعها Money (المستورد من common)، حتى لو المثال رقم.
- التواريخ والأوقات string (ISO 8601) — مش Date.
- الحالات تستخدم الـ enums من الدفعة 1، مش string.
- Requests و Responses ملفات منفصلة أو أقسام معلّمة بوضوح في نفس الملف.
- AttributeAdminResponse (من GET /admin/attributes) واجهة مستقلة تماماً عن
  AttributeGroupResponse بتاعة الواجهة العامة — الشكل مختلف.
- اعمل core/models/index.ts بيصدّر كل حاجة.

في الآخر اكتب تقرير: أي حقل في العقد ما عرفتش نوعه بثقة.
```

✅ `git commit -m "feat(core): API models"`

---

# الدفعة ٣ — خدمات البنية التحتية

مش خدمات API. دي اللي كل حاجة تانية بتقف عليها.

## `guest-token.service.ts` — أهم ملف في الدفعة

⚠️ **اتغيّر جذرياً في آخر نسخة من العقد.** الرمز بقى **من السيرفر وموقّع**:

```
POST /api/v1/cart/guest-token  →  { "guestToken": "uuid.signature" }
```

**ممنوع توليد UUID في المتصفح.** ده كان الثغرة الأمنية رقم ١، واتقفلت.

النتيجة: الرمز **غير متزامن**، والـ interceptor ما ينفعش يستنّاه. الحل:

```ts
// يتنادى من APP_INITIALIZER، في المتصفح فقط
ensureToken(): Observable<string>   // موجود؟ رجّعه. مش موجود؟ اطلبه واحفظه.
getToken(): string | null           // قراءة متزامنة — للـ interceptor
clear(): void                       // بعد الدمج وبعد إنشاء الطلب
refresh(): Observable<string>       // عند 401 TOKEN_INVALID
```

التخزين في كوكي (مش `localStorage`) — أقرب لاتجاه الباك، وبيشتغل مع SSR.

## باقي الملفات

| الخدمة | مسؤوليتها |
|---|---|
| `token-storage.service.ts` | `accessToken` · `refreshToken` · كائن `user` — ⚠️ الاسم بييجي من `login` بس، `/auth/me` بترجّعه `null` |
| `language.service.ts` | `ar`/`en` + `dir` على `<html>` + الحفظ |
| `toast.service.ts` | نجاح/خطأ |
| `loading.service.ts` | عدّاد الطلبات |
| `confirm-dialog.service.ts` | `Observable<boolean>` |
| `seo.service.ts` | من `ProductDetailResponse.seo` |
| `file-download.util.ts` | `Blob` → تحميل، **داخل `isPlatformBrowser`** |

## برومبت الـ agent

```
[عقد الـ agent]

الدفعة 3: خدمات البنية التحتية في core/services.

guest-token.service.ts — الأهم:
- الرمز يتجاب من POST /api/v1/cart/guest-token (اقرأ العقد، قسم CartController).
- ممنوع توليد UUID محلياً نهائياً.
- التخزين في كوكي اسمها velora_guest_token، صلاحية سنة، SameSite=Lax.
- ensureToken(): لو الكوكي موجودة رجّعها كـ of(token)، وإلا اطلب من السيرفر
  واحفظ. استخدم shareReplay(1) عشان نداءين متوازيين ما يطلبوش رمزين.
- getToken(): قراءة متزامنة من الكوكي، للـ interceptor.
- refresh(): يمسح ويطلب رمز جديد — يتنادى عند 401 TOKEN_INVALID.
- clear(): بعد دمج السلة وبعد إنشاء طلب ناجح كضيف.
- كل ملامسة للكوكي داخل isPlatformBrowser. على السيرفر getToken() ترجّع null.

token-storage.service.ts:
- يخزّن accessToken و refreshToken وكائن UserResponse كامل.
- ملاحظة مهمة: POST /auth/me بترجّع firstName/lastName/fullName = null،
  فالاسم لازم يتحفظ من رد login/register ويفضل محفوظ.

الباقي (language, toast, loading, confirm-dialog, seo, file-download) اكتبهم
بواجهات بسيطة وتنفيذ فعلي — مش TODO.
```

✅ `git commit -m "feat(core): infrastructure services"`

---

# الدفعة ٤ — الـ Interceptors

**أخطر دفعة في الخطة.** منطق الـ 401 فيه ثلاث حالات مختلفة، ولو اتخلطوا هتطارد باجات وهمية أسابيع.

## `auth.interceptor.ts` — الشجرة الصح

| الرد | الشرط | التصرف |
|---|---|---|
| `401 UNAUTHORIZED` | المسار مش `/auth/*` | **جدّد** التوكن وأعد المحاولة |
| `401 TOKEN_INVALID` أو `TOKEN_EXPIRED` | المسار `/auth/refresh` | **اخرج** فوراً |
| `401 INVALID_CREDENTIALS` | من `/auth/login` | **سيبه يعدّي** — ده رد صح على بيانات غلط |
| `401 TOKEN_INVALID` | المسار سلة/شحن/طلبات | **مش شغل الـ interceptor ده** — بتاع رمز الضيف |

⚠️ من غير التفريق ده، محاولة دخول بكلمة سر غلط هتشغّل دورة تجديد وتخرّج المستخدم.

⚠️ **single-flight إجباري:** صفحة فيها 4 طلبات متوازية رجعوا `401` = 4 نداءات refresh، والتلاتة الأخيرة هتفشل لأن التوكن بيتدوّر (rotation). `shareReplay(1)` على الطلب الجاري.

## `guest-token.interceptor.ts`

- يضيف `X-Guest-Token` لمسارات `/cart` و `/orders` و `/shipping/quote`
- **بس لو مفيش `Authorization`** — العقد بيقول التوكن له الأولوية
- عند `401 TOKEN_INVALID` على المسارات دي: **اطلب رمز جديد وأعد المحاولة مرة واحدة**

## `error.interceptor.ts`

```ts
const problem = err.error as ApiError | undefined;
```

- يترجم `problem.code` من `ERROR_MESSAGES_*` حسب اللغة
- `400 VALIDATION_FAILED` معاه `errors[]` → **ما يتعرضش toast**، يترجّع للفورم
- `409 CONCURRENT_STOCK_CHANGE` → **إعادة محاولة تلقائية مرة واحدة**، مش رسالة خطأ
- `500` من `/cart/merge` أو `payment-status` أو `audit` → أخطاء باك معروفة، رسالة عامة

## `language.interceptor.ts` · `loading.interceptor.ts`

`Accept-Language` من `language.store` · عدّاد بيتجاهل الطلبات الصامتة.

## برومبت الـ agent

```
[عقد الـ agent]

الدفعة 4: الـ 5 interceptors في core/interceptors + تسجيلهم في CoreModule
بالترتيب: auth ← guest-token ← language ← error ← loading

auth.interceptor:
- يضيف Authorization من token-storage لو التوكن موجود.
- عند 401، افحص كود الخطأ من body (ApiError.code) قبل أي تصرف:
  * code === 'UNAUTHORIZED' والمسار مش تحت /auth/ → جدّد وأعد المحاولة
  * المسار /auth/refresh → امسح كل حاجة وحوّل على /auth/login
  * code === 'INVALID_CREDENTIALS' → مرّر الخطأ زي ما هو، بلا تجديد
  * code === 'TOKEN_INVALID' والمسار سلة/طلبات/شحن → مرّره، مش شغلك
- التجديد single-flight بـ shareReplay(1): الطلبات المتوازية تستنى نفس
  النداء، لأن refresh token بيتدوّر والنداء التاني هيفشل.

guest-token.interceptor:
- يضيف X-Guest-Token للمسارات: /cart, /orders, /shipping/quote
- بس لو الطلب مفيهوش Authorization (التوكن أولوية حسب العقد).
- عند 401 TOKEN_INVALID على المسارات دي: نادِ guestTokenService.refresh()
  وأعد الطلب مرة واحدة فقط (احرس ضد الحلقة اللانهائية).

error.interceptor:
- اقرأ err.error كـ ApiError، وترجم code من ERROR_MESSAGES حسب اللغة الحالية.
- VALIDATION_FAILED مع errors[]: ما تعرضش toast — ارمِ خطأ مكتوب بالأنواع
  فيه fieldErrors عشان الفورم يعرضهم تحت الحقول.
- CONCURRENT_STOCK_CHANGE: أعد المحاولة تلقائياً مرة واحدة (retry(1)) قبل
  ما تعرض خطأ — العقد بيقول العميل يعيد المحاولة.
```

✅ `git commit -m "feat(core): HTTP interceptors"`

---

# الدفعة ٥ — خدمات العميل (39 endpoint)

| الخدمة | الميثودز |
|---|---|
| `auth-api` | `register` · `login` · `refresh` · `logout` · `logoutAll` · `me` · `sendOtp` · `verifyOtp` · `forgotPassword` · `resetPassword` |
| `catalog-api` | `searchProducts` · `getProduct` · `getRelated` · `getFeatured` · `getNewArrivals` · `getCategoryTree` · `getCategory` · `getFilters` · `getBrands` · `getAvailability` |
| `cart-api` | `issueGuestToken` · `getCart` · `addItem` · `updateItem` · `removeItem` · `clear` · `merge` |
| `geo-api` | `getGovernorates` · `quote` |
| `address-api` | `list` · `create` · `update` · `remove` · `setDefault` |
| `order-api` | `place` · `myOrders` · `getOrder` · `cancel` · `downloadInvoice` |
| `system-api` | `ping` |

## أربع نقاط حرجة

**١. `me()` هي `POST` مش `GET`.** سهل جداً تتكتب غلط.

**٢. `logout()` بتاخد `refreshToken` في الـ body** وهي endpoint عام — مش زرار بيعتمد على التوكن الحالي.

**٣. `place()` بتاخد `Idempotency-Key` كمعامل** وتحطه في الهيدر مباشرة — **مش في الـ interceptor**، لأنه مش عارف إمتى المحاولة جديدة.

قاعدة المفتاح من العقد:

| الحالة | المفتاح |
|---|---|
| المحاولة الأولى | مفتاح جديد |
| ضغطتين والأولى شغالة | نفس المفتاح → `409 DUPLICATE_ORDER` = "جاري المعالجة" |
| نفس الـ body والأولى نجحت | نفس المفتاح → نفس الطلب |
| **المحاولة فشلت وعايز يعيد** | **مفتاح جديد** ← عكس اللي في الوثائق القديمة |

**٤. `searchProducts` بتبني `HttpParams` بنفسها:** المصفوفات مفصولة بفواصل، والحقول الفاضية **تتشال** مش تتبعت `undefined`.

## برومبت الـ agent

```
[عقد الـ agent]

الدفعة 5: خدمات API للعميل في core/services/api. غطّي 39 endpoint
(الجدول في قسم "الدفعة ٥"، والتفاصيل في العقد).

نقاط لازم تتنفذ بالظبط:
- auth-api.me() تستخدم POST مش GET.
- auth-api.logout(refreshToken) تبعت التوكن في الـ body.
- order-api.place(body, idempotencyKey) تحط Idempotency-Key في الهيدر
  من المعامل، مش من interceptor.
- order-api.downloadInvoice(invoiceNumber) ترجّع Observable<Blob> بـ
  responseType: 'blob'.
- catalog-api.searchProducts(filter: ProductFilter): ابنِ HttpParams بدالة
  خاصة — شيل أي حقل undefined أو null أو '' ، وحوّل المصفوفات لقيم
  مفصولة بفواصل (brandIds=1,2).
- cart-api: كل الميثودز بترجّع CartResponse كاملة (العقد بيأكد ده)، ما عدا
  issueGuestToken اللي بترجّع GuestTokenResponse.
- cart-api.merge(): العقد بيحذّر إن نداء بدون Bearer token بيدّي 500 مش 401
  بسبب باج في الباك — اكتب تعليق تحذيري فوق الميثود.
- أحجام الصفحات من APP_CONFIG، مش أرقام مكتوبة.
```

✅ `git commit -m "feat(core): customer API services"`

---

# الدفعة ٦ — خدمات الأدمن (58 endpoint)

| الخدمة | الميثودز |
|---|---|
| `admin-dashboard-api` | `get` |
| `admin-product-api` | `list` · `get` · `create` · `update` · `publish` · `unpublish` · `archive` · `duplicate` · `listImages` · `uploadImage` · `updateImage` · `deleteImage` |
| `admin-variant-api` | `listByProduct` · `preview` · `bulkUpsert` · `archive` |
| `admin-taxonomy-api` | `listCategories` · `createCategory` · `updateCategory` · `listBrands` · `createBrand` · `updateBrand` · `listAttributes` · `createAttribute` · `updateAttribute` |
| `admin-inventory-api` | `getPosition` · `lowStock` · `receive` · `adjust` · `movements` |
| `admin-order-api` | `list` · `get` · `confirm` · `setFulfillment` · `setPayment` · `cancel` |
| `admin-invoice-api` | `list` · `get` · `downloadPdf` · `issue` · `cancel` · `uninvoiced` |
| `admin-remittance-api` | `outstanding` · `create` · `list` · `get` · `cancel` |
| `admin-customer-api` | `list` · `get` |
| `admin-shipping-api` | `getZones` · `setRate` |
| `admin-export-api` | `accounting` · `pickingList` |
| `admin-audit-api` | `list` · `byEntity` |
| `admin-settings-api` | `getStoreProfile` · `updateStoreProfile` |

## خمس نقاط حرجة

**١. تلاتة بياخدوا query params مش body:**

```ts
confirm(orderId, note?)                 // ?note=
setPayment(orderId, status, note?)      // ?status=&note=
cancelRemittance(id, reason)            // ?reason=
```

**٢. `uploadImage` بـ `FormData`** — لا تحط `Content-Type` يدوي، المتصفح بيحطه بالـ boundary.

**٣. التصديرات بترجّع ملفات:** `accounting` → `.xlsx` · `pickingList` → PDF. الاتنين `Blob`.

**٤. `setPayment` بقيمة غلط بيدّي `500` مش `400`** (باج معروف في الباك) — الحل إن الواجهة ما تسمحش بغير قيم `PaymentStatus`.

**٥. `listAttributes` بتقبل `?variantDefining=true`** — مفيدة جداً لشاشة توليد الـ variants: تجيب الخصائص المولّدة للـ SKU بس.

💡 التلات `list` الجداد (`listCategories` · `listBrands` · `listAttributes`) اتضافوا في آخر نسخة من العقد وبيرجّعوا **غير الفعّال كمان** — ودي بالظبط اللي شاشات إدارة الكتالوج محتاجاها.

## برومبت الـ agent

```
[عقد الـ agent]

الدفعة 6: خدمات API للأدمن في core/services/api. غطّي 58 endpoint
(الجدول في قسم "الدفعة ٦").

نقاط لازم تتنفذ بالظبط:
- admin-order-api.confirm / setPayment و admin-remittance-api.cancel:
  البيانات في HttpParams مش في الـ body. راجع العقد.
- admin-product-api.uploadImage(productId, file, variantId?): FormData
  بـ part اسمه file، و variantId كـ query param. ما تحطش Content-Type.
- admin-invoice-api.downloadPdf و admin-export-api.accounting/pickingList:
  responseType: 'blob'.
- admin-taxonomy-api.listAttributes(variantDefining?: boolean): الباراميتر
  اختياري، وشيله من الـ params لو undefined.
- setPayment: اكتب تعليق إن قيمة غير صالحة بتدّي 500 من الباك، فالواجهة
  لازم تقيّد الإدخال بقيم PaymentStatus.
- كل القوائم بترجّع PageResponse<T> ما عدا: lowStock و getZones و
  listCategories و listBrands و listAttributes و listImages و
  listByProduct (مصفوفات عادية) و uninvoiced و outstanding (كائنات).
```

✅ `git commit -m "feat(core): admin API services"`

---

# الدفعة ٧ — الـ Stores

أربع stores بـ signals. **مفيش NgRx في V1.**

| الملف | الحالة | ملاحظة |
|---|---|---|
| `auth.store.ts` | `user` · `isLoggedIn` · `isAdmin` · `isReady` | الاسم من `login` لأن `/me` بترجّعه `null` |
| `cart.store.ts` | `cart` · `itemCount` · `checkoutReady` · `blockingWarnings` | **مصدر الحقيقة الوحيد** |
| `language.store.ts` | `lang` · `isRtl` · `dir` | |
| `ui.store.ts` | `drawerOpen` · `filtersOpen` · `loading` | |

🔑 **`cart.store` قاعدة صارمة:** كل رد سلة (٦ عمليات) بيتحط في الـ store مباشرة. **ممنوع تحديث تفاؤلي محلي وممنوع حساب أي إجمالي في الواجهة** — العقد بيقول السلة بتتحسب من جديد في كل نداء.

🔑 **`blockingWarnings` computed** بيفلتر `warnings` بـ `BLOCKING_CART_WARNINGS` — عشان تلوّن السطر اللي فيه المشكلة، مش بس تقفل الزرار.

## برومبت الـ agent

```
[عقد الـ agent]

الدفعة 7: core/state — أربع stores بـ Angular signals.

auth.store.ts:
- signals خاصة، و computed عامة للقراءة فقط (readonly).
- بتحمّل الحالة الأولية من token-storage عند الإقلاع.
- isAdmin = user.roles تحتوي ADMIN.
- setSession(AuthResponse) و clear().

cart.store.ts:
- set(cart: CartResponse) هي الطريقة الوحيدة للتحديث.
- computed: itemCount, totalQuantity, checkoutReady, blockingWarnings,
  hasPriceChange.
- ممنوع أي حساب مبالغ داخل الـ store — كل الأرقام من الرد.

language.store.ts: lang, isRtl, dir. عند التغيير حدّث dir على documentElement
داخل isPlatformBrowser.

ui.store.ts: حالة الواجهة فقط.

مفيش استدعاءات HTTP في أي store — الخدمات هي اللي بتنادي والـ component
بيحط الرد في الـ store.
```

✅ `git commit -m "feat(core): signal stores"`

---

# الدفعة ٨ — الجاردات والتشغيل والتحقق

## الجاردات (functional)

| الملف | المنطق |
|---|---|
| `auth.guard.ts` | مسجّل، وإلا `/auth/login?returnUrl=` |
| `admin.guard.ts` | `isAdmin`، وإلا صفحة 403 |
| `guest-only.guard.ts` | يمنع `/auth/login` وأنت داخل |
| `checkout-ready.guard.ts` | يقرا `cart.store.checkoutReady` — ولو السلة لسه ما اتحمّلتش، يحمّلها الأول |
| `unsaved-changes.guard.ts` | `CanDeactivate` لفورمات الأدمن |

## `APP_INITIALIZER`

بالترتيب ده بالظبط:

1. اقرأ اللغة واضبط `dir`
2. لو فيه `accessToken` → `POST /auth/me` لتأكيد الجلسة
3. لو **مفيش** جلسة → `guestToken.ensureToken()`
4. حمّل السلة

⚠️ **كله داخل `isPlatformBrowser`.** على السيرفر التطبيق يرندر كزائر بدون حالة.

## التحقق النهائي

```bash
ng build
npx tsc --noEmit
```

ثم راجع جدول الـ 98 endpoint تحت — **كل سطر لازم يكون ليه ميثود**.

## برومبت الـ agent

```
[عقد الـ agent]

الدفعة 8: الجاردات + التشغيل + التحقق.

1. خمس جاردات functional في core/guards حسب الجدول.
2. APP_INITIALIZER في CoreModule بالترتيب: اللغة ← تأكيد الجلسة (لو فيه
   توكن) ← رمز الضيف (لو مفيش جلسة) ← تحميل السلة. كله داخل
   isPlatformBrowser، وعلى السيرفر يرجّع فوراً بدون أي نداء شبكة.
3. اربط الجاردات في app-routing.module.ts و admin-routing.module.ts.
4. شغّل ng build و npx tsc --noEmit.
5. اكتب تقرير نهائي: قارن كل ميثود في core/services/api بجدول الـ 98
   endpoint، واذكر أي endpoint مالوش ميثود وأي ميثود مالوش endpoint.
```

✅ `git commit -m "feat(core): guards and app bootstrap"`

---

# جدول التحقق — 98 endpoint

## العميل — 39

| # | Endpoint | الخدمة.الميثود |
|---|---|---|
| 1 | `POST /auth/register` | `auth.register` |
| 2 | `POST /auth/login` | `auth.login` |
| 3 | `POST /auth/refresh` | `auth.refresh` |
| 4 | `POST /auth/logout` | `auth.logout` |
| 5 | `POST /auth/logout-all` | `auth.logoutAll` |
| 6 | **`POST`** `/auth/me` | `auth.me` |
| 7 | `POST /auth/otp/send` | `auth.sendOtp` |
| 8 | `POST /auth/otp/verify` | `auth.verifyOtp` |
| 9 | `POST /auth/password/forgot` | `auth.forgotPassword` |
| 10 | `POST /auth/password/reset` | `auth.resetPassword` |
| 11 | `GET /products` | `catalog.searchProducts` |
| 12 | `GET /products/{slug}` | `catalog.getProduct` |
| 13 | `GET /products/{id}/related` | `catalog.getRelated` |
| 14 | `GET /products/featured` | `catalog.getFeatured` |
| 15 | `GET /products/new-arrivals` | `catalog.getNewArrivals` |
| 16 | `GET /variants/{id}/availability` | `catalog.getAvailability` |
| 17 | `GET /brands` | `catalog.getBrands` |
| 18 | `GET /categories/tree` | `catalog.getCategoryTree` |
| 19 | `GET /categories/{slug}` | `catalog.getCategory` |
| 20 | `GET /categories/filters` | `catalog.getFilters` |
| 21 | **`POST /cart/guest-token`** | `cart.issueGuestToken` |
| 22 | `GET /cart` | `cart.getCart` |
| 23 | `POST /cart/items` | `cart.addItem` |
| 24 | `PATCH /cart/items/{itemId}` | `cart.updateItem` |
| 25 | `DELETE /cart/items/{itemId}` | `cart.removeItem` |
| 26 | `DELETE /cart` | `cart.clear` |
| 27 | `POST /cart/merge` | `cart.merge` |
| 28 | `POST /orders` | `order.place` |
| 29 | `GET /me/orders` | `order.myOrders` |
| 30 | `GET /me/orders/{orderNumber}` | `order.getOrder` |
| 31 | `POST /me/orders/{n}/cancel` | `order.cancel` |
| 32 | `GET /me/invoices/{n}/pdf` | `order.downloadInvoice` |
| 33 | `GET /me/addresses` | `address.list` |
| 34 | `POST /me/addresses` | `address.create` |
| 35 | `PUT /me/addresses/{id}` | `address.update` |
| 36 | `DELETE /me/addresses/{id}` | `address.remove` |
| 37 | `PUT /me/addresses/{id}/default` | `address.setDefault` |
| 38 | `GET /geo/governorates` | `geo.getGovernorates` |
| 39 | `POST /shipping/quote` | `geo.quote` |

## الأدمن — 58

| # | Endpoint | الخدمة.الميثود |
|---|---|---|
| 40 | `GET /admin/dashboard` | `dashboard.get` |
| 41–48 | `/admin/products` (list · get · create · update · publish · unpublish · archive · duplicate) | `product.*` |
| 49–52 | `/admin/products/{id}/images` (list · upload · update · delete) | `product.*Image*` |
| 53–56 | variants (listByProduct · preview · bulkUpsert · archive) | `variant.*` |
| 57 | **`GET /admin/categories`** | `taxonomy.listCategories` |
| 58 | `POST /admin/categories` | `taxonomy.createCategory` |
| 59 | `PUT /admin/categories/{id}` | `taxonomy.updateCategory` |
| 60 | **`GET /admin/brands`** | `taxonomy.listBrands` |
| 61 | `POST /admin/brands` | `taxonomy.createBrand` |
| 62 | `PUT /admin/brands/{id}` | `taxonomy.updateBrand` |
| 63 | **`GET /admin/attributes`** | `taxonomy.listAttributes` |
| 64 | `POST /admin/attributes` | `taxonomy.createAttribute` |
| 65 | `PUT /admin/attributes/{id}` | `taxonomy.updateAttribute` |
| 66–70 | inventory (position · lowStock · receive · adjust · movements) | `inventory.*` |
| 71–76 | orders (list · get · confirm · fulfillment · payment · cancel) | `order.*` |
| 77–78 | customers (list · get) | `customer.*` |
| 79–84 | invoices (list · get · pdf · issue · cancel · uninvoiced) | `invoice.*` |
| 85–86 | shipping (zones · setRate) | `shipping.*` |
| 87–88 | audit (list · byEntity) | `audit.*` |
| 89–90 | exports (accounting · pickingList) | `export.*` |
| 91–92 | store profile (get · update) | `settings.*` |
| 93–97 | remittances (outstanding · create · list · get · cancel) | `remittance.*` |

## النظام — 1

| 98 | `GET /ping` | `system.ping` |

---

# ملخص التنفيذ

| الدفعة | المخرج | الخطورة |
|---|---|---|
| 1 | الأساس والـ enums والثوابت | 🔴 لو غلط، بيتكرر في 90 ملف |
| 2 | كل الـ models | 🟡 |
| 3 | البنية التحتية + رمز الضيف الجديد | 🔴 اتغيّر في آخر نسخة من العقد |
| 4 | الـ interceptors | 🔴 منطق الـ 401 بثلاث حالات |
| 5 | خدمات العميل (39) | 🟡 الـ Idempotency |
| 6 | خدمات الأدمن (58) | 🟢 |
| 7 | الـ stores | 🟡 |
| 8 | الجاردات والتشغيل | 🟢 |

💡 نفّذ **دفعة واحدة لكل جولة agent**. الملف ده + `__VELORA_API_Contract_last.txt` هما السياق الثابت في كل جولة.

⚠️ **بعد الدفعة ٤، اختبر يدوياً قبل ما تكمل:** سجّل دخول، خلّي التوكن يقع، وشوف الدورة بتشتغل صح. ثمن اكتشاف باج في الـ interceptor بعد 4 دفعات أغلى بكتير من ثمن اختبار دقيقتين.
