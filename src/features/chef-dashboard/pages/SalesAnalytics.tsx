import React, { useState } from "react";
import {
  Download,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  DollarSign,
  Search,
  Eye,
  Minus,
} from "lucide-react";

interface KPICard {
  id: number;
  title: string;
  value: string;
  unit?: string;
  change?: string;
  isPositive?: boolean;
  isStable?: boolean;
  icon: React.ElementType;
  iconBg: string;
}

interface Transaction {
  id: string;
  customerName: string;
  date: string;
  status: "مكتمل" | "قيد التحضير" | "ملغى";
  amount: number;
}

const kpiData: KPICard[] = [
  {
    id: 1,
    title: "إجمالي الإيرادات",
    value: "45,230",
    unit: "درهم",
    change: "+12% مقارنة بالشهر الماضي",
    isPositive: true,
    icon: DollarSign,
    iconBg: "bg-rose-100/70 text-rose-600",
  },
  {
    id: 2,
    title: "إجمالي الطلبات",
    value: "342",
    change: "+5% مقارنة بالشهر الماضي",
    isPositive: true,
    icon: ShoppingBag,
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    id: 3,
    title: "متوسط قيمة الطلب",
    value: "132",
    unit: "درهم",
    change: "مستقر",
    isStable: true,
    icon: CreditCard,
    iconBg: "bg-emerald-100 text-emerald-600",
  },
];

const transactionsData: Transaction[] = [
  {
    id: "#ORD-0992",
    customerName: "سارة محمد",
    date: "24 ديسمبر 2024",
    status: "مكتمل",
    amount: 185.0,
  },
  {
    id: "#ORD-0991",
    customerName: "خالد عبدالله",
    date: "24 ديسمبر 2024",
    status: "قيد التحضير",
    amount: 320.5,
  },
  {
    id: "#ORD-0990",
    customerName: "فاطمة علي",
    date: "23 ديسمبر 2024",
    status: "مكتمل",
    amount: 95.0,
  },
  {
    id: "#ORD-0989",
    customerName: "أحمد حسن",
    date: "22 ديسمبر 2024",
    status: "ملغى",
    amount: 150.0,
  },
];

export default function SalesAnalytics() {
  
  const [timeRange, setTimeRange] = useState<"يومي" | "أسبوعي" | "شهري">(
    "شهري"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "مكتمل":
        return (
          <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold">
            مكتمل
          </span>
        );
      case "قيد التحضير":
        return (
          <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full font-bold">
            قيد التحضير
          </span>
        );
      case "ملغى":
        return (
          <span className="bg-rose-100 text-rose-600 text-xs px-3 py-1 rounded-full font-bold">
            ملغى
          </span>
        );
    }
  };

  return (
    <div dir="rtl" className="space-y-8 font-sans pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">سجل المبيعات</h1>
          <p className="text-sm text-gray-500 mt-1">
            نظرة عامة على الأداء المالي والطلبات المكتملة.
          </p>
        </div>

        {/* Export Report Button */}
        <button className="bg-white border border-rose-200 hover:bg-rose-50/50 text-gray-700 font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors shadow-sm self-start sm:self-auto">
          <Download className="w-4 h-4 text-[#B34510]" />
          <span>تصدير التقرير</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="bg-[#FFF6F3] border border-rose-100/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-bold">
                  {kpi.title}
                </span>
                <div className={`p-2.5 rounded-full ${kpi.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-1 text-3xl font-black text-gray-900">
                  <span>{kpi.value}</span>
                  {kpi.unit && (
                    <span className="text-xs font-normal text-gray-500">
                      {kpi.unit}
                    </span>
                  )}
                </div>

                {kpi.change && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold mt-2">
                    {kpi.isPositive && (
                      <>
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">{kpi.change}</span>
                      </>
                    )}
                    {kpi.isStable && (
                      <>
                        <Minus className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-400">{kpi.change}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales Analysis Chart Card */}
      <div className="bg-[#FFF6F3] border border-rose-100/60 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">تحليل المبيعات</h2>

          {/* Time Filter Buttons */}
          <div className="flex items-center bg-white border border-rose-100 p-1 rounded-xl self-start sm:self-auto">
            {(["يومي", "أسبوعي", "شهري"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setTimeRange(mode)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === mode
                    ? "bg-amber-400 text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="h-48 w-full bg-white/60 border border-rose-100/50 rounded-xl p-4 flex items-end justify-around gap-4">
          <div className="w-12 bg-rose-200/80 rounded-t-lg h-[80%]" />
          <div className="w-12 bg-rose-200/80 rounded-t-lg h-[45%]" />
          <div className="w-12 bg-[#B34510] rounded-t-lg h-[70%]" />
          <div className="w-12 bg-rose-200/80 rounded-t-lg h-[45%]" />
          <div className="w-12 bg-rose-200/80 rounded-t-lg h-[30%]" />
        </div>
      </div>

      {/* Recent Transactions Table Card */}
      <div className="bg-[#FFF6F3] border border-rose-100/60 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">أحدث المعاملات</h2>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث برقم الطلب..."
              className="w-full bg-white border border-rose-200/80 rounded-xl py-2 pr-9 pl-4 text-xs outline-none text-gray-800 placeholder:text-gray-400 focus:border-[#B34510] transition-colors"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-rose-100 overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-medium">
                <th className="py-3 px-4">رقم الطلب</th>
                <th className="py-3 px-4">اسم العميل</th>
                <th className="py-3 px-4">التاريخ</th>
                <th className="py-3 px-4 text-center">الحالة</th>
                <th className="py-3 px-4">المبلغ (درهم)</th>
                <th className="py-3 px-4 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {transactionsData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-rose-50/30 transition-colors"
                >
                  <td className="py-4 px-4 font-bold text-[#B34510]">
                    {item.id}
                  </td>
                  <td className="py-4 px-4 font-semibold">
                    {item.customerName}
                  </td>
                  <td className="py-4 px-4 text-gray-500">{item.date}</td>
                  <td className="py-4 px-4 text-center">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="py-4 px-4 font-extrabold text-gray-900">
                    {item.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-left">
                    <button className="p-1.5 text-gray-400 hover:text-[#B34510] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination & Footer Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-gray-500">
          <span>عرض 1-4 من أصل 342 طلب</span>

          <div className="flex items-center gap-2">
            <button className="bg-white border border-rose-200 px-4 py-1.5 rounded-lg font-bold text-gray-700 hover:bg-rose-50 transition-colors">
              السابق
            </button>
            <button className="bg-white border border-rose-200 px-4 py-1.5 rounded-lg font-bold text-gray-700 hover:bg-rose-50 transition-colors">
              التالي
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
