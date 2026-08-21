import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  MapPin,
  ShoppingCart,
  Heart,
  SlidersHorizontal,
  LocateFixed,
} from "lucide-react";
import { getCategories, getDishes } from "../../services/api";
import { useCart } from "../../services/CartContext";

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

// ملحوظة: صفحة "البحث والاكتشاف" في التصميم عبارة عن بحث أطباق بفلاتر
// (مش قايمة شيفات). الفلاتر هنا كلها مربوطة بحقول حقيقية موجودة في
// GET /api/v1/Dishes (Search, CategoryId, MaxPrice, ClientLatitude/Longitude,
// MaxDistanceKm). فلاتر زي "الأعلى تقييماً" أو "نباتي" اتشالت لأنه معندناش
// بيانات تقييم أو تصنيف نباتي حقيقية من الـ backend حاليًا.
export default function ChefsList() {
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [maxPrice, setMaxPrice] = useState("");
  const [nearMe, setNearMe] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [radiusKm, setRadiusKm] = useState(15);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const { addItem } = useCart();

  const { data: categoriesRes, isLoading: categoriesLoading } = useQuery<
    ApiEnvelope<Category[]>
  >({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const categories = categoriesRes?.data ?? [];

  const {
    data: dishesRes,
    isLoading: dishesLoading,
    isError: dishesError,
  } = useQuery<ApiEnvelope<Dish[]>>({
    queryKey: [
      "discover-dishes",
      search,
      selectedCategoryId,
      maxPrice,
      nearMe,
      coords,
      radiusKm,
    ],
    queryFn: () =>
      getDishes({
        Search: search.trim() || undefined,
        CategoryId: selectedCategoryId ?? undefined,
        MaxPrice: maxPrice ? Number(maxPrice) : undefined,
        ClientLatitude: nearMe && coords ? coords.lat : undefined,
        ClientLongitude: nearMe && coords ? coords.lng : undefined,
        MaxDistanceKm: nearMe && coords ? radiusKm : undefined,
        PageNumber: 1,
        PageSize: 24,
      }),
  });
  const dishes = dishesRes?.data ?? [];

  const handleNearMeToggle = () => {
    if (nearMe) {
      setNearMe(false);
      return;
    }
    if (!navigator.geolocation) {
      setGeoError("المتصفح مش بيدعم تحديد الموقع.");
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setNearMe(true);
        setGeoLoading(false);
      },
      () => {
        setGeoError("محتاجين إذن الوصول لموقعك عشان نلاقي أطباق قريبة منك.");
        setGeoLoading(false);
      }
    );
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FFF9F6] p-4 md:p-8 font-sans text-gray-800"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              البحث والاكتشاف
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {dishesLoading
                ? "جاري البحث..."
                : `تم العثور على ${dishes.length} نتيجة`}
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن أطباق، طهاة، أو مطابخ..."
              className="w-full bg-white border border-rose-100 rounded-2xl py-2.5 pr-10 pl-4 text-sm outline-none focus:border-[#B34510] shadow-sm transition-colors"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar filters */}
          <aside className="lg:col-span-1 bg-white rounded-3xl border border-rose-100/80 shadow-sm p-5 space-y-6 h-fit order-2 lg:order-1">
            <div className="flex items-center gap-2 font-black text-gray-900">
              <SlidersHorizontal className="w-4 h-4" />
              <span>الفئات والتصفية</span>
            </div>

            {/* Categories (closest match to "cuisine" in the design) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600">
                التصنيف
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    selectedCategoryId === null
                      ? "bg-[#B34510] text-white"
                      : "bg-rose-50/60 text-gray-700 hover:bg-rose-100/60"
                  }`}
                >
                  الكل
                </button>
                {categoriesLoading &&
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-8 rounded-xl bg-rose-50 animate-pulse"
                    />
                  ))}
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      selectedCategoryId === cat.id
                        ? "bg-[#B34510] text-white"
                        : "bg-rose-50/60 text-gray-700 hover:bg-rose-100/60"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Max price */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600">
                أقل من سعر (ج.م)
              </label>
              <input
                type="number"
                min={0}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="مثال: 100"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#B34510]"
              />
            </div>

            {/* Near me / distance */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600">
                البحث بالقرب مني
              </label>
              <button
                onClick={handleNearMeToggle}
                disabled={geoLoading}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-60 ${
                  nearMe
                    ? "bg-[#B34510] text-white"
                    : "bg-rose-50/60 text-gray-700 hover:bg-rose-100/60"
                }`}
              >
                <LocateFixed className="w-4 h-4" />
                <span>
                  {geoLoading
                    ? "جاري تحديد موقعك..."
                    : nearMe
                    ? "الموقع مفعّل"
                    : "استخدم موقعي الحالي"}
                </span>
              </button>
              {geoError && (
                <p className="text-[11px] text-red-600">{geoError}</p>
              )}
              {nearMe && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>نطاق البحث</span>
                    <span className="font-bold">{radiusKm} كم</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="w-full accent-[#B34510]"
                  />
                </div>
              )}
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {dishesError && (
              <div className="text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-4">
                تعذر تحميل النتائج حالياً. حاول تحديث الصفحة.
              </div>
            )}

            {!dishesError && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {dishesLoading &&
                  Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse"
                    >
                      <div className="h-40 w-full bg-gray-100" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 w-2/3 bg-gray-100 rounded" />
                        <div className="h-3 w-1/2 bg-gray-100 rounded" />
                      </div>
                    </div>
                  ))}

                {!dishesLoading && dishes.length === 0 && (
                  <p className="col-span-full text-center text-sm text-gray-500 py-16">
                    مفيش أطباق مطابقة لبحثك حالياً. جرب تغيير الفلاتر.
                  </p>
                )}

                {!dishesLoading &&
                  dishes.map((dish) => (
                    <Link
                      key={dish.id}
                      to={`/DishDetailsModal/${dish.id}`}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                    >
                      <div className="relative h-40 w-full">
                        <img
                          src={dish.primaryImageUrl}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={(e) => e.preventDefault()}
                          className="absolute top-3 left-3 bg-white/80 hover:bg-white backdrop-blur-sm p-1.5 rounded-full text-gray-700 transition-colors shadow-sm"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addItem({
                              dishId: dish.id,
                              name: dish.name,
                              price: dish.price,
                              image: dish.primaryImageUrl,
                              chefDisplayName: dish.chefDisplayName,
                            });
                          }}
                          className="absolute bottom-3 left-3 bg-amber-800 hover:bg-amber-900 text-white rounded-full p-2 shadow-sm transition-colors"
                          aria-label="أضف إلى السلة"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-4 space-y-1.5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-800 text-sm">
                            {dish.name}
                          </h3>
                          <span className="text-amber-800 font-extrabold text-sm shrink-0">
                            {dish.price} ج.م
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1">
                          {dish.description}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-50 mt-1">
                          <span>{dish.chefDisplayName}</span>
                          {typeof dish.distanceKm === "number" &&
                            nearMe && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {dish.distanceKm.toFixed(1)} كم
                              </span>
                            )}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
