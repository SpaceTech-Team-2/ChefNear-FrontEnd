import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  Check,
  X,
  Truck,
  PackageCheck,
  ChefHat,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import {
  getMyOrders,
  acceptOrder,
  startPreparingOrder,
  markOrderReady,
  markOrderDelivered,
  cancelOrder,
} from "../../../services/api";

// ملحوظة: رد GET /Orders لسه مش موثّق رسميًا في الـ swagger (بيرجع "OK" بس من
// غير schema)، فبنقرأ كل حقل بشكل دفاعي من أكتر من اسم محتمل بدل ما نفترض
// شكل ثابت. لما الـ backend يوثّق شكل الرد بالظبط، ينفع نستبدل الدوال دي
// بقراءة مباشرة.
interface RawOrder {
  [key: string]: any;
}

function getOrderId(o: RawOrder): string {
  return o.id ?? o.orderId ?? "";
}
function getOrderCode(o: RawOrder): string {
  const id = getOrderId(o);
  return o.orderNumber ?? o.code ?? (id ? `#${id.slice(0, 8)}` : "طلب");
}
function getCustomerName(o: RawOrder): string {
  return o.customerName ?? o.clientName ?? o.userName ?? o.client?.displayName ?? "عميل";
}
function getStatus(o: RawOrder): string {
  return o.status ?? o.orderStatus ?? "";
}
function getItems(o: RawOrder): { name: string; quantity: number }[] {
  const raw = o.items ?? o.orderItems ?? o.dishes ?? [];
  if (!Array.isArray(raw)) return [];
  return raw.map((it: any) => ({
    name: it.dishName ?? it.name ?? it.dish?.name ?? "صنف",
    quantity: it.quantity ?? 1,
  }));
}
function getTotal(o: RawOrder): number | undefined {
  return o.total ?? o.totalPrice ?? o.totalAmount ?? undefined;
}

const statusLabels: Record<string, string> = {
  Pending: "بانتظار القبول",
  Accepted: "مقبول",
  Preparing: "جاري التحضير",
  Ready: "جاهز للتوصيل",
  Delivered: "تم التسليم",
  Cancelled: "ملغي",
};

