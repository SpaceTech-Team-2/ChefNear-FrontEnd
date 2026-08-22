import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, ChevronLeft, ShoppingBag } from "lucide-react";
import { getOrders, type StoredOrder } from "../../services/orderHistory";
import { getMyOrders } from "../../services/api";

interface DisplayOrder {
  key: string;
  routeId: string;
  title: string;
  status: string;
  createdAt: string;
  total?: number;
}

export default function OrdersHistoryPage() {
  const [localOrders, setLocalOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    setLocalOrders(getOrders());
  }, []);

  // بنجيب الطلبات الحقيقية من السيرفر (GET /Orders) عشان طلباتي متعتمدش على
  // localStorage بس — لو المستخدم غيّر جهاز، طلباته لازم تفضل ظاهرة.
  const { data: serverRes } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => getMyOrders({ PageSize: 50 }),
  });
  const serverOrders: any[] = serverRes?.data ?? [];

  const localByServerId = new Map(
    localOrders.filter((o) => o.serverOrderId).map((o) => [o.serverOrderId, o])
  );

  const displayOrders: DisplayOrder[] = [];

  // 1) الطلبات المحلية (فيها تفاصيل الأصناف كاملة لأننا سجلناها وقت الطلب)
  for (const o of localOrders) {
    displayOrders.push({
      key: o.localId,
      routeId: o.localId,
      title: o.items.map((i) => i.name).join("، "),
      status: o.status === "Cancelled" ? "ملغي" : "تم الطلب",
      createdAt: o.createdAt,
      total: o.total,
    });
  }

  // 2) طلبات من السيرفر مش موجودة محليًا (مثلاً من جهاز تاني)
  for (const o of serverOrders) {
    const id = o.id ?? o.orderId;
    if (!id || localByServerId.has(id)) continue;
    displayOrders.push({
      key: id,
      routeId: id,
      title: o.orderNumber ? `طلب ${o.orderNumber}` : "طلب",
      status: o.status ?? o.orderStatus ?? "—",
      createdAt: o.createdAt ?? o.orderDate ?? new Date().toISOString(),
      total: o.total ?? o.totalPrice ?? o.totalAmount,
    });
  }

  displayOrders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF9F6] p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">طلباتي</h1>
          <p className="text-sm text-gray-500 mt-1">كل طلباتك من المتصفح ده ومن السيرفر.</p>
        </div>

        {displayOrders.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-[#B34510]" />
            </div>
            <h2 className="text-lg font-black text-gray-900">مفيش طلبات لسه</h2>
            <Link
              to="/"
              className="inline-block bg-[#B34510] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#A03E0F] transition-colors"
            >
              ابدأ الطلب
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {displayOrders.map((order) => (
            <Link
              key={order.key}
              to={`/orders/${order.routeId}`}
              className="flex items-center gap-4 bg-white rounded-2xl border border-rose-100/80 shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{order.title}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      order.status === "ملغي" || order.status === "Cancelled"
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(order.createdAt).toLocaleString("ar-EG")}
                </p>
              </div>
              {typeof order.total === "number" && (
                <div className="text-left shrink-0">
                  <div className="font-black text-[#B34510] text-sm">{order.total} ج.م</div>
                </div>
              )}
              <ChevronLeft className="w-4 h-4 text-gray-300 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
