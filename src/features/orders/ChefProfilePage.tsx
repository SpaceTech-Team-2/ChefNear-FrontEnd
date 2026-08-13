import { useState } from 'react';
import {
  Star,
  MapPin,
  Clock,
  Truck,
  Plus,
  Users,
  CheckCircle2,
  Utensils,
  
  // Instagram,
  // Youtube,
} from 'lucide-react';

/**
 * @typedef {Object} Dish
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {string} image
 * @property {string} portion
 * @property {string} [badge]
 */

/** @type {Dish[]} */
const dishes = [
  {
    id: 1,
    title: 'مجبوس لحم',
    description:
      'لحم غنم طازج مطبوخ ببطء مع البهار الإماراتية الأصيلة والأرز البسمتي.',
    price: 85,
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    portion: 'يكفي شخصين',
    badge: 'الأكثر مبيعاً',
  },
  {
    id: 2,
    title: 'لقيمات بالدبس',
    description:
      'عجينة مقلية مقرمشة من الخارج وطرية من الداخل مع دبس التمر والسمسم.',
    price: 35,
    image:
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
    portion: 'حصة عائلية',
  },
  {
    id: 3,
    title: 'صالونة دجاج',
    description:
      'مرق الدجاج الغني بالخضار والبهارات يقدم مع أرز أبيض.',
    price: 65,
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    portion: 'يكفي شخصين',
  },
];

export default function ChefProfilePage() {
  const [activeTab, setActiveTab] = useState('menu');

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF9F6] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="space-y-6">
          {/* Chef Card */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100/60 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80"
                alt="الشيف فاطمة"
                className="w-24 h-24 rounded-full object-cover border-2 border-rose-100 p-1"
              />
              <span className="absolute bottom-1 left-1 bg-emerald-500 text-white rounded-full p-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-black text-gray-900">
                الشيف فاطمة
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                مطبخ إماراتي أصيل بلمسة عصرية
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              <span className="bg-amber-100/60 text-amber-900 text-xs px-3 py-1 rounded-full font-bold">
                إماراتي
              </span>
              <span className="bg-rose-50 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                مأكولات بحرية
              </span>
              <span className="bg-rose-50 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                حلويات
              </span>
            </div>

            <hr className="w-full border-gray-100" />

            {/* Stats */}
            <div className="grid grid-cols-2 w-full divide-x divide-x-reverse divide-gray-100">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 font-black text-xl text-gray-900">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>4.9</span>
                </div>
                <p className="text-[11px] text-gray-400">(128 تقييم)</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 font-black text-xl text-gray-900">
                  <span>5</span>
                  <Utensils className="w-4 h-4 text-amber-800" />
                </div>
                <p className="text-[11px] text-gray-400">سنوات خبرة</p>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100/60 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-gray-900 mb-2">
              معلومات
            </h2>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <span>دبي، جميرا (التوصيل متاح لمناطق محددة)</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-500 shrink-0" />
                <span>الطلب المسبق: 24 ساعة</span>
              </div>

              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-gray-500 shrink-0" />
                <span>يتوفر توصيل للطلبات الكبيرة</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= LEFT / MAIN CONTENT ================= */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Cover Banner with Floating Cards */}
          <div className="relative w-full h-72 md:h-80 rounded-3xl overflow-hidden shadow-sm border border-rose-100/60">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
              alt="Kitchen Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            {/* Left Overlay Widget: Chef Near Profile */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/40 max-w-[180px] text-center space-y-2">
              <img
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=120&q=80"
                alt="شيف نير"
                className="w-12 h-12 rounded-full object-cover mx-auto"
              />
              <h3 className="font-bold text-gray-900 text-sm">شيف نير</h3>
              <p className="text-[10px] text-gray-500 leading-snug">
                متخصص في المطبخ العربي والهندي
              </p>

              <div className="flex items-center justify-center gap-2 text-gray-600 pt-1">
                {/* <Instagram className="w-3.5 h-3.5 cursor-pointer hover:text-rose-600" />
                <Youtube className="w-3.5 h-3.5 cursor-pointer hover:text-red-600" /> */}
              </div>

              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-1.5 rounded-lg transition-colors">
                متابعة
              </button>
            </div>

            {/* Top Right Floating Widget: Recent Recipes Preview */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-white/40 hidden sm:block">
              <span className="text-[10px] font-bold text-gray-500 block mb-1.5 text-center">
                أحدث الوصفات
              </span>
              <div className="flex gap-2">
                <div className="relative text-center">
                  <img
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=100&q=80"
                    alt="مجبوس اللحم"
                    className="w-12 h-10 object-cover rounded-lg"
                  />
                  <span className="text-[9px] font-medium text-gray-700 block mt-0.5">
                    مجبوس اللحم
                  </span>
                </div>
                <div className="relative text-center">
                  <img
                    src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=100&q=80"
                    alt="برياني الدجاج"
                    className="w-12 h-10 object-cover rounded-lg"
                  />
                  <span className="text-[9px] font-medium text-gray-700 block mt-0.5">
                    برياني الدجاج
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-end gap-8 border-b border-rose-100 pb-2 px-2">
            <button
              onClick={() => setActiveTab('about')}
              className={`text-sm font-bold transition-colors relative py-1 ${
                activeTab === 'about'
                  ? 'text-[#B34510]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              عن الشيف
              {activeTab === 'about' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B34510] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-sm font-bold transition-colors relative py-1 ${
                activeTab === 'reviews'
                  ? 'text-[#B34510]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              التقييمات
              {activeTab === 'reviews' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B34510] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`text-sm font-bold transition-colors relative py-1 ${
                activeTab === 'menu'
                  ? 'text-[#B34510]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              القائمة
              {activeTab === 'menu' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B34510] rounded-full" />
              )}
            </button>
          </div>

          {/* Menu Items Grid */}
          {activeTab === 'menu' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {dishes.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-white rounded-2xl border border-rose-100/60 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    {/* Dish Image & Badge */}
                    <div className="relative h-40 w-full">
                      <img
                        src={dish.image}
                        alt={dish.title}
                        className="w-full h-full object-cover"
                      />
                      {dish.badge && (
                        <span className="absolute top-3 right-3 bg-amber-100/90 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          {dish.badge}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-sm">
                          {dish.title}
                        </h3>
                        <span className="text-[#B34510] font-extrabold text-sm">
                          {dish.price} <span className="text-[10px]">درهم</span>
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                        {dish.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Action & Portion */}
                  <div className="p-4 pt-0 flex items-center justify-between text-xs border-t border-gray-50 mt-2">
                    <div className="flex items-center gap-1 text-gray-500 font-medium text-[11px]">
                      <Users className="w-3.5 h-3.5" />
                      <span>{dish.portion}</span>
                    </div>

                    <button className="p-1.5 border border-rose-200 text-[#B34510] hover:bg-[#B34510] hover:text-white rounded-full transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-2xl p-8 border border-rose-100 text-center text-gray-500 text-sm">
              قسم التقييمات يظهر آراء العملاء السابقة للطلبات المكتملة.
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-white rounded-2xl p-8 border border-rose-100 text-center text-gray-500 text-sm">
              معلومات إضافية وخبرة الشيف فاطمة في إعداد الأكلات الشعبية والتراثية.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}