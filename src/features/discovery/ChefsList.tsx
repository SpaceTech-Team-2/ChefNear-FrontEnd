import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  UtensilsCrossed,
  Search,
  Check,
  Heart,
} from "lucide-react";
import { getCategories, getDishes } from "../../services/api";

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

interface DerivedChef {
  id: string;
  name: string;
  coverImage: string;
  dishCount: number;
  sampleDishes: string[];
}

// ملحوظة: لا يوجد endpoint في الـ backend حالياً بيرجع قايمة شيفات (زي /api/v1/Chefs).
// المتاح بس هو chefDisplayName جوه كل طبق من /api/v1/Dishes، فبنستنتج قايمة الشيفات
// من الأطباق الفعلية بدل استخدام بيانات وهمية (تقييم/صورة شخصية/خبرة/موقع مش موجودين فعلاً).
function deriveChefs(dishes: Dish[]): DerivedChef[] {
  const map = new Map<string, Dish[]>();
  for (const dish of dishes) {
    const list = map.get(dish.chefDisplayName) ?? [];
    list.push(dish);
    map.set(dish.chefDisplayName, list);
  }

  return Array.from(map.entries()).map(([name, chefDishes]) => ({
    id: name,
    name,
    coverImage: chefDishes[0].primaryImageUrl,
    dishCount: chefDishes.length,
    sampleDishes: chefDishes.slice(0, 3).map((d) => d.name),
  }));
}

export default function ChefsList() {
  const [selectedChefId, setSelectedChefId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categoriesRes, isLoading: categoriesLoading } = useQuery<
    ApiEnvelope<Category[]>
  >({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const {
    data: dishesRes,
    isLoading: dishesLoading,
    isError: dishesError,
  } = useQuery<ApiEnvelope<Dish[]>>({
    queryKey: ["dishes-for-chefs", selectedCategoryId],
    queryFn: () =>
      getDishes({
        CategoryId: selectedCategoryId ?? undefined,
        PageNumber: 1,
        PageSize: 200,
      }),
  });

  const categories = categoriesRes?.data ?? [];
  const dishes = useMemo(() => dishesRes?.data ?? [], [dishesRes]);
  const chefs = useMemo(() => deriveChefs(dishes), [dishes]);

  const filteredChefs = chefs.filter((chef) => {
    const query = searchQuery.trim();
    if (!query) return true;
    return (
      chef.name.includes(query) ||
      chef.sampleDishes.some((d) => d.includes(query))
    );
  });

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FFF9F6] p-4 md:p-8 font-sans text-gray-800"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              اختر الشيف المناسب
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              استكشف أمهر الطهاة المحليين واقضِ تجربتك مع طعم بيت أصيل.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن شيف أو طبق..."
              className="w-full bg-white border border-rose-100 rounded-2xl py-2.5 pr-10 pl-4 text-sm outline-none focus:border-[#B34510] shadow-sm transition-colors"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategoryId === null
                ? "bg-[#B34510] text-white shadow-sm"
                : "bg-white border border-rose-100 text-gray-700 hover:bg-rose-50"
            }`}
          >
            الكل
          </button>
          {categoriesLoading &&
            Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-9 w-20 rounded-full bg-rose-100/60 animate-pulse shrink-0"
              />
            ))}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategoryId === cat.id
                  ? "bg-[#B34510] text-white shadow-sm"
                  : "bg-white border border-rose-100 text-gray-700 hover:bg-rose-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Error state */}
        {dishesError && (
          <div className="text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-4">
            تعذر تحميل بيانات الشيفات حالياً. حاول تحديث الصفحة.
          </div>
        )}

        {/* Chefs Grid */}
        {!dishesError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dishesLoading &&
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-rose-100/80 shadow-sm overflow-hidden animate-pulse"
                >
                  <div className="h-32 w-full bg-gray-100" />
                  <div className="px-5 pb-4 pt-1 space-y-3">
                    <div className="w-20 h-20 rounded-full bg-gray-100 -mt-12 border-4 border-white" />
                    <div className="h-4 w-1/2 bg-gray-100 rounded" />
                    <div className="h-3 w-full bg-gray-100 rounded" />
                  </div>
                </div>
              ))}

            {!dishesLoading && filteredChefs.length === 0 && (
              <p className="col-span-full text-center text-sm text-gray-500 py-8">
                لا يوجد شيفات مطابقين للبحث حالياً.
              </p>
            )}

            {!dishesLoading &&
              filteredChefs.map((chef) => {
                const isSelected = selectedChefId === chef.id;

                return (
                  <div
                    key={chef.id}
                    className={`bg-white rounded-3xl border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden relative ${
                      isSelected
                        ? "border-[#B34510] ring-2 ring-[#B34510]/20"
                        : "border-rose-100/80"
                    }`}
                  >
                    <div>
                      {/* Cover Image (real dish photo from this chef) & Favorite Button */}
                      <div className="relative h-32 w-full">
                        <img
                          src={chef.coverImage}
                          alt={chef.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                        <button className="absolute top-3 left-3 bg-white/80 hover:bg-white p-1.5 rounded-full text-gray-700 backdrop-blur-sm transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>

                        {isSelected && (
                          <span className="absolute top-3 right-3 bg-[#B34510] text-white text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <Check className="w-3 h-3" />
                            <span>تم الاختيار</span>
                          </span>
                        )}
                      </div>

                      {/* Avatar (initials, لا يوجد صورة شخصية حقيقية من الـ backend) & Chef Main Info */}
                      <div className="px-5 pb-4 relative pt-1">
                        <div className="relative -mt-12 mb-3 inline-flex">
                          <div className="w-20 h-20 rounded-full border-4 border-white shadow-sm bg-amber-700 text-white flex items-center justify-center text-2xl font-black">
                            {chef.name.trim().slice(-1)}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h2 className="text-lg font-black text-gray-900">
                              {chef.name}
                            </h2>
                          </div>

                          <p className="text-xs text-gray-500 leading-relaxed min-h-[36px]">
                            {chef.sampleDishes.join(" • ")}
                          </p>
                        </div>

                        {/* Dish count (بيانات حقيقية بدل التقييم/الخبرة الوهمية) */}
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium pt-3 mt-3 border-t border-gray-50">
                          <UtensilsCrossed className="w-3.5 h-3.5 text-gray-400" />
                          <span>{chef.dishCount} أطباق متاحة</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Action Button */}
                    <div className="p-4 pt-0">
                      <button
                        onClick={() => setSelectedChefId(chef.id)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          isSelected
                            ? "bg-[#B34510] text-white shadow-sm"
                            : "bg-rose-50/80 hover:bg-rose-100/80 text-gray-800"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>الشيف المختار</span>
                          </>
                        ) : (
                          <span>اختيار الشيف</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
