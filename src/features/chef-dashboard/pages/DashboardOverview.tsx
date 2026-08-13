import React from "react";
import {
  Users,
  Scale,
  Wallet,
  Coins,
  Eye,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface StatCard {
  id: number;
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ElementType;
  iconBg: string;
}

interface Dispute {
  id: string;
  chefName: string;
  chefAvatar: string;
  clientName: string;
  status: "تصعيد" | "قيد المراجعة" | "مغلق";
}

const statsData: StatCard[] = [
  {
    id: 1,
    title: "إجمالي المستخدمين",
    value: "24,592",
    change: "+12%",
    isPositive: true,
    icon: Users,
    iconBg: "bg-[#B34510] text-white",
  },
  {
    id: 2,
    title: "النزاعات النشطة",
    value: "18",
    change: "-3%",
    isPositive: false,
    icon: Scale,
    iconBg: "bg-rose-100 text-rose-500",
  },
  {
    id: 3,
    title: "مدفوعات معلقة",
    value: "142",
    icon: Wallet,
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    id: 4,
    title: "إجمالي العمولات",
    value: "12,450",
    change: "+8%",
    isPositive: true,
    icon: Coins,
    iconBg: "bg-emerald-600 text-white",
  },
];

const disputesData: Dispute[] = [
  {
    id: "#ORD-8921",
    chefName: "فاطمة أ.",
    chefAvatar:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=100&q=80",
    clientName: "عمر م.",
    status: "تصعيد",
  },
  {
    id: "#ORD-8874",
    chefName: "خالد س.",
    chefAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    clientName: "سارة ل.",
    status: "قيد المراجعة",
  },
  {
    id: "#ORD-8850",
    chefName: "نورة ي.",
    chefAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    clientName: "أحمد ب.",
    status: "مغلق",
  },
];

export default function DashboardOverview() {
  const getStatusBadge = (status: Dispute["status"]) => {
    switch (status) {
      case "تصعيد":
        return (
          <span className="bg-rose-100 text-rose-600 text-xs px-3 py-1 rounded-full font-medium">
            تصعيد
          </span>
        );
      case "قيد المراجعة":
        return (
          <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full font-medium">
            قيد المراجعة
          </span>
        );
      case "مغلق":
        return (
          <span className="bg-rose-50/80 text-rose-700/80 border border-rose-200/50 text-xs px-3 py-1 rounded-full font-medium">
            مغلق
          </span>
        );
    }
  };

  return (
    <div dir="rtl" className="space-y-8 font-sans">
      {/* Header Section */}
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900">
            لوحة تحكم المسؤول
          </h1>
          <p className="text-sm text-gray-500">
            نظرة عامة على أداء المنصة وإدارة العمليات.
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-white rounded-2xl p-5 border border-rose-100/60 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                {stat.change ? (
                  <div
                    className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                      stat.isPositive ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {stat.isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                ) : (
                  <div />
                )}
                <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <span className="text-xs text-gray-500 font-medium">
                  {stat.title}
                </span>
                <div className="text-2xl font-black text-gray-900">
                  {stat.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid: Disputes Table & Weekly Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disputes Table Section (Takes 2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-rose-100/60 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">إدارة النزاعات</h2>
            <button className="text-sm font-bold text-[#B34510] hover:underline">
              عرض الكل
            </button>
          </div>

          {/* Custom Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-medium">
                  <th className="pb-3 pr-2">رقم الطلب</th>
                  <th className="pb-3">الشيف</th>
                  <th className="pb-3">العميل</th>
                  <th className="pb-3 text-center">الحالة</th>
                  <th className="pb-3 text-left pl-2">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {disputesData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-rose-50/20 transition-colors"
                  >
                    <td className="py-4 pr-2 font-bold text-gray-700">
                      {item.id}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.chefAvatar}
                          alt={item.chefName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="font-semibold text-gray-800">
                          {item.chefName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 font-medium text-gray-600">
                      {item.clientName}
                    </td>
                    <td className="py-4 text-center">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-4 text-left pl-2">
                      <button className="p-1.5 text-[#B34510] hover:bg-rose-50 rounded-full transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekly Payment Cycle Card */}
        <div className="bg-white border border-rose-100/60 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-rose-100/60 text-rose-700 text-xs px-3 py-1 rounded-full font-bold">
                هذا الأسبوع
              </span>
              <div className="p-2 bg-rose-100/50 rounded-lg text-[#B34510]">
                <Wallet className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-gray-900">
                دورة الدفع الأسبوعية
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                المدفوعات المعلقة للطهاة والموردين.
              </p>
            </div>

            {/* Box Info */}
            <div className="bg-[#FFF8F6] border border-rose-100/60 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block mb-1">
                  عدد الطهاة
                </span>
                <span className="text-base font-bold text-gray-800">124</span>
              </div>
              <div className="text-left">
                <span className="text-xs text-gray-400 block mb-1">
                  إجمالي المستحقات
                </span>
                <span className="text-lg font-black text-[#B34510]">
                  45,820
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full bg-[#B34510] hover:bg-[#A03E0F] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>موافقة على الكل</span>
          </button>
        </div>
      </div>
    </div>
  );
}
