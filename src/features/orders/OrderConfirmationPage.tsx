import { useParams, Link } from "react-router-dom";
import { CheckCircle2, ClipboardList, Home } from "lucide-react";
import { getOrderByLocalId } from "../../services/orderHistory";

export default function OrderConfirmationPage() {
  const { localId } = useParams<{ localId: string }>();
  const order = localId ? getOrderByLocalId(localId) : undefined;

  if (!order) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#FFF9F6] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-black text-gray-900">لم يتم العثور على الطلب</h2>
          <p className="text-sm text-gray-500">
            الطلب ده مش موجود في سجل هذا المتصفح، جرب صفحة "طلباتي".
          </p>
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

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF9F6] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl border border-rose-100/80 shadow-sm max-w-lg w-full p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">تم إرسال طلبك بنجاح!</h1>
          <p className="text-sm text-gray-500 mt-1">
            {order.serverOrderId
              ? `رقم الطلب: ${order.serverOrderId}`
              : "استلمنا طلبك وجاري تجهيزه."}
          </p>
        </div>

        <div className="text-right space-y-2 bg-rose-50/40 rounded-2xl p-4">
          {order.items.map((item) => (
            <div key={item.dishId} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">
                {item.name} × {item.quantity}
              </span>
              <span className="font-bold text-gray-900">{item.price * item.quantity} ج.م</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm font-black pt-2 border-t border-rose-100">
            <span>الإجمالي</span>
            <span className="text-[#B34510]">{order.total} ج.م</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/orders/${order.localId}`}
            className="flex-1 flex items-center justify-center gap-2 bg-[#B34510] text-white font-bold py-3 rounded-xl hover:bg-[#A03E0F] transition-colors"
          >
            <ClipboardList className="w-4 h-4" />
            <span>تتبع الطلب</span>
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 bg-rose-50/80 text-gray-800 font-bold py-3 rounded-xl hover:bg-rose-100/80 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
