import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Circle,
  XCircle,
  ClipboardList,
  Star,
} from "lucide-react";
import {
  getOrderByLocalId,
  type StoredOrder,
} from "../../services/orderHistory";
import { getOrderById } from "../../services/api";

const STEPS = [
  { key: "placed", label: "تم استلام الطلب" },
  { key: "preparing", label: "جاري التحضير" },
  { key: "ready", label: "جاهز للتوصيل" },
  { key: "delivered", label: "تم التسليم" },
];

// خريطة دفاعية بين قيم الحالة المحتملة من السيرفر ورقم الخطوة المقابلة —
// شكل الرد الحقيقي لسه مش موثّق رسميًا فبنقرأه دفاعيًا.
const STATUS_STEP: Record<string, number> = {
  Pending: 0,
  Placed: 0,
  Accepted: 1,
  Preparing: 1,
  Ready: 2,
  OutForDelivery: 2,
  Delivered: 3,
  Completed: 3,
};

export default function OrderTrackingPage() {
  const { localId } = useParams<{ localId: string }>();
  const [order, setOrder] = useState<StoredOrder | undefined>();
  const [triedLocal, setTriedLocal] = useState(false);

  useEffect(() => {
    if (localId) setOrder(getOrderByLocalId(localId));
    setTriedLocal(true);
  }, [localId]);

  // لو الـ id مش موجود محليًا، يبقى ده على الأغلب order id حقيقي من السيرفر
  // (طلب اتعمل من جهاز تاني مثلاً) — بنجيبه مباشرة بدل ما نعرض "مش موجود".
  const { data: fallbackOrderRes, isLoading: fallbackLoading } = useQuery({
    queryKey: ["order-fallback", localId],
    queryFn: () => getOrderById(localId as string),
    enabled: triedLocal && !order && Boolean(localId),
    retry: false,
  });

  const serverFallback = fallbackOrderRes?.data;
  const synthesizedOrder: StoredOrder | undefined =
    !order && serverFallback
      ? {
          localId: localId as string,
          serverOrderId: serverFallback.id ?? serverFallback.orderId ?? localId!,
          createdAt: serverFallback.createdAt ?? serverFallback.orderDate ?? new Date().toISOString(),
          items: (serverFallback.items ?? serverFallback.orderItems ?? []).map((it: any) => ({
            dishId: it.dishId ?? it.id ?? "",
            name: it.dishName ?? it.name ?? "صنف",
            quantity: it.quantity ?? 1,
            price: it.price ?? it.unitPrice ?? 0,
            image: it.image ?? "",
            chefDisplayName: it.chefDisplayName ?? "",
          })),
          total: serverFallback.total ?? serverFallback.totalPrice ?? serverFallback.totalAmount ?? 0,
          paymentGateway: serverFallback.paymentGateway ?? "",
          orderFulfillmentType: serverFallback.orderFulfillmentType ?? "",
          status: serverFallback.status === "Cancelled" ? "Cancelled" : "Placed",
          rawResponse: serverFallback,
        }
      : undefined;

  const effectiveOrder = order ?? synthesizedOrder;

  // نجرب نجيب الحالة الحقيقية من السيرفر لو عندنا serverOrderId — لو مفيش أو
  // الطلب فشل، بنرجع للخطوات الإرشادية المحلية.
  const { data: liveOrderRes } = useQuery({
    queryKey: ["order-status", effectiveOrder?.serverOrderId],
    queryFn: () => getOrderById(effectiveOrder!.serverOrderId as string),
    enabled: Boolean(effectiveOrder?.serverOrderId) && Boolean(order),
    retry: false,
  });

  if (!effectiveOrder) {
    if (fallbackLoading) {
      return (
        <div dir="rtl" className="min-h-screen bg-[#FFF9F6] flex items-center justify-center p-6">
          <div className="animate-pulse text-sm text-gray-400">جاري تحميل الطلب...</div>
        </div>
      );
    }
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

  const viewOrder = effectiveOrder;
  const liveOrder = liveOrderRes?.data ?? (synthesizedOrder ? serverFallback : undefined);
  const liveStatus: string | undefined = liveOrder?.status ?? liveOrder?.orderStatus;
  const isLiveTracking = Boolean(liveStatus);

  const isCancelled =
    viewOrder.status === "Cancelled" || liveStatus === "Cancelled";
  const canCancel = !isCancelled && Boolean(viewOrder.serverOrderId);
  const activeStep = liveStatus ? STATUS_STEP[liveStatus] ?? 0 : 0;
  const isDelivered = isLiveTracking ? activeStep >= 3 : false;

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
                {viewOrder.cancellationReason && (
                  <p className="text-xs text-red-500 mt-0.5">
                    السبب: {viewOrder.cancellationReason}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {STEPS.map((step, idx) => (
                <div key={step.key} className="flex items-center gap-3">
                  {idx <= activeStep ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                  )}
                  <span className={idx <= activeStep ? "font-bold text-gray-900 text-sm" : "text-gray-400 text-sm"}>
                    {step.label}
                  </span>
                </div>
              ))}
              <p className="text-[11px] text-gray-400 pt-1">
                {isLiveTracking
                  ? "* الحالة محدّثة من السيرفر مباشرة."
                  : "* الخطوات دي إرشادية لحد ما نقدر نجيب حالة الطلب الحقيقية من السيرفر."}
              </p>
            </div>
          )}

          <div className="border-t border-gray-50 pt-4 space-y-2">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-gray-400" />
              تفاصيل الطلب
            </h3>
            {viewOrder.items.map((item) => (
              <div key={item.dishId} className="flex items-center justify-between text-sm gap-2">
                <span className="text-gray-600 flex-1">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-bold text-gray-800">{item.price * item.quantity} ج.م</span>
                {isDelivered && viewOrder.serverOrderId && (
                  <Link
                    to={`/DishDetailsModal/${item.dishId}/reviews?orderId=${viewOrder.serverOrderId}`}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#B34510] hover:underline shrink-0"
                  >
                    <Star className="w-3 h-3" />
                    قيّم الطبق
                  </Link>
                )}
              </div>
            ))}
            <div className="flex items-center justify-between text-sm font-black pt-2 border-t border-gray-50">
              <span>الإجمالي</span>
              <span className="text-[#B34510]">{viewOrder.total} ج.م</span>
            </div>
          </div>

          {canCancel && (
            <Link
              to={`/orders/${viewOrder.localId}/cancel`}
              className="block w-full text-center text-red-600 border border-red-100 font-bold py-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm"
            >
              إلغاء الطلب
            </Link>
          )}

          {!viewOrder.serverOrderId && !isCancelled && (
            <p className="text-[11px] text-gray-400 text-center">
              مفيش معرف طلب مؤكد من السيرفر لهذا الطلب، فمش هيتم إلغاؤه من هنا.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
