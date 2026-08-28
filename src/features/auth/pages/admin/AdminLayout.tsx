import React, { useState } from "react";
import {
  Users,
  AlertTriangle,
  BarChart3,
  Settings,
  ShieldCheck,
  Menu,
  X,
  ChevronLeft,
  Tag,
  MessageSquare,
} from "lucide-react";
import { AdminUsersView } from "./AdminViews";
import { AdminDisputesView } from "./AdminDisputesView";
import { AdminAnalyticsView } from "./AdminAnalyticsView";
import { AdminSettingsView } from "./AdminSettingsView";
import { AdminCategoriesView } from "./AdminCategoriesView";
import { AdminReviewsView } from "./AdminReviewsView";

interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

export const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("users");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const navItems: NavItem[] = [
    {
      id: "users",
      label: "إدارة المستخدمين",
      shortLabel: "المستخدمين",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "disputes",
      label: "الشكاوى والنزاعات",
      shortLabel: "الشكاوى",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    {
      id: "analytics",
      label: "التقارير والتحليلات",
      shortLabel: "التحليلات",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: "reviews",
      label: "إدارة التقييمات",
      shortLabel: "التقييمات",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      id: "categories",
      label: "إدارة التصنيفات",
      shortLabel: "التصنيفات",
      icon: <Tag className="w-5 h-5" />,
    },
    {
      id: "settings",
      label: "إعدادات النظام",
      shortLabel: "الإعدادات",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row text-right dir-rtl">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-lg">
          <ShieldCheck className="w-6 h-6 text-orange-500" />
          <span>لوحة المسؤول</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`
        fixed md:static inset-y-0 right-0 z-40 w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "translate-x-full md:translate-x-0"
        }
      `}
      >
        <div>
          <div className="hidden md:flex items-center gap-2 p-6 border-b border-slate-800 font-bold text-xl">
            <ShieldCheck className="w-7 h-7 text-orange-500" />
            <span>لوحة تحكم الأدمن</span>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition ${
                  activeTab === item.id
                    ? "bg-orange-500 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <ChevronLeft className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-400 text-center">
          نظام ChefNear v1.0
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        {activeTab === "users" && <AdminUsersView />}
        {activeTab === "disputes" && <AdminDisputesView />}
        {activeTab === "analytics" && <AdminAnalyticsView />}
        {activeTab === "reviews" && <AdminReviewsView />}
        {activeTab === "categories" && <AdminCategoriesView />}
        {activeTab === "settings" && <AdminSettingsView />}
      </main>

      {/* Bottom Tab Bar (موبايل بس) */}
      <nav className="md:hidden fixed inset-x-0 bottom-0 z-30 bg-slate-900 border-t border-slate-800 flex items-stretch">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-bold transition-colors ${
              activeTab === item.id
                ? "text-orange-500"
                : "text-slate-400"
            }`}
          >
            {item.icon}
            <span className="leading-none">{item.shortLabel}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
