import { useState } from "react";
import {
  LayoutGrid,
  List,
  Filter,
  Clock,
  Check,
  X,
  Printer,
  Truck,
  Leaf,
} from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  customerAvatar: string;
  items: string[];
  notes?: string[];
  status: "جديد" | "جاري التحضير" | "جاهز للتوصيل";
  estimatedTime?: string;
  remainingTime?: string;
  progress?: number;
  driverStatus?: string;
}

const activeOrdersData: Order[] = [
  {
    id: "#ORD-8942",
    customerName: "سارة محمد",
    customerAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    items: ["مجبوس دجاج تقليدي"],
    notes: ["بدون مكسرات", "إضافة دقوس حار"],
    status: "جديد",
    estimatedTime: "45 دقيقة",
  },
  {
    id: "#ORD-8941",
    customerName: "خالد عبدالله",
    customerAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    items: ["ورق عنب بالزيت وليمون (عائلي)"],
    notes: ["زيادة ليمون"],
    status: "جاري التحضير",
    remainingTime: "12:05",
    progress: 60,
  },
  {
    id: "#ORD-8939",
    customerName: "عمر فهد",
    customerAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    items: ["صينية مسخن دجاج"],
    status: "جاهز للتوصيل",
    driverStatus: "المندوب في الطريق",
  },
];

export default function ActiveOrders() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div dir="rtl" className="space-y-8 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">الطلبات النشطة</h1>
          <p className="text-sm text-gray-500 mt-1">
            لديك 4 طلبات تتطلب الانتباه
          </p>
        </div>

        {/* Display Toggles & Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#FFEAE3]/50 border border-rose-100/60 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-amber-400 text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>شبكة</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "list"
                  ? "bg-amber-400 text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <List className="w-4 h-4" />
              <span>قائمة</span>
            </button>
          </div>

          <button className="flex items-center gap-2 bg-white border border-rose-100/60 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-rose-50/50 transition-colors shadow-sm">
            <Filter className="w-4 h-4 text-[#B34510]" />
            <span>تصفية</span>
          </button>
        </div>
      </div>

      {/* Orders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeOrdersData.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-rose-100/60 p-5 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            {/* Top Indicator Line */}
            <div
              className={`absolute top-0 right-0 left-0 h-1.5 ${
                order.status === "جديد"
                  ? "bg-amber-400"
                  : order.status === "جاري التحضير"
                  ? "bg-emerald-600"
                  : "bg-emerald-700"
              }`}
            />

            {/* Order Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                {/* Status Badge */}
                {order.status === "جديد" && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>جديد</span>
                  </span>
                )}
                {order.status === "جاري التحضير" && (
                  <span className="text-emerald-600 text-xs font-bold">
                    جاري التحضير
                  </span>
                )}
                {order.status === "جاهز للتوصيل" && (
                  <span className="bg-emerald-700 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>جاهز للتوصيل</span>
                  </span>
                )}

                {/* Customer Info */}
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <img
                      src={order.customerAvatar}
                      alt={order.customerName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-bold text-gray-800 text-sm">
                      {order.customerName}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 block mt-0.5">
                    {order.id}
                  </span>
                </div>
              </div>

              {/* Progress Bar for Preparing Status */}
              {order.status === "جاري التحضير" && (
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${order.progress || 50}%` }}
                  />
                </div>
              )}

              {/* Order Items & Notes */}
              <div className="space-y-2 pt-2">
                {order.items.map((item, idx) => (
                  <h3 key={idx} className="font-bold text-gray-800 text-base">
                    {item}
                  </h3>
                ))}

                {order.notes && order.notes.length > 0 && (
                  <div className="space-y-1">
                    {order.notes.map((note, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium"
                      >
                        <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Order Footer Actions */}
            <div className="pt-4 border-t border-gray-100">
              {order.status === "جديد" && (
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-gray-400 block">
                      وقت التحضير المتوقع
                    </span>
                    <span className="font-bold text-gray-800 text-sm">
                      {order.estimatedTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                    <button className="bg-[#B34510] hover:bg-[#A03E0F] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-colors shadow-sm">
                      <Check className="w-4 h-4" />
                      <span>قبول</span>
                    </button>
                  </div>
                </div>
              )}

              {order.status === "جاري التحضير" && (
                <div className="flex items-center justify-between gap-3">
                  <button className="bg-rose-50 text-[#B34510] hover:bg-rose-100 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors">
                    تحديث الحالة
                  </button>

                  <div className="text-left">
                    <span className="text-[10px] text-gray-400 block">
                      الوقت المتبقي
                    </span>
                    <div className="flex items-center gap-1 text-emerald-600 font-black text-lg dir-ltr">
                      <Clock className="w-4 h-4" />
                      <span>{order.remainingTime}</span>
                    </div>
                  </div>
                </div>
              )}

              {order.status === "جاهز للتوصيل" && (
                <div className="flex items-center justify-between gap-3">
                  <button className="bg-[#795548] hover:bg-[#5D4037] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors">
                    <Printer className="w-4 h-4" />
                    <span>طباعة الفاتورة</span>
                  </button>

                  <div className="text-left text-xs">
                    <span className="text-gray-400 block">المندوب</span>
                    <span className="font-bold text-gray-700">
                      {order.driverStatus}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
