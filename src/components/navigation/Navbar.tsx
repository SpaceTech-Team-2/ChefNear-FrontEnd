"use client";

import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Search, ShoppingCart, Heart, Bell, ChevronDown } from "lucide-react"; // استيراد الأيقونات الجديدة
import { Link } from "react-router-dom";

const navLinks = [
  { name: "اكتشف الطهاة", href: "/chefs", active: true },
  { name: "التخصصات", href: "/specialities" },
  { name: "تقديم الطعام", href: "/catering" },
  { name: "كيف يعمل", href: "/how-it-works" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // حالة تسجيل الدخول (قم بتغيير هذا بناءً على منطق المصادقة لديك)
  // false = يعرض أزرار تسجيل الدخول، true = يعرض صورة الملف الشخصي والأيقونات
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // بيانات المستخدم الوهمية
  const user = {
    avatarUrl:
      "https://images.unsplash.com/photo-1581382575275-97901c2635b7?&w=100&q=80&auto=format&fit=crop", // صورة شيف من Unsplash
    name: "الشيف أحمد",
  };

  return (
    // الخلفية بلون أبيض مائل للوردي الفاتح جداً (كما في الصورة)
    <header
      className="bg-[#FFF8F6] border-b border-gray-100 font-sans"
      dir="rtl"
    >
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-[1500px] items-center justify-between p-4 lg:px-8"
      >
        {/* القسم الأيمن: الشعار والبحث */}
        <div className="flex items-center gap-6 lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center">
            {/* الشعار النصي باللون البرتقالي المحروق */}
            <span className="text-3xl font-extrabold text-[#A03E0F]">
              ChefNear
            </span>
          </Link>

          {/* شريط البحث (مخفي في الشاشات الصغيرة) */}
          <div className="hidden lg:block relative w-full max-w-sm">
            <input
              type="text"
              placeholder="ابحث عن أطباق، طهاة، أو مطابخ..."
              className="w-full bg-[#FFEAE3]/50 border border-[#EACEC5] rounded-full py-2.5 pr-12 pl-4 text-sm outline-none focus:ring-1 focus:ring-[#A03E0F]/50 text-[#5F2108] placeholder:text-[#A87C69]"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#A87C69]" />
          </div>
        </div>

        {/* زر القائمة الموبايل */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#A03E0F]"
          >
            <span className="sr-only">فتح القائمة الرئيسية</span>
            <Bars3Icon aria-hidden="true" className="size-7" />
          </button>
        </div>

        {/* القسم الأوسط: روابط التنقل (مخفي في الموبايل) */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-10 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-[#A03E0F] relative py-1 ${
                link.active ? "text-[#A03E0F]" : "text-[#5F2108]"
              }`}
            >
              {link.name}
              {/* الخط السفلي للعنصر النشط */}
              {link.active && (
                <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#A03E0F] rounded-full"></span>
              )}
            </Link>
          ))}
          {/* زر أضف مطبخك */}
          <Link
            to="/add-kitchen"
            className="bg-[#B34510] text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-[#A03E0F] transition-colors shadow-sm"
          >
            أضف مطبخك
          </Link>
        </PopoverGroup>

        {/* القسم الأيسر: الإجراءات/الملف الشخصي */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-5">
          {isLoggedIn ? (
            // حالة تسجيل الدخول: عرض الأيقونات وصورة الملف الشخصي
            <>
              <div className="flex items-center gap-3.5 text-[#5F2108]">
                <button className="relative group p-1.5 hover:bg-[#FFEAE3] rounded-full transition-colors">
                  <Bell className="size-6 stroke-[1.5]" />
                  <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <button className="p-1.5 hover:bg-[#FFEAE3] rounded-full transition-colors">
                  <Heart className="size-6 stroke-[1.5]" />
                </button>
                <button className="relative p-1.5 hover:bg-[#FFEAE3] rounded-full transition-colors">
                  <ShoppingCart className="size-6 stroke-[1.5]" />
                  <span className="absolute -top-1 -left-1 flex items-center justify-center size-5 bg-[#A03E0F] text-white text-[11px] font-bold rounded-full">
                    3
                  </span>
                </button>
              </div>

              {/* قائمة الملف الشخصي المنسدلة */}
              <Popover className="relative">
                <PopoverButton className="flex items-center gap-2 outline-none">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="size-11 rounded-full object-cover border-2 border-[#EACEC5] p-0.5"
                  />
                  <ChevronDown className="size-4 text-[#A87C69]" />
                </PopoverButton>
                <PopoverPanel className="absolute left-0 z-10 mt-3 w-48 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5 text-sm">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-700"
                  >
                    الملف الشخصي
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-700"
                  >
                    طلباتي
                  </Link>
                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="block w-full text-right px-4 py-2 hover:bg-gray-50 rounded-lg text-red-600"
                  >
                    تسجيل الخروج
                  </button>
                </PopoverPanel>
              </Popover>
            </>
          ) : (
            // حالة عدم تسجيل الدخول: عرض روابط الدخول
            <div className="flex items-center gap-3 text-sm font-semibold">
              <Link to="/login" className="text-[#5F2108] hover:text-[#A03E0F]">
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="bg-[#B34510] text-white px-5 py-2.5 rounded-full hover:bg-[#A03E0F] transition-colors"
              >
                إنشاء حساب
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* حوار الموبايل (Mobile Menu) */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
        dir="rtl"
      >
        <div className="fixed inset-0 z-50 bg-black/30" />{" "}
        {/* خلفية مظلمة عند الفتح */}
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#FFF8F6] p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transition-transform duration-300">
          <div className="flex items-center justify-between gap-6">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="text-3xl font-extrabold text-[#A03E0F]">
                ChefNear
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-[#A03E0F]"
            >
              <span className="sr-only">إغلاق القائمة</span>
              <XMarkIcon aria-hidden="true" className="size-8" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-100">
              <div className="space-y-3 py-6 text-[#5F2108]">
                {/* شريط البحث في الموبايل */}
                <div className="relative w-full mb-6">
                  <input
                    type="text"
                    placeholder="ابحث..."
                    className="w-full bg-[#FFEAE3]/50 border border-[#EACEC5] rounded-full py-2.5 pr-11 pl-4 text-sm outline-none text-[#5F2108]"
                  />
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 size-5 text-[#A87C69]" />
                </div>

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-[#5F2108] hover:bg-[#FFEAE3]"
                  >
                    {link.name}
                  </Link>
                ))}

                <Link
                  to="/add-kitchen"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-[#B34510] text-white text-center text-sm font-bold px-6 py-3 rounded-full hover:bg-[#A03E0F] mt-6"
                >
                  أضف مطبخك
                </Link>
              </div>

              {/* قسم الحساب في الموبايل */}
              <div className="py-6">
                {isLoggedIn ? (
                  <div className="flex items-center gap-4 py-2">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="size-14 rounded-full object-cover border-2 border-[#EACEC5]"
                    />
                    <div>
                      <div className="font-bold text-[#5F2108]">
                        {user.name}
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm text-[#A03E0F] hover:underline"
                      >
                        عرض الملف الشخصي
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-[#5F2108] hover:bg-[#FFEAE3]"
                  >
                    تسجيل الدخول / إنشاء حساب
                  </Link>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
