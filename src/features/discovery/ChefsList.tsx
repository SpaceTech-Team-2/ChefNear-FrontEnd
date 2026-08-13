import { useState } from "react";
import {
  Star,
  MapPin,
  UtensilsCrossed,
  Search,
  CheckCircle2,
  Check,
  Heart,
} from "lucide-react";

interface Chef {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  location: string;
  avatar: string;
  coverImage: string;
  tags: string[];
  isVerified?: boolean;
}

const chefsData: Chef[] = [
  {
    id: 1,
    name: "الشيف فاطمة",
    specialty: "مطبخ إماراتي أصيل بلمسة عصرية",
    rating: 4.9,
    reviewsCount: 128,
    experienceYears: 5,
    location: "دبي، جميرا",
    avatar:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
    tags: ["إماراتي", "مأكولات بحرية", "حلويات"],
    isVerified: true,
  },
  {
    id: 2,
    name: "الشيف أمينة",
    specialty: "أشهى الأطباق الأردنية والشامية التقليدية",
    rating: 4.8,
    reviewsCount: 95,
    experienceYears: 7,
    location: "أبوظبي، الخالدية",
    avatar:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    tags: ["مطبخ شامي", "مناسبات وولائم", "مخبوزات"],
    isVerified: true,
  },
  {
    id: 3,
    name: "الشيف أحمد",
    specialty: "مشويات ومأكولات مصرية وعربية على أصولها",
    rating: 4.7,
    reviewsCount: 210,
    experienceYears: 10,
    location: "الشارقة، المجاز",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    tags: ["مأكولات مصرية", "مشويات", "أطباق رئيسية"],
    isVerified: false,
  },
  {
    id: 4,
    name: "الشيف سارة",
    specialty: "أكل صحي ووجبات دايت متوازنة ولذيذة",
    rating: 4.9,
    reviewsCount: 84,
    experienceYears: 4,
    location: "دبي، مرسى دبي",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    tags: ["صحي ونباتي", "سلطات", "وجبات خفيفة"],
    isVerified: true,
  },
];

const categories = [
  "الكل",
  "إماراتي",
  "مطبخ شامي",
  "مأكولات مصرية",
  "صحي ونباتي",
  "حلويات",
];

export default function ChefsList() {
  const [selectedChefId, setSelectedChefId] = useState<number | null>(1); // معرف الشيف المختار
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChefs = chefsData.filter((chef) => {
    const matchesCategory =
      activeCategory === "الكل" || chef.tags.includes(activeCategory);
    const matchesSearch =
      chef.name.includes(searchQuery) ||
      chef.specialty.includes(searchQuery) ||
      chef.location.includes(searchQuery);
    return matchesCategory && matchesSearch;
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
              placeholder="ابحث عن شيف، مطبخ، أو منطقة..."
              className="w-full bg-white border border-rose-100 rounded-2xl py-2.5 pr-10 pl-4 text-sm outline-none focus:border-[#B34510] shadow-sm transition-colors"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-[#B34510] text-white shadow-sm"
                  : "bg-white border border-rose-100 text-gray-700 hover:bg-rose-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Chefs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChefs.map((chef) => {
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
                  {/* Cover Image & Favorite Button */}
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

                    {/* Badge for Selected State */}
                    {isSelected && (
                      <span className="absolute top-3 right-3 bg-[#B34510] text-white text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Check className="w-3 h-3" />
                        <span>تم الاختيار</span>
                      </span>
                    )}
                  </div>

                  {/* Avatar & Chef Main Info */}
                  <div className="px-5 pb-4 relative pt-1">
                    {/* Avatar overlapping Cover */}
                    <div className="relative -mt-12 mb-3 inline-block">
                      <img
                        src={chef.avatar}
                        alt={chef.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
                      />
                      {chef.isVerified && (
                        <span className="absolute bottom-1 left-0 bg-emerald-500 text-white rounded-full p-0.5 border border-white">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-gray-900">
                          {chef.name}
                        </h2>

                        {/* Rating */}
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{chef.rating}</span>
                          <span className="text-gray-400 font-normal">
                            ({chef.reviewsCount})
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed min-h-[36px]">
                        {chef.specialty}
                      </p>
                    </div>

                    {/* Location & Experience */}
                    <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium pt-3 mt-3 border-t border-gray-50">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{chef.location}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-gray-400" />
                        <span>{chef.experienceYears} سنوات خبرة</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-3">
                      {chef.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-rose-50 text-gray-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
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
      </div>
    </div>
  );
}
