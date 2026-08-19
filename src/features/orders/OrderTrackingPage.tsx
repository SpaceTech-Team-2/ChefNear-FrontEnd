import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  CheckCircle2,
  Circle,
  XCircle,
  ClipboardList,
  Loader2,
} from "lucide-react";
import {
  getOrderByLocalId,
  markOrderCancelled,
  type StoredOrder,
} from "../../services/orderHistory";
import { cancelOrder, type CancellationReasonType } from "../../services/api";

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
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [reason, setReason] = useState<CancellationReasonType>("ClientChangedMind");
  const [reasonText, setReasonText] = useState("");

  useEffect(() => {
    if (localId) setOrder(getOrderByLocalId(localId));
  }, [localId]);

  const cancelMutation = useMutation({
    mutationFn: () => {
      if (!order?.serverOrderId) {
        throw new Error("لا يوجد معرف طلب صالح من السيرفر لإلغائه.");
      }
      return cancelOrder(order.serverOrderId, {
        reasonType: reason,
        reasonFreeText: reasonText || undefined,
      });
    },
    onSuccess: () => {
      if (order) {
        markOrderCancelled(order.localId, reasonText || reason);
        setOrder({ ...order, status: "Cancelled", cancellationReason: reasonText || reason });
      }
      setShowCancelForm(false);
    },
    onError: (err: any) => {
      setCancelError(
        err?.response?.data?.message || err?.message || "تعذر إلغاء الطلب."
      );
    },
  });

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

          {canCancel && !showCancelForm && (
            <button
              onClick={() => setShowCancelForm(true)}
              className="w-full text-red-600 border border-red-100 font-bold py-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm"
            >
              إلغاء الطلب
            </button>
          )}

          {!order.serverOrderId && !isCancelled && (
            <p className="text-[11px] text-gray-400 text-center">
              مفيش معرف طلب مؤكد من السيرفر لهذا الطلب، فمش هيتم إلغاؤه من هنا.
            </p>
          )}

          {showCancelForm && (
            <div className="space-y-3 border border-red-100 rounded-2xl p-4">
              <label className="text-xs font-bold text-gray-600">سبب الإلغاء</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as CancellationReasonType)}
                className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 outline-none"
              >
                <option value="ClientChangedMind">غيّرت رأيي</option>
                <option value="ClientOrderDelayed">الطلب اتأخر</option>
                <option value="ClientIncorrectDetails">بيانات غير صحيحة</option>
                <option value="ClientOther">سبب آخر</option>
              </select>
              <textarea
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="تفاصيل إضافية (اختياري)"
                rows={2}
                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none resize-none"
              />
              {cancelError && (
                <p className="text-xs text-red-600 bg-red-50 rounded-lg p-2">{cancelError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => cancelMutation.mutate()}
                  disabled={cancelMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-2.5 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60 text-sm"
                >
                  {cancelMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>تأكيد الإلغاء</span>
                </button>
                <button
                  onClick={() => setShowCancelForm(false)}
                  className="flex-1 bg-gray-50 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-100 transition-colors text-sm"
                >
                  تراجع
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
