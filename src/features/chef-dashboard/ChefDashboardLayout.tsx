import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpen,
  Settings,
  BarChart3,
  Radio,
  HelpCircle,
  LogOut,
  Power,
} from "lucide-react";

const navItems = [
  { path: "/chef", label: "لوحة التحكم", icon: LayoutDashboard, end: true },
  { path: "/chef/orders", label: "الطلبات", icon: UtensilsCrossed },
  { path: "/chef/menu", label: "إدارة القائمة", icon: BookOpen },
  { path: "/chef/settings", label: "إعدادات المطبخ", icon: Settings },
  { path: "/chef/analytics", label: "التحليلات", icon: BarChart3 },
];

export default function ChefDashboardLayout() {
  const [isLive, setIsLive] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="flex min-h-screen bg-[#FFF9F6] text-gray-800 font-sans"
    >
      {/* Sidebar (الشريط الجانبي الثابت) */}
      <aside className="w-64 bg-white border-l border-orange-50/60 p-6 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div className="space-y-8">
          {/* Header الشيف */}
          <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-gray-100">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=120&q=80"
                alt="Chef Ahmed"
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-500 p-0.5"
              />
              <span
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                  isLive ? "bg-emerald-500" : "bg-gray-400"
                }`}
              />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg">
                الشيف أحمد
              </h3>
              <p className="text-xs text-gray-500">مطبخ فاخر</p>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className={`w-full py-1.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                isLive
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isLive ? "متصل (ابدأ العمل)" : "ابدأ العمل"}</span>
            </button>
          </div>

          {/* Nav Links مع Active Classes تلقائية من React Router */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-amber-400 text-gray-900 shadow-sm"
                        : "text-gray-600 hover:bg-orange-50/50 hover:text-[#A03E0F]"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* الأسفل: بث مباشر والروابط الثابتة */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <button className="w-full bg-[#B34510] hover:bg-[#A03E0F] text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm">
            <Radio className="w-4 h-4" />
            <Link to="/">رجوع للصفحة الرئيسية</Link>
          </button>

          <div className="space-y-1 text-xs font-semibold text-gray-500">
            <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 hover:text-gray-900">
              <HelpCircle className="w-4 h-4" />
              <span>مركز المساعدة</span>
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-rose-500"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Outlet: مخصص لرندر الصفحات المختلفة هنا */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
