import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, AlertTriangle, Loader2 } from "lucide-react";
import {
  getOrderByLocalId,
  markOrderCancelled,
  type StoredOrder,
} from "../../services/orderHistory";
import { cancelOrder, type CancellationReasonType } from "../../services/api";

const reasons: { value: CancellationReasonType; label: string }[] = [
  { value: "ClientChangedMind", label: "غيّرت رأيي" },
  { value: "ClientOrderDelayed", label: "الطلب اتأخر كتير" },
  { value: "ClientIncorrectDetails", label: "بيانات الطلب غلط" },
  { value: "ClientOther", label: "سبب آخر" },
];

export default function CancelOrderPage() {
  const { localId } = useParams<{ localId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<StoredOrder | undefined>();
  const [reason, setReason] = useState<CancellationReasonType>("ClientChangedMind");
  const [reasonText, setReasonText] = useState("");
  const [error, setError] = useState<string | null>(null);

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
      if (order) markOrderCancelled(order.localId, reasonText || reason);
      navigate(`/orders/${localId}`, { replace: true });
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || err?.message || "تعذر إلغاء الطلب، حاول تاني.");
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

  if (order.status === "Cancelled") {
    return (
      <div dir="rtl" className="min-h-screen bg-[#FFF9F6] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-black text-gray-900">الطلب ده اتلغى بالفعل</h2>
          <Link
            to={`/orders/${localId}`}
            className="inline-block bg-[#B34510] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#A03E0F] transition-colors"
          >
            رجوع لتتبع الطلب
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF9F6] p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            to={`/orders/${localId}`}
            className="p-2 bg-white border border-rose-100 rounded-full text-[#A03E0F] hover:bg-rose-50 transition-colors shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">إلغاء الطلب</h1>
        </div>

        <div className="bg-white rounded-3xl border border-rose-100/80 shadow-sm p-6 space-y-5">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              إلغاء الطلب نهائي ومش هيتراجع. لو الطبق دخل التحضير بالفعل، الشيف
              ممكن يتواصل معاك بخصوص الإلغاء.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600">سبب الإلغاء</label>
            <div className="grid grid-cols-1 gap-2">
              {reasons.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setReason(r.value)}
                  className={`text-right px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                    reason === r.value
                      ? "bg-[#B34510] text-white border-[#B34510]"
                      : "bg-[#FFF8F6] text-[#5F2108] border-[#EACEC5]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600">تفاصيل إضافية (اختياري)</label>
            <textarea
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              rows={3}
              className="w-full bg-[#FFF8F6] border border-[#EACEC5] rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#B34510]/40 resize-none"
              placeholder="اكتب أي تفاصيل تساعدنا نفهم سبب الإلغاء..."
            />
          </div>

          {!order.serverOrderId && (
            <p className="text-xs text-gray-400 text-center">
              مفيش معرف طلب مؤكد من السيرفر لهذا الطلب، فمش هيتم إلغاؤه من هنا.
            </p>
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 text-center">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Link
              to={`/orders/${localId}`}
              className="flex-1 flex items-center justify-center bg-[#FFEAE3] text-[#A03E0F] font-bold py-3 rounded-xl text-sm"
            >
              تراجع
            </Link>
            <button
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending || !order.serverOrderId}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm"
            >
              {cancelMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>تأكيد إلغاء الطلب</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
