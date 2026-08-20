import React from "react";
import {
  UserX,
  Search,
  MessageCircle,
  TrendingUp,
  DollarSign,
  Package,
} from "lucide-react";

// 1. إدارة المستخدمين
const mockUsers = [
  { id: "1", name: "أحمد محمد", email: "ahmed@example.com", type: "عميل", typeColor: "bg-blue-100 text-blue-700", status: "نشط", action: "حظر" },
  { id: "2", name: "الشيف علي", email: "ali@chef.com", type: "شيف", typeColor: "bg-orange-100 text-orange-700", status: "نشط", action: "تجميد" },
];

export const AdminUsersView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="البحث عن مستخدم..."
            className="bg-white border rounded-lg pr-10 pl-4 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
        </div>
      </div>

      {/* جدول (شاشات متوسطة وأكبر) */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="p-4">الاسم</th>
              <th className="p-4">البريد الإلكتروني</th>
              <th className="p-4">النوع</th>
              <th className="p-4">الحالة</th>
              <th className="p-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockUsers.map((u) => (
              <tr key={u.id}>
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4 text-gray-500">{u.email}</td>
                <td className="p-4">
                  <span className={`${u.typeColor} px-2 py-1 rounded text-xs`}>{u.type}</span>
                </td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{u.status}</span>
                </td>
                <td className="p-4 flex gap-2">
                  <button title={u.action} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <UserX className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* كروت (موبايل) */}
      <div className="md:hidden space-y-3">
        {mockUsers.map((u) => (
          <div key={u.id} className="bg-white rounded-xl shadow-sm border p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800">{u.name}</span>
              <button title={u.action} className="p-1.5 text-red-600 bg-red-50 rounded-lg">
                <UserX className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500">{u.email}</p>
            <div className="flex items-center gap-2">
              <span className={`${u.typeColor} px-2 py-1 rounded text-xs`}>{u.type}</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{u.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. إدارة النزاعات والشكاوى
export const AdminDisputesView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        مراجعة النزاعات والشكاوى
      </h2>
      <div className="grid gap-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-800">طلب #1082</span>
              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded">
                عاجل
              </span>
            </div>
            <p className="text-sm text-gray-600">
              تأخر التوصيل لأكثر من ساعة والأكل وصل بارد.
            </p>
            <span className="text-xs text-gray-400 mt-2 block">
              المشتكي: أحمد Marwan | المشكو في حقه: كابتن التوصيل
            </span>
          </div>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-800">
            <MessageCircle className="w-4 h-4" /> فتح الشكوى
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. التقارير والتحليلات
export const AdminAnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">التقارير والتحليلات</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500">إجمالي الأرباح</p>
            <p className="text-xl font-bold">45,200 ج.م</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500">إجمالي الطلبات</p>
            <p className="text-xl font-bold">1,240</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500">معدل النمو</p>
            <p className="text-xl font-bold">+18.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. إعدادات النظام
export const AdminSettingsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">إعدادات النظام</h2>
      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-medium">
            إيقاف استقبال الطلبات المؤقت (وضع الصيانة)
          </span>
          <input type="checkbox" className="w-4 h-4 text-orange-500" />
        </label>
        <label className="flex items-center justify-between cursor-pointer border-t pt-4">
          <span className="text-sm font-medium">
            تفعيل التوصيل التلقائي عبر الكباتن
          </span>
          <input
            type="checkbox"
            defaultChecked
            className="w-4 h-4 text-orange-500"
          />
        </label>
      </div>
    </div>
  );
};
