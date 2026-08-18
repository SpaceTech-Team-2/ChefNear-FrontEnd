import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Star, ArrowLeft, Utensils, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { getCategories, getDishes } from "../../../services/api";
import { useCart } from "../../../services/CartContext";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  primaryImageUrl: string;
  chefDisplayName: string;
  distanceKm?: number;
}

interface ApiEnvelope<T> {
  data: T;
  isSuccess: boolean;
  message: string;
}

export default function HomeFeed() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const { addItem } = useCart();

  const {
    data: categoriesRes,
    isLoading: categoriesLoading,
  } = useQuery<ApiEnvelope<Category[]>>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const {
    data: dishesRes,
    isLoading: dishesLoading,
    isError: dishesError,
  } = useQuery<ApiEnvelope<Dish[]>>({
    queryKey: ["dishes", selectedCategoryId],
    queryFn: () =>
      getDishes({
        CategoryId: selectedCategoryId ?? undefined,
        PageNumber: 1,
        PageSize: 8,
      }),
  });

  const categories = categoriesRes?.data ?? [];
  const dishes = dishesRes?.data ?? [];

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-50/50 p-4 md:p-8 space-y-8 max-w-7xl mx-auto font-sans"
    >
      {/* Top Banner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Small Cards Column (RTL order) */}
        <div className="flex flex-col gap-4 order-2 lg:order-1">
          {/* Top Info Box */}
          <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-1/2 min-h-[160px]">
            <div className="w-12 h-12 bg-amber-700 rounded-full flex items-center justify-center text-white mb-3 shadow-sm">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              أكل بيتى أصيل
            </h3>
            <p className="text-xs text-gray-500">تصفح مئات الطهاة المحليين</p>
          </div>

          {/* Bottom Image Card */}
          <div className="relative rounded-2xl overflow-hidden h-1/2 min-h-[160px] group">
            <img
              src="https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80"
              alt="حلويات شرقية"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h3 className="text-white text-xl font-bold">حلويات شرقية</h3>
            </div>
          </div>
        </div>

        {/* Main Hero Card */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden min-h-[340px] flex flex-col justify-between p-6 text-white order-1 lg:order-2">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
            alt="وليمة الخروف المحمر العائلية"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          {/* Badges */}
          <div className="relative z-10 flex gap-2">
            <span className="bg-amber-100/90 text-amber-900 text-xs px-3 py-1 rounded-full font-medium">
              الأكثر طلباً
            </span>
            <span className="bg-white/90 text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
              طازج اليوم
            </span>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 space-y-2 mt-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold">
              وليمة الخروف المحمر العائلية
            </h2>
            <p className="text-sm text-gray-200 max-w-xl">
              طعم أصيل يجمع العائلة، محضر بشغف وتوابل سرية من مطبخ الشيف نادية.
            </p>

            {/* Hero Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/20">
              <button className="bg-amber-800 hover:bg-amber-900 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors">
                اطلب الآن
              </button>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold">4.9</span>
                  <span className="text-gray-300">(120)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">الشيف نادية</span>
                  <img
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=100&q=80"
                    alt="الشيف نادية"
                    className="w-8 h-8 rounded-full border border-white/50 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Filter Horizontal Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`whitespace-nowrap px-5 py-2 rounded-full border text-xs md:text-sm font-medium transition-colors ${
            selectedCategoryId === null
              ? "bg-amber-800 border-amber-800 text-white"
              : "border-rose-100 bg-rose-50/40 hover:bg-rose-100/60 text-gray-700"
          }`}
        >
          الكل
        </button>
        {categoriesLoading &&
          Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="h-9 w-24 rounded-full bg-rose-50 animate-pulse shrink-0"
            />
          ))}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategoryId(category.id)}
            className={`whitespace-nowrap px-5 py-2 rounded-full border text-xs md:text-sm font-medium transition-colors ${
              selectedCategoryId === category.id
                ? "bg-amber-800 border-amber-800 text-white"
                : "border-rose-100 bg-rose-50/40 hover:bg-rose-100/60 text-gray-700"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Dishes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              أطباق مميزة اليوم
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              اختيارات طازجة من أمهر الطهاة في منطقتك
            </p>
          </div>
          <a
            href="#"
            className="flex items-center gap-1 text-xs text-amber-800 font-bold hover:underline"
          >
            <span>عرض الكل</span>
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>

        {/* Dish Cards Grid */}
        {dishesError && (
          <div className="text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-4">
            تعذر تحميل الأطباق حالياً. حاول تحديث الصفحة.
          </div>
        )}

        {!dishesError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dishesLoading &&
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse"
                >
                  <div className="h-44 w-full bg-gray-100" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-2/3 bg-gray-100 rounded" />
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-1/2 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}

            {!dishesLoading && dishes.length === 0 && (
              <p className="col-span-full text-center text-sm text-gray-500 py-8">
                لا توجد أطباق متاحة في هذا التصنيف حالياً.
              </p>
            )}

            {!dishesLoading &&
              dishes.map((dish) => (
                <Link key={dish.id} to="/DishDetailsModal" className="contents">
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      {/* Image */}
                      <div className="relative h-44 w-full">
                        <img
                          src={dish.primaryImageUrl}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                        />
                        <button className="absolute top-3 left-3 bg-white/80 hover:bg-white backdrop-blur-sm p-1.5 rounded-full text-gray-700 transition-colors shadow-sm">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-800 text-sm md:text-base">
                            {dish.name}
                          </h3>
                          <span className="text-amber-800 font-extrabold text-sm">
                            {dish.price}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {dish.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-50 mt-2 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                        <span>{dish.chefDisplayName}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addItem({
                            dishId: dish.id,
                            name: dish.name,
                            price: dish.price,
                            image: dish.primaryImageUrl,
                            chefDisplayName: dish.chefDisplayName,
                          });
                        }}
                        className="flex items-center gap-1 bg-amber-800 hover:bg-amber-900 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>أضف</span>
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
