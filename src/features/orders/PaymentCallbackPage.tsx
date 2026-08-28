import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import { getOrders, type StoredOrder } from "../../services/orderHistory";
import { parsePaymobCallback } from "../../services/payment";
import { getOrderById } from "../../services/api";

// الصفحة اللي Paymob بيرجّع المستخدم ليها بعد الدفع (redirection_url في
// إعدادات التكامل عند الـ backend/Paymob لازم تبقى مضبوطة على المسار ده:
// https://<domain>/payment/callback).
//
// أهم حاجة هنا: مبنعتمدش على الـ query params (success/pending) كتأكيد نهائي
// للدفع — أي حد يقدر يعدّلها في المتصفح. بنستخدمها بس كتلميح فوري للـ UI،
// والتأكيد الحقيقي بييجي من حالة الطلب على السيرفر (GET /Orders/{id})، اللي
// المفروض يكون اتحدّث من webhook حقيقي بين Paymob والـ backend.
export default function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const { success, pending, orderId } = parsePaymobCallback(searchParams);
  const [matchedOrder, setMatchedOrder] = useState<StoredOrder | undefined>();

  useEffect(() => {
    const orders = getOrders();
    const match = orderId
      ? orders.find((o) => o.serverOrderId === orderId)
      : orders[0]; // آخر طلب اتعمل من المتصفح ده لو مفيش merchant_order_id راجع
    setMatchedOrder(match);
  }, [orderId]);

  const { data: liveOrderRes, isLoading } = useQuery({
    queryKey: ["payment-order-status", matchedOrder?.serverOrderId],
    queryFn: () => getOrderById(matchedOrder!.serverOrderId as string),
    enabled: Boolean(matchedOrder?.serverOrderId),
    retry: 2,
  });

  // قيم enum حالة الطلب مش موثّقة في الـ swagger، فمش هنخمّن أي قيمة بالظبط
  // بتعني "الدفع فشل". اللي متأكدين منه بس: لو السيرفر عنده الطلب أصلاً
  // ومش "Cancelled"، يبقى على الأقل اتسجل. باقي التأكيد بييجي من تلميح
  // Paymob نفسه (success/pending) لحد ما الـ backend يوثّق قيم الحالة.
  const serverStatus: string | undefined =
    liveOrderRes?.data?.status ?? liveOrderRes?.data?.orderStatus;
  const serverKnowsOrder = Boolean(liveOrderRes) && serverStatus !== "Cancelled";

  const isSuccess = success || (serverKnowsOrder && !pending);
  const isPending = !isSuccess && (pending || isLoading);

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF9F6] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-100/80 shadow-sm p-8 text-center space-y-4">
        {isPending && (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            </div>
            <h2 className="text-xl font-black text-gray-900">جاري تأكيد الدفع...</h2>
            <p className="text-sm text-gray-500">
              استنى لحظات وإحنا بنتأكد من عملية الدفع مع البنك.
            </p>
          </>
        )}

        {!isPending && isSuccess && (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900">تم الدفع بنجاح</h2>
            <p className="text-sm text-gray-500">جاري تجهيز طلبك، تقدري تتابعيه من "طلباتي".</p>
            <Link
              to={matchedOrder ? `/orders/${matchedOrder.localId}` : "/orders"}
              className="inline-block bg-[#B34510] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#A03E0F] transition-colors mt-2"
            >
              تتبع طلبي
            </Link>
          </>
        )}

        {!isPending && !isSuccess && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-black text-gray-900">لم تكتمل عملية الدفع</h2>
            <p className="text-sm text-gray-500">حصلت مشكلة أثناء الدفع، تقدري تحاولي تاني من سلة التسوق.</p>
            <Link
              to="/cart"
              className="inline-block bg-[#B34510] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#A03E0F] transition-colors mt-2"
            >
              الرجوع للسلة
            </Link>
          </>
        )}

        <div className="pt-2">
          <Link to="/orders" className="text-xs text-gray-400 hover:underline flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            <span>أو شوف كل طلباتي</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
