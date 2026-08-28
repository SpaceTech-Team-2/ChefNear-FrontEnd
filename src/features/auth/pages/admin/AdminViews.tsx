import React, { useState } from "react";
import {
  UserX,
  Search,
  MessageCircle,
  TrendingUp,
  DollarSign,
  Package,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUsers,
  createAdminUser,
  deleteAdminUser,
} from "../../../../services/api";

interface AdminUser {
  id: string;
  fullName?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: string;
}

const roleColors: Record<string, string> = {
  Client: "bg-blue-100 text-blue-700",
  Chef: "bg-orange-100 text-orange-700",
  Admin: "bg-purple-100 text-purple-700",
};

// 1. إدارة المستخدمين (GET/POST/DELETE /Admin/users)
export const AdminUsersView: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [formError, setFormError] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: () => getAdminUsers({ Search: search || undefined, PageSize: 50 }),
  });
  const users: AdminUser[] = data?.data ?? [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-users"] });

  const createMutation = useMutation({
    mutationFn: () => createAdminUser(form),
    onSuccess: () => {
      setIsModalOpen(false);
      setForm({ fullName: "", email: "", password: "" });
      invalidate();
    },
    onError: (err: any) =>
      setFormError(err?.response?.data?.message || "تعذر إنشاء الحساب."),
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteAdminUser(userId),
    onSuccess: invalidate,
  });

  const nameOf = (u: AdminUser) =>
    u.fullName || u.displayName || [u.firstName, u.lastName].filter(Boolean).join(" ") || "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="البحث عن مستخدم..."
              className="bg-white border rounded-lg pr-10 pl-4 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>أدمن جديد</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-white border rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-6">
          تعذر تحميل المستخدمين.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* جدول (شاشات متوسطة وأكبر) */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50 border-b text-gray-600">
                <tr>
                  <th className="p-4">الاسم</th>
                  <th className="p-4">البريد الإلكتروني</th>
                  <th className="p-4">النوع</th>
                  <th className="p-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="p-4 font-medium">{nameOf(u)}</td>
                    <td className="p-4 text-gray-500">{u.email}</td>
                    <td className="p-4">
                      <span className={`${roleColors[u.role ?? ""] ?? "bg-gray-100 text-gray-700"} px-2 py-1 rounded text-xs`}>
                        {u.role ?? "—"}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        title="حذف الحساب"
                        onClick={() => deleteMutation.mutate(u.id)}
                        disabled={deleteMutation.isPending}
                        className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                      >
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
            {users.map((u) => (
              <div key={u.id} className="bg-white rounded-xl shadow-sm border p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800">{nameOf(u)}</span>
                  <button
                    title="حذف الحساب"
                    onClick={() => deleteMutation.mutate(u.id)}
                    disabled={deleteMutation.isPending}
                    className="p-1.5 text-red-600 bg-red-50 rounded-lg disabled:opacity-50"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500">{u.email}</p>
                <span className={`${roleColors[u.role ?? ""] ?? "bg-gray-100 text-gray-700"} px-2 py-1 rounded text-xs`}>
                  {u.role ?? "—"}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">إنشاء حساب أدمن جديد</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            {formError && <p className="text-xs text-red-600 text-center">{formError}</p>}
            <input
              placeholder="الاسم بالكامل"
              value={form.fullName}
              onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
              className="w-full border rounded-lg py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              className="w-full border rounded-lg py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
              className="w-full border rounded-lg py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !form.email || !form.password}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg text-sm disabled:opacity-50"
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>إنشاء</span>
            </button>
          </div>
        </div>
      )}
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
