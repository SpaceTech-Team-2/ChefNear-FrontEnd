import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  XCircle,
} from "lucide-react";
import { getMonthlyReport } from "../../../../services/api";

// ملحوظة: رد GET /Admin/reports/monthly لسه مش موثّق رسميًا في الـ swagger،
// فبنقرأ كل رقم بشكل دفاعي من أكتر من اسم حقل محتمل بدل ما نفترض شكل ثابت.
// لو الاسم مش موجود، بنعرض "—" بدل رقم وهمي.
export const AdminAnalyticsView: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-monthly-report"],
    queryFn: getMonthlyReport,
  });
  const report = data?.data ?? data ?? {};

  const revenue = report.totalRevenue ?? report.revenue;
  const orders = report.totalOrders ?? report.ordersCount ?? report.orders;
  const newUsers = report.newUsers ?? report.newUsersCount;
  const cancelRate = report.cancellationRate ?? report.cancelRate;
  const topDishes: any[] = report.topDishes ?? report.bestSellingDishes ?? [];

  const cards = [
    {
      label: "إجمالي الإيرادات",
      value: typeof revenue === "number" ? `${revenue.toLocaleString("ar-EG")} ج.م` : "—",
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "عدد الطلبات",
      value: typeof orders === "number" ? orders.toLocaleString("ar-EG") : "—",
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "المستخدمين الجدد",
      value: typeof newUsers === "number" ? newUsers.toLocaleString("ar-EG") : "—",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "معدل إلغاء الطلبات",
      value: typeof cancelRate === "number" ? `${cancelRate}%` : "—",
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="space-y-6 text-right dir-rtl">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-orange-500" /> التقارير والتحليلات
      </h2>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white border rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-6">
          تعذر تحميل التقرير الشهري.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c) => (
              <div key={c.label} className="bg-white p-5 rounded-xl border shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">{c.label}</span>
                  <div className={`p-2 rounded-lg ${c.color}`}>
                    <c.icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800">{c.value}</p>
              </div>
            ))}
          </div>

          {topDishes.length > 0 && (
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-gray-800">الأطباق الأكثر مبيعاً هذا الشهر</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="bg-gray-50 text-gray-600 border-b">
                    <tr>
                      <th className="p-3">اسم الطبق</th>
                      <th className="p-3">عدد الطلبات</th>
                      <th className="p-3">إجمالي المبيعات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {topDishes.map((d, idx) => (
                      <tr key={d.id ?? idx}>
                        <td className="p-3 font-medium">{d.name ?? d.dishName ?? "—"}</td>
                        <td className="p-3">{d.ordersCount ?? d.orderCount ?? "—"}</td>
                        <td className="p-3 font-semibold text-orange-600">
                          {typeof d.totalSales === "number" ? `${d.totalSales} ج.م` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
