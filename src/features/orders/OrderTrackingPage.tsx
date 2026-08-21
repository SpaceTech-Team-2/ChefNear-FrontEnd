import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  XCircle,
  ClipboardList,
} from "lucide-react";
import {
  getOrderByLocalId,
  type StoredOrder,
} from "../../services/orderHistory";

// ملحوظة: الـ backend معندوش endpoint لجلب حالة الطلب لحظيًا (GET)، فالمراحل
// المعروضة هنا افتراضية بترتيب منطقي بس مش متابعة حقيقية للـ backend —
// الإلغاء وحده هو اللي بيتم فعليًا عن طريق الـ API.
const STEPS = [
  { key: "placed", label: "تم استلام الطلب" },
  { key: "preparing", label: "جاري التحضير" },
  { key: "ready", label: "جاهز للتوصيل" },
  { key: "delivered", label: "تم التسليم" },
];

export default function OrderTrackingPage() {
  const { localId } = useParams<{ localId: string }>();
  const [order, setOrder] = useState<StoredOrder | undefined>();

  useEffect(() => {
    if (localId) setOrder(getOrderByLocalId(localId));
  }, [localId]);

  if (!order) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#FFF9F6] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-black text-gray-900">لم يتم العثور على الطلب</h2>
          <Link
            to="/orders"
            className="inline-block bg-[#B34510] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#A03E0F] transition-colors"
          >
            طلباتي
          </Link>
        </div>
      </div>
    );
  }

  const isCancelled = order.status === "Cancelled";
  const canCancel = !isCancelled && Boolean(order.serverOrderId);

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF9F6] p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-gray-900">تتبع الطلب</h1>
          <Link to="/orders" className="text-xs font-bold text-[#B34510] hover:underline">
            كل طلباتي
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-rose-100/80 shadow-sm p-6 space-y-6">
          {isCancelled ? (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
              <XCircle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <h3 className="font-bold text-red-700 text-sm">تم إلغاء الطلب</h3>
                {order.cancellationReason && (
                  <p className="text-xs text-red-500 mt-0.5">
                    السبب: {order.cancellationReason}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {STEPS.map((step, idx) => (
                <div key={step.key} className="flex items-center gap-3">
                  {idx === 0 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                  )}
                  <span className={idx === 0 ? "font-bold text-gray-900 text-sm" : "text-gray-400 text-sm"}>
                    {step.label}
                  </span>
                </div>
              ))}
              <p className="text-[11px] text-gray-400 pt-1">
                * الخطوات دي إرشادية — الـ backend لسه معندوش تحديث حالة لحظي للطلب.
              </p>
            </div>
          )}

          <div className="border-t border-gray-50 pt-4 space-y-2">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-gray-400" />
              تفاصيل الطلب
            </h3>
            {order.items.map((item) => (
              <div key={item.dishId} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-bold text-gray-800">{item.price * item.quantity} ج.م</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm font-black pt-2 border-t border-gray-50">
              <span>الإجمالي</span>
              <span className="text-[#B34510]">{order.total} ج.م</span>
            </div>
          </div>

          {canCancel && (
            <Link
              to={`/orders/${order.localId}/cancel`}
              className="block w-full text-center text-red-600 border border-red-100 font-bold py-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm"
            >
              إلغاء الطلب
            </Link>
          )}

          {!order.serverOrderId && !isCancelled && (
            <p className="text-[11px] text-gray-400 text-center">
              مفيش معرف طلب مؤكد من السيرفر لهذا الطلب، فمش هيتم إلغاؤه من هنا.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
