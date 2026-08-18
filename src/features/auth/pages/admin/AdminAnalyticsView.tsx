import React from "react";
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export const AdminAnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6 text-right dir-rtl">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-orange-500" /> التقارير والتحليلات
      </h2>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">إجمالي الإيرادات</span>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">128,450 ج.م</p>
          <span className="text-xs text-emerald-600 flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3 h-3" /> +12% مقارنة بالشهر السابق
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">عدد الطلبات</span>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">3,420</p>
          <span className="text-xs text-emerald-600 flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3 h-3" /> +8% نمو أسبوعي
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">المستخدمين الجدد</span>
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">890</p>
          <span className="text-xs text-emerald-600 flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3 h-3" /> +15% مستخدمين جديد
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">معدل إلغاء الطلبات</span>
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">1.8%</p>
          <span className="text-xs text-emerald-600 flex items-center gap-1 mt-2">
            <ArrowDownRight className="w-3 h-3" /> -0.5% انخفاض عن الشارع السابق
          </span>
        </div>
      </div>

      {/* Top Dishes Table */}
      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-gray-800">
          الأطباق الأكثر مبيعاً هذا الشهر
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="p-3">اسم الطبق</th>
                <th className="p-3">اسم الشيف</th>
                <th className="p-3">عدد الطلبات</th>
                <th className="p-3">إجمالي المبيعات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-medium">كشري ميكس أصلية</td>
                <td className="p-3 text-gray-500">الشيف طارق</td>
                <td className="p-3">450 طلب</td>
                <td className="p-3 font-semibold text-orange-600">
                  22,500 ج.م
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium">مكرونة بشاميل بلدي</td>
                <td className="p-3 text-gray-500">مطبخ أم علي</td>
                <td className="p-3">320 طلب</td>
                <td className="p-3 font-semibold text-orange-600">
                  28,800 ج.م
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium">وجبة حواوشي مخصوص</td>
                <td className="p-3 text-gray-500">شيف الحواوشي</td>
                <td className="p-3">280 طلب</td>
                <td className="p-3 font-semibold text-orange-600">
                  19,600 ج.م
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
