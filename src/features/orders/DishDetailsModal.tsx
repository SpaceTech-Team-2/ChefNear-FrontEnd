import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Heart,
  Share2,
  Star,
  Clock,
  Leaf,
  Plus,
  Minus,
  ShoppingCart,
  Image as ImageIcon,
} from 'lucide-react';
import { getDishesID } from '../../services/api';
import { useParams, Link } from 'react-router-dom';

interface Dish {
  name?: string;
  description?: string;
  price?: number;
  chefDisplayName?: string;
  images?: { imageUrl: string }[];
  ingredients?: { name: string }[];
}

export default function DishDetailsModal() {
  const { id } = useParams();

  const [dish, setDish] = useState<Dish | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getDishesID(id)
      .then((response) => setDish(response?.data ?? null))
      .catch(() => setDish(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const pricePerItem = dish?.price ?? 0;
  const totalPrice = pricePerItem * quantity;

  if (isLoading) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#FFF9F6] p-4 md:p-8 font-sans">
        <div className="max-w-6xl mx-auto animate-pulse space-y-4">
          <div className="h-[380px] bg-rose-100/60 rounded-3xl" />
          <div className="h-6 w-1/2 bg-rose-100/60 rounded" />
        </div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#FFF9F6] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-black text-gray-900">لم يتم العثور على الطبق</h2>
          <Link
            to="/"
            className="inline-block bg-[#B34510] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#A03E0F] transition-colors"
          >
            رجوع للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FFF9F6] p-4 md:p-8 font-sans text-gray-800"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between py-2">
          <button className="flex items-center gap-2 text-[#A03E0F] hover:text-[#B34510] font-extrabold text-lg transition-colors">
            <ArrowRight className="w-5 h-5" />
            <span>{dish.chefDisplayName}</span>
          </button>

          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white border border-rose-100 rounded-full text-gray-600 hover:bg-rose-50 transition-colors shadow-sm">
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2.5 bg-white border border-rose-100 rounded-full transition-colors shadow-sm"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-600"
                }`}
              />
            </button>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= RIGHT COLUMN: MEDIA GALLERY (7 Cols in RTL) ================= */}
          <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
            {/* Main Featured Image Card */}
            <div className="relative rounded-3xl overflow-hidden border border-rose-100 shadow-sm h-[380px] md:h-[450px]">
              <img
                src={dish.images?.[0]?.imageUrl}
                alt="منسف أردني أصيل باللحم البلدي"
                className="w-full h-full object-cover"
              />

              {/* Top Badge */}
              <div className="absolute top-4 right-4 bg-amber-200/90 backdrop-blur-sm text-amber-950 text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                <span>الأعلى تقييماً</span>
              </div>
            </div>

            {/* Bottom Sub-images Row */}
            <div className="grid grid-cols-3 gap-3">
              {/* Show All Photos Box */}
              <button className="bg-[#FFF1EC] border border-rose-100 rounded-2xl h-24 flex flex-col items-center justify-center gap-2 text-[#A03E0F] hover:bg-[#FFE8E0] transition-colors">
                <ImageIcon className="w-6 h-6" />
                <span className="text-xs font-bold">عرض كل الصور</span>
              </button>

              {/* Sub Image 1 */}
              <div className="rounded-2xl overflow-hidden border border-rose-100 h-24">
                <img
                  src={dish.images?.[1]?.imageUrl}
                  alt="تحضير المنسف"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Sub Image 2 */}
              <div className="rounded-2xl overflow-hidden border border-rose-100 h-24">
                <img
                  src={dish.images?.[0]?.imageUrl}
                  alt="تقديم الجميد"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* ================= LEFT COLUMN: DISH DETAILS & ACTION FORM (5 Cols in RTL) ================= */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-rose-100 p-6 md:p-8 shadow-sm space-y-6 order-2 lg:order-1">
            {/* Title & Price Header */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-snug">
                  {dish.name}
                </h1>
                <div className="text-left shrink-0">
                  <span className="text-2xl font-black text-[#A03E0F]">
                    {pricePerItem}
                  </span>
                  <span className="text-xs text-gray-500 font-bold block">
                    درهم
                  </span>
                </div>
              </div>

              {/* Rating & Prep Time */}
              <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-md border border-amber-100">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>4.9</span>
                  <span className="text-gray-400 font-normal">(124)</span>
                </div>

                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>45-60 دقيقة</span>
                </div>
              </div>
            </div>

            {/* Chef Mini Card */}
            <div className="bg-[#FFF8F6] border border-rose-100/70 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=100&q=80"
                    alt="الشيف أمينة"
                    className="w-10 h-10 rounded-full object-cover border border-rose-200"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900">
                    {dish.chefDisplayName}
                  </h3>
                  <p className="text-[10px] text-gray-500">
                    مطبخ الأردن الممتاز
                  </p>
                </div>
              </div>

              <a
                href="#"
                className="text-xs font-bold text-[#A03E0F] hover:underline"
              >
                عرض الملف
              </a>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-extrabold text-gray-900">الوصف</h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                {dish.description}
              </p>
            </div>

            {/* Main Ingredients */}
            <div className="space-y-2">
              <h2 className="text-xs font-extrabold text-gray-900">
                المكونات الرئيسية
              </h2>
              <div className="flex flex-wrap gap-2">
                {dish.ingredients?.map((iTem: any, idx: number) => (
                  <span
                    key={iTem.name ?? idx}
                    className="bg-emerald-50/80 border border-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                  >
                    <Leaf className="w-3 h-3 text-emerald-600" />
                    <span>{iTem.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Special Notes Input */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-900 block">
                ملاحظات خاصة{" "}
                <span className="text-gray-400 font-normal">(اختياري)</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: بدون لوز، زيادة مرق..."
                className="w-full bg-[#FFF8F6] border border-rose-100 rounded-xl p-3 text-xs outline-none text-gray-800 placeholder:text-gray-400 focus:border-[#B34510] transition-colors resize-none"
              />
            </div>

            {/* Quantity & Add to Cart Footer Actions */}
            <div className="flex items-center gap-3 pt-2">
              {/* Quantity Stepper */}
              <div className="flex items-center bg-[#FFF8F6] border border-rose-100 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-600 hover:text-black rounded-lg transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-sm font-extrabold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-gray-600 hover:text-black rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Primary Cart Button */}
              <button className="flex-1 bg-[#B34510] hover:bg-[#A03E0F] text-white py-3 px-5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors shadow-sm">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>إضافة للسلة</span>
                </div>
                <span>• {totalPrice} درهم</span>
              </button>
            </div>
          </div>
        </div>
        {/* ملخص التقييمات + رابط لصفحة التقييمات الكاملة */}
        <Link
          to={id ? `/DishDetailsModal/${id}/reviews` : "#"}
          className="flex items-center justify-between bg-white rounded-3xl border border-rose-100 p-5 hover:border-[#B34510]/40 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-100">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="font-black text-sm">4.9</span>
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900">تقييمات العملاء</h2>
              <p className="text-xs text-gray-500">124 تقييم — شاهد الكل أو أضف رأيك</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#A03E0F]">عرض كل التقييمات ←</span>
        </Link>
      </div>
    </div>
  );
}