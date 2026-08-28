import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingCart,
  MapPin,
  Loader2,
} from "lucide-react";
import { useCart } from "../../services/CartContext";
import {
  getMyAddresses,
  createAddress,
  checkoutOrder,
  type PaymentGateway,
  type OrderFulfillmentType,
} from "../../services/api";
import { saveOrder } from "../../services/orderHistory";
import { extractPaymentUrl } from "../../services/payment";

interface Address {
  id: string;
  label?: string;
  city?: string;
  details?: string;
  isDefault?: boolean;
}

interface ApiEnvelope<T> {
  data: T;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } =
    useCart();
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", city: "", details: "" });
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>("Paymob");
  const [fulfillmentType, setFulfillmentType] =
    useState<OrderFulfillmentType>("Delivery");
  const [notes, setNotes] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const { data: addressesRes, isLoading: addressesLoading, refetch: refetchAddresses } =
    useQuery<ApiEnvelope<Address[]>>({
      queryKey: ["my-addresses"],
      queryFn: getMyAddresses,
      enabled: isLoggedIn,
    });

  const addresses = addressesRes?.data ?? [];

  const createAddressMutation = useMutation({
    mutationFn: () =>
      createAddress({
        label: newAddress.label || "المنزل",
        city: newAddress.city,
        details: newAddress.details,
        latitude: 0,
        longitude: 0,
        isDefault: addresses.length === 0,
      }),
    onSuccess: () => {
      setShowNewAddress(false);
      setNewAddress({ label: "", city: "", details: "" });
      refetchAddresses();
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: () =>
      checkoutOrder({
        idempotencyKey: crypto.randomUUID(),
        items: items.map((i) => ({ dishId: i.dishId, quantity: i.quantity })),
        notes: notes || undefined,
        deliveryAddressId: selectedAddressId ?? undefined,
        paymentGateway,
        orderFulfillmentType: fulfillmentType,
      }),
    onSuccess: (response) => {
      const order = saveOrder({
        items,
        total: totalPrice,
        notes,
        paymentGateway,
        orderFulfillmentType: fulfillmentType,
        rawResponse: response,
      });
      clearCart();

      // لو السيرفر رجّع رابط دفع حقيقي (Paymob/Stripe)، لازم نوديه المستخدم
      // يكمل الدفع فعليًا قبل ما نعتبر الطلب مؤكد. لو مفيش رابط دفع في الرد
      // (الـ backend لسه مش راجعه)، بيفضل السلوك القديم: تأكيد فوري.
      const paymentUrl = extractPaymentUrl(response);
      if (paymentUrl) {
        window.location.href = paymentUrl;
        return;
      }

      navigate(`/order-confirmation/${order.localId}`);
    },
    onError: (err: any) => {
      setCheckoutError(
        err?.response?.data?.message || "تعذر إتمام الطلب، حاول مرة أخرى."
      );
    },
  });

  const handleCheckout = () => {
    setCheckoutError(null);
    if (fulfillmentType === "Delivery" && !selectedAddressId) {
      setCheckoutError("من فضلك اختر عنوان التوصيل أولاً.");
      return;
    }
    checkoutMutation.mutate();
  };

  if (items.length === 0) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#FFF9F6] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
            <ShoppingCart className="w-8 h-8 text-[#B34510]" />
          </div>
          <h2 className="text-xl font-black text-gray-900">سلة التسوق فاضية</h2>
          <p className="text-sm text-gray-500">أضف أطباق من الصفحة الرئيسية عشان تبدأ طلبك.</p>
          <Link
            to="/"
            className="inline-block bg-[#B34510] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#A03E0F] transition-colors"
          >
            تصفح الأطباق
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF9F6] p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-black text-gray-900">سلة التسوق</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.dishId}
                className="bg-white rounded-2xl border border-rose-100/80 shadow-sm p-4 flex items-center gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.chefDisplayName}</p>
                  <span className="text-[#B34510] font-extrabold text-sm">{item.price} ج.م</span>
                </div>
                <div className="flex items-center gap-2 bg-rose-50/60 rounded-full px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.dishId)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary / Checkout */}
          <div className="bg-white rounded-3xl border border-rose-100/80 shadow-sm p-6 space-y-5 h-fit">
            <h2 className="font-black text-lg text-gray-900">ملخص الطلب</h2>

            {!isLoggedIn && (
              <div className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl p-3">
                لازم تسجل دخول عشان تكمل الطلب.{" "}
                <Link to="/login" className="font-bold underline">
                  تسجيل الدخول
                </Link>
              </div>
            )}

            {isLoggedIn && (
              <>
                {/* Fulfillment type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600">طريقة الاستلام</label>
                  <div className="flex gap-2">
                    {(["Delivery", "Pickup"] as OrderFulfillmentType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFulfillmentType(type)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                          fulfillmentType === type
                            ? "bg-[#B34510] text-white"
                            : "bg-rose-50/60 text-gray-700"
                        }`}
                      >
                        {type === "Delivery" ? "توصيل" : "استلام من المطبخ"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment gateway */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600">طريقة الدفع</label>
                  <div className="flex gap-2">
                    {(["Paymob", "Stripe"] as PaymentGateway[]).map((gw) => (
                      <button
                        key={gw}
                        onClick={() => setPaymentGateway(gw)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                          paymentGateway === gw
                            ? "bg-[#B34510] text-white"
                            : "bg-rose-50/60 text-gray-700"
                        }`}
                      >
                        {gw}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address */}
                {fulfillmentType === "Delivery" && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600">عنوان التوصيل</label>
                    {addressesLoading && (
                      <div className="h-9 bg-gray-100 rounded-xl animate-pulse" />
                    )}
                    {!addressesLoading && addresses.length > 0 && (
                      <div className="space-y-1.5">
                        {addresses.map((addr) => (
                          <button
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`w-full flex items-center gap-2 text-right p-2.5 rounded-xl border text-xs transition-colors ${
                              selectedAddressId === addr.id
                                ? "border-[#B34510] bg-rose-50/60"
                                : "border-gray-100"
                            }`}
                          >
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">
                              {addr.label || "عنوان"} — {addr.city} {addr.details}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    {!addressesLoading && !showNewAddress && (
                      <button
                        onClick={() => setShowNewAddress(true)}
                        className="text-xs font-bold text-[#B34510] hover:underline"
                      >
                        + إضافة عنوان جديد
                      </button>
                    )}
                    {showNewAddress && (
                      <div className="space-y-2 border border-gray-100 rounded-xl p-3">
                        <input
                          placeholder="اسم العنوان (المنزل، العمل...)"
                          value={newAddress.label}
                          onChange={(e) =>
                            setNewAddress((s) => ({ ...s, label: e.target.value }))
                          }
                          className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none"
                        />
                        <input
                          placeholder="المدينة"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress((s) => ({ ...s, city: e.target.value }))
                          }
                          className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none"
                        />
                        <input
                          placeholder="تفاصيل العنوان"
                          value={newAddress.details}
                          onChange={(e) =>
                            setNewAddress((s) => ({ ...s, details: e.target.value }))
                          }
                          className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none"
                        />
                        <button
                          onClick={() => createAddressMutation.mutate()}
                          disabled={createAddressMutation.isPending}
                          className="w-full bg-[#B34510] text-white text-xs font-bold py-2 rounded-lg disabled:opacity-60"
                        >
                          {createAddressMutation.isPending ? "جاري الحفظ..." : "حفظ العنوان"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">ملاحظات (اختياري)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none resize-none"
                  />
                </div>
              </>
            )}

            <div className="flex items-center justify-between text-sm font-bold pt-3 border-t border-gray-50">
              <span>الإجمالي</span>
              <span className="text-[#B34510] text-lg">{totalPrice} ج.م</span>
            </div>

            {checkoutError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-2.5">
                {checkoutError}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={!isLoggedIn || checkoutMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-[#B34510] hover:bg-[#A03E0F] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {checkoutMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{checkoutMutation.isPending ? "جاري إتمام الطلب..." : "إتمام الطلب"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
