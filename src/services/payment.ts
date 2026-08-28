// تكامل الدفع (Paymob/Stripe)
//
// ملحوظة مهمة: رد POST /Orders/checkout لسه مش موثّق رسميًا في الـ swagger
// (زي أغلب الردود في هذا الـ backend)، فمش متأكدين بالظبط اسم الحقل اللي بيرجع
// فيه رابط صفحة الدفع (لو Paymob بيرجّع iframe/redirect URL من السيرفر).
// بنجرب أكتر من اسم حقل محتمل هنا بدل ما نفترض شكل ثابت.
//
// لو الـ backend لسه مبيرجعش رابط دفع حقيقي، extractPaymentUrl هترجع undefined
// وهيفضل سلوك الموقع زي ما هو دلوقتي (تأكيد الطلب فورًا من غير خطوة دفع منفصلة).
export function extractPaymentUrl(checkoutResponse: any): string | undefined {
  const data = checkoutResponse?.data ?? checkoutResponse;
  const candidates = [
    data?.paymentUrl,
    data?.paymentIframeUrl,
    data?.iframeUrl,
    data?.iframe_url,
    data?.redirectUrl,
    data?.checkoutUrl,
    data?.payment?.url,
    data?.payment?.iframeUrl,
  ];
  return candidates.find((v) => typeof v === "string" && v.length > 0);
}

// أهم حاجة أمنيًا: مفيش أي تأكيد دفع بيحصل هنا على الفرونت إند. تأكيد إن
// الفلوس اتحصّلت فعليًا لازم يتم من السيرفر (webhook من Paymob بيتحقق منه
// بالـ HMAC السري)، مش من رجوع المستخدم لصفحة الـ callback دي — أي حد يقدر
// يعدّل الـ query params في المتصفح، فمينفعش نعتمد عليها كتأكيد نهائي.
export interface PaymobCallbackParams {
  success?: boolean;
  pending?: boolean;
  orderId?: string;
}

export function parsePaymobCallback(searchParams: URLSearchParams): PaymobCallbackParams {
  const success = searchParams.get("success");
  const pending = searchParams.get("pending");
  return {
    success: success === "true",
    pending: pending === "true",
    orderId: searchParams.get("merchant_order_id") ?? searchParams.get("order") ?? undefined,
  };
}