export default function ActiveOrders() {
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);
  const [prepModalOrder, setPrepModalOrder] = useState<string | null>(null);
  const [readyModalOrder, setReadyModalOrder] = useState<string | null>(null);
  const [cookingTime, setCookingTime] = useState("00:30:00");
  const [deliveryTime, setDeliveryTime] = useState("00:20:00");
  const [deliveryFee, setDeliveryFee] = useState("20");

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["chef-orders"],
    queryFn: () => getMyOrders({ IsActive: true, PageSize: 50 }),
  });

  const orders: RawOrder[] = data?.data ?? data ?? [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["chef-orders"] });

  const runAction = useMutation({
    mutationFn: async (fn: () => Promise<any>) => fn(),
    onSuccess: () => {
      setActionError(null);
      invalidate();
    },
    onError: (err: any) => {
      setActionError(
        err?.response?.data?.message || err?.message || "تعذر تنفيذ الإجراء، حاول تاني."
      );
    },
  });

  return (
    <div dir="rtl" className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">الطلبات النشطة</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isLoading ? "جاري التحميل..." : `${orders.length} طلب نشط`}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-white border border-rose-100/60 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-rose-50/50 transition-colors shadow-sm"
        >
          <RefreshCcw className={`w-4 h-4 text-[#B34510] ${isFetching ? "animate-spin" : ""}`} />
          <span>تحديث</span>
        </button>
      </div>

      {actionError && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 text-center">
          {actionError}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 bg-white border border-rose-100/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-6">
          تعذر تحميل الطلبات. تأكد إنك مسجل دخول كشيف وحاول تاني.
        </div>
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <div className="text-center text-sm text-gray-500 bg-white border border-dashed border-rose-200 rounded-2xl p-12">
          مفيش طلبات نشطة دلوقتي.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => {
          const id = getOrderId(order);
          const status = getStatus(order);
          const items = getItems(order);
          const total = getTotal(order);

          return (
            <div
              key={id}
              className="bg-white rounded-2xl border border-rose-100/60 p-5 shadow-sm flex flex-col justify-between space-y-5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-[#B34510]" />

              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-gray-800 text-sm">{getCustomerName(order)}</span>
                  <span className="text-xs text-gray-400">{getOrderCode(order)}</span>
                </div>

                {status && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-[11px] px-2.5 py-1 rounded-full font-bold">
                    <Clock className="w-3 h-3" />
                    {statusLabels[status] ?? status}
                  </span>
                )}

                <div className="space-y-1">
                  {items.length > 0 ? (
                    items.map((it, idx) => (
                      <div key={idx} className="text-sm text-gray-700">
                        {it.name} × {it.quantity}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">تفاصيل الأصناف غير متاحة من الرد.</p>
                  )}
                </div>

                {typeof total === "number" && (
                  <div className="text-sm font-black text-[#B34510]">{total} ج.م</div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => runAction.mutate(() => acceptOrder(id))}
                  disabled={runAction.isPending}
                  className="flex items-center gap-1.5 bg-[#B34510] hover:bg-[#A03E0F] text-white px-3.5 py-2 rounded-xl font-bold text-xs transition-colors disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>قبول</span>
                </button>

                <button
                  onClick={() => setPrepModalOrder(id)}
                  disabled={runAction.isPending}
                  className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3.5 py-2 rounded-xl font-bold text-xs transition-colors disabled:opacity-50"
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>بدء التحضير</span>
                </button>

                <button
                  onClick={() => setReadyModalOrder(id)}
                  disabled={runAction.isPending}
                  className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3.5 py-2 rounded-xl font-bold text-xs transition-colors disabled:opacity-50"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>جاهز للتوصيل</span>
                </button>

                <button
                  onClick={() => runAction.mutate(() => markOrderDelivered(id))}
                  disabled={runAction.isPending}
                  className="flex items-center gap-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 px-3.5 py-2 rounded-xl font-bold text-xs transition-colors disabled:opacity-50"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>تم التسليم</span>
                </button>

                <button
                  onClick={() =>
                    runAction.mutate(() =>
                      cancelOrder(id, {
                        reasonType: "ChefKitchenBusy",
                        reasonFreeText: "اعتذار من الشيف",
                      })
                    )
                  }
                  disabled={runAction.isPending}
                  className="flex items-center gap-1.5 border border-rose-200 text-rose-500 hover:bg-rose-50 px-3.5 py-2 rounded-xl font-bold text-xs transition-colors disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>إلغاء</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: بدء التحضير (محتاج وقت تحضير متوقع) */}
      {prepModalOrder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4" dir="rtl">
            <h3 className="font-black text-gray-900">وقت التحضير المتوقع</h3>
            <input
              type="text"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              placeholder="HH:mm:ss"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setPrepModalOrder(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gray-50 text-gray-700"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  runAction.mutate(() =>
                    startPreparingOrder(prepModalOrder, { estimatedCookingTime: cookingTime })
                  );
                  setPrepModalOrder(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#B34510] text-white"
              >
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: جاهز للتوصيل (محتاج وقت توصيل ورسوم) */}
      {readyModalOrder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4" dir="rtl">
            <h3 className="font-black text-gray-900">تفاصيل التوصيل</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600">وقت التوصيل المتوقع</label>
              <input
                type="text"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                placeholder="HH:mm:ss"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600">رسوم التوصيل (ج.م)</label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setReadyModalOrder(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gray-50 text-gray-700"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  runAction.mutate(() =>
                    markOrderReady(readyModalOrder, {
                      estimatedDeliveryTime: deliveryTime,
                      deliveryFee: Number(deliveryFee) || 0,
                    })
                  );
                  setReadyModalOrder(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#B34510] text-white"
              >
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}

      {runAction.isPending && (
        <div className="fixed bottom-6 left-6 bg-white shadow-lg border border-rose-100 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-gray-700">
          <Loader2 className="w-4 h-4 animate-spin text-[#B34510]" />
          <span>جاري التنفيذ...</span>
        </div>
      )}
    </div>
  );
}
