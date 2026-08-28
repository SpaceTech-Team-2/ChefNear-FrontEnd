import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Bell, Leaf, MapPinned, Sparkles } from "lucide-react";
import { loadPreferences, savePreferences, type LocalPreferences } from "../../services/localPreferences";

const dietaryOptions = [
  { value: "vegetarian", label: "نباتي" },
  { value: "halal", label: "حلال فقط" },
  { value: "no-nuts", label: "بدون مكسرات" },
  { value: "low-spice", label: "أقل حرارة (توابل خفيفة)" },
];

export default function PreferencesPage() {
  const [prefs, setPrefs] = useState<LocalPreferences>(loadPreferences);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    savePreferences(prefs);
    setSaved(true);
    const timer = setTimeout(() => setSaved(false), 1200);
    return () => clearTimeout(timer);
  }, [prefs]);

  const toggleDietary = (value: string) => {
    setPrefs((p) => ({
      ...p,
      dietary: p.dietary.includes(value)
        ? p.dietary.filter((v) => v !== value)
        : [...p.dietary, value],
    }));
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF9F6] p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="p-2 bg-white border border-rose-100 rounded-full text-[#A03E0F] hover:bg-rose-50 transition-colors shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">تفضيلاتك</h1>
          </div>
          <span
            className={`text-xs font-bold flex items-center gap-1 text-emerald-700 transition-opacity ${
              saved ? "opacity-100" : "opacity-0"
            }`}
          >
            <Check className="w-3.5 h-3.5" /> تم الحفظ
          </span>
        </div>

        {/* التفضيلات الغذائية */}
        <div className="bg-white rounded-3xl border border-rose-100/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Leaf className="w-4.5 h-4.5" />
            </div>
            <h2 className="font-black text-gray-900">التفضيلات الغذائية</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((opt) => {
              const active = prefs.dietary.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleDietary(opt.value)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                    active
                      ? "bg-[#B34510] text-white border-[#B34510]"
                      : "bg-[#FFF8F6] text-[#5F2108] border-[#EACEC5] hover:border-[#B34510]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-400">
            هنستخدمها عشان نظهرلك الأطباق والشيفات الأنسب ليك.
          </p>
        </div>

        {/* التخصصات المطبخية */}
        <Link
          to="/specialities"
          className="flex items-center justify-between bg-white rounded-3xl border border-rose-100/80 shadow-sm p-6 hover:border-[#B34510]/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-50 text-[#B34510] flex items-center justify-center shrink-0">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="font-black text-gray-900">التخصصات المطبخية</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {prefs.specialties.length > 0
                  ? `${prefs.specialties.length} تخصص مختار`
                  : "لسه مفيش تخصصات مختارة"}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#A03E0F]">تعديل ←</span>
        </Link>

        {/* الإشعارات */}
        <div className="bg-white rounded-3xl border border-rose-100/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center">
              <Bell className="w-4.5 h-4.5" />
            </div>
            <h2 className="font-black text-gray-900">الإشعارات</h2>
          </div>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-sm font-bold text-gray-800">تحديثات الطلب</div>
              <div className="text-xs text-gray-400">إشعار بكل مرحلة من مراحل طلبك</div>
            </div>
            <input
              type="checkbox"
              checked={prefs.notifyOrderUpdates}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, notifyOrderUpdates: e.target.checked }))
              }
              className="w-5 h-5 accent-[#B34510]"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer border-t border-gray-50 pt-4">
            <div>
              <div className="text-sm font-bold text-gray-800">عروض وخصومات</div>
              <div className="text-xs text-gray-400">آخر عروض الشيفات القريبين منك</div>
            </div>
            <input
              type="checkbox"
              checked={prefs.notifyOffers}
              onChange={(e) => setPrefs((p) => ({ ...p, notifyOffers: e.target.checked }))}
              className="w-5 h-5 accent-[#B34510]"
            />
          </label>
        </div>

        {/* نطاق البحث */}
        <div className="bg-white rounded-3xl border border-rose-100/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-rose-50 text-[#B34510] flex items-center justify-center">
              <MapPinned className="w-4.5 h-4.5" />
            </div>
            <h2 className="font-black text-gray-900">نطاق البحث الافتراضي</h2>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={30}
              value={prefs.searchRadiusKm}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, searchRadiusKm: Number(e.target.value) }))
              }
              className="flex-1 accent-[#B34510]"
            />
            <span className="text-sm font-black text-[#B34510] w-16 text-left">
              {prefs.searchRadiusKm} كم
            </span>
          </div>
          <p className="text-xs text-gray-400">
            بنستخدمها كنطاق افتراضي وقت ما تدوّر على "شيفات بالقرب مني".
          </p>
        </div>
      </div>
    </div>
  );
}
