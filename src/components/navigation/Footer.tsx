import {
  Send,
  // Instagram,
  // Facebook,
  // Twitter,
  // Youtube,
  Phone,
  Mail,
  MapPin,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      dir="rtl"
      className="bg-[#FFF1EC] text-gray-800 font-sans border-t border-rose-100/80"
    >
      {/* Top Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="bg-[#B34510] text-white rounded-3xl p-6 md:p-10 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Background Decorative Element */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />

          <div className="space-y-2 text-center lg:text-right max-w-xl">
            <h3 className="text-2xl md:text-3xl font-black">
              اشترك للحصول على أحدث الأطباق والعروض!
            </h3>
            <p className="text-xs md:text-sm text-rose-100/90 leading-relaxed">
              انضم لنشرتنا البريدية واستمتع بخصومات حصرية واكتشف أحدث الطهاة
              المنضمين مجتمعنا.
            </p>
          </div>

          {/* Subscribe Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full lg:w-auto flex items-center bg-white rounded-full p-1.5 shadow-sm max-w-md"
          >
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني..."
              className="w-full bg-transparent border-none py-2 px-4 text-xs md:text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="bg-[#B34510] hover:bg-[#A03E0F] text-white font-bold px-6 py-2.5 rounded-full text-xs flex items-center gap-2 transition-colors shrink-0"
            >
              <span>اشترك</span>
              <Send className="w-3.5 h-3.5 rotate-180" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info (Takes 2 Columns in LG) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-extrabold text-[#A03E0F]">
                ChefNear
              </span>
            </Link>

            <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
              منصتك الأولى لاكتشاف أشهى الأطباق المنزلية والأكل البيتي الأصيل من
              أمهر الطهاة المحليين المعتمدين وتوصيلها حتى باب بيتك.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-xs text-gray-600 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B34510] shrink-0" />
                <span>شيخ زايد , مصر</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B34510] shrink-0" />
                <span dir="ltr">+2 010 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B34510] shrink-0" />
                <span>support@chefnear.com</span>
              </div>
            </div>
          </div>

          {/* Column 1: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-gray-900">استكشف المنصة</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link
                  to="/chefs"
                  className="hover:text-[#B34510] transition-colors"
                >
                  اكتشف الطهاة
                </Link>
              </li>
              <li>
                <Link
                  to="/specialities"
                  className="hover:text-[#B34510] transition-colors"
                >
                  التخصصات والتفضيلات
                </Link>
              </li>
              <li>
                <Link
                  to="/catering"
                  className="hover:text-[#B34510] transition-colors"
                >
                  تقديم الطعام والولائم
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="hover:text-[#B34510] transition-colors"
                >
                  كيف يعمل ChefNear
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Chefs & Partners */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-gray-900">
              للطهاة والشركاء
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link
                  to="/add-kitchen"
                  className="hover:text-[#B34510] transition-colors font-bold text-[#B34510]"
                >
                  انضم كـ شيف (أضف مطبخك)
                </Link>
              </li>
              <li>
                <Link
                  to="/chef"
                  className="hover:text-[#B34510] transition-colors"
                >
                  لوحة تحكم الشيف
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-[#B34510] transition-colors"
                >
                  شروط وانضمام الطهاة
                </Link>
              </li>
              <li>
                <Link
                  to="/guidelines"
                  className="hover:text-[#B34510] transition-colors"
                >
                  معايير السلامة والجودة
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-gray-900">
              المساعدة والدعم
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link
                  to="/faq"
                  className="hover:text-[#B34510] transition-colors"
                >
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link
                  to="/HelpCenter"
                  className="hover:text-[#B34510] transition-colors"
                >
                  مركز المساعدة
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-[#B34510] transition-colors"
                >
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="hover:text-[#B34510] transition-colors"
                >
                  الشروط والأحكام
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-rose-200/60 bg-[#FFE8E0]/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          {/* Copyright */}
          <div className="flex items-center gap-1 font-medium">
            <span>جميع الحقوق محفوظة © {new Date().getFullYear()}</span>
            <span className="font-extrabold text-[#A03E0F]">ChefNear</span>
            <span>• صُنع بـ</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>

          {/* Social Links */}
          {/* <div className="flex items-center gap-3">
            <a
              href="#"
              className="p-2 bg-white rounded-full text-gray-600 hover:text-[#B34510] hover:shadow-sm transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="p-2 bg-white rounded-full text-gray-600 hover:text-[#B34510] hover:shadow-sm transition-all"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="p-2 bg-white rounded-full text-gray-600 hover:text-[#B34510] hover:shadow-sm transition-all"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="p-2 bg-white rounded-full text-gray-600 hover:text-[#B34510] hover:shadow-sm transition-all"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
