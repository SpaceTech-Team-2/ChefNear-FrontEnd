import { useState } from "react";
import { Clock, Landmark, Camera, Save, CreditCard, Check } from "lucide-react";

// ملحوظة: مفيش أي endpoint في الـ backend لإعدادات المطبخ (الاسم/النبذة/
// ساعات العمل/نطاق التوصيل) — مفيش حتى PUT لتحديث البروفايل نفسه (GET
// /profile/me موجود بس من غير تعديل). فبنخزن التعديلات محليًا مؤقتًا بدل ما
// زرار "حفظ" يفضل من غير أي أثر خالص.
const STORAGE_KEY = "chefnear:kitchen-settings-draft";

interface KitchenSettingsDraft {
  kitchenName: string;
  bio: string;
  deliveryRadius: string;
  minOrder: string;
  weekdaySchedule: { active: boolean; from: string; to: string };
  weekendSchedule: { active: boolean; from: string; to: string };
}

const defaults: KitchenSettingsDraft = {
  kitchenName: "مطبخ الشيف أحمد التراثي",
  bio: "أقدم أشهى المأكولات العربية التقليدية بلمسة عصرية. جميع المكونات طازجة ومختارة بعناية لضمان أفضل تجربة تذوق.",
  deliveryRadius: "15",
  minOrder: "50",
  weekdaySchedule: { active: true, from: "09:00 AM", to: "10:00 PM" },
  weekendSchedule: { active: true, from: "11:00 AM", to: "11:30 PM" },
};

function loadDraft(): KitchenSettingsDraft {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export default function KitchenSettings() {
  const draft = loadDraft();
  const [kitchenName, setKitchenName] = useState(draft.kitchenName);
  const [bio, setBio] = useState(draft.bio);
  const [deliveryRadius, setDeliveryRadius] = useState(draft.deliveryRadius);
  const [minOrder, setMinOrder] = useState(draft.minOrder);
  const [weekdaySchedule, setWeekdaySchedule] = useState(draft.weekdaySchedule);
  const [weekendSchedule, setWeekendSchedule] = useState(draft.weekendSchedule);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ kitchenName, bio, deliveryRadius, minOrder, weekdaySchedule, weekendSchedule })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div dir="rtl" className="space-y-8 font-sans pb-10">
      {/* Cover / Header Banner */}
      <div className="relative w-full h-56 md:h-72 rounded-3xl overflow-hidden shadow-sm border border-rose-100/60">
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
          alt="صورة الغلاف للمطبخ"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Change Cover Camera Button */}
        <button className="absolute bottom-4 left-4 bg-white/90 hover:bg-white text-gray-700 p-2.5 rounded-full shadow-md backdrop-blur-sm transition-all">
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Working Hours & Payment Settings) - Takes 1 Col */}
        <div className="space-y-6">
          {/* Working Hours Card */}
          <div className="bg-white rounded-2xl border border-rose-100/60 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">ساعات العمل</h2>
            </div>

            <div className="space-y-4">
              {/* Sunday - Thursday */}
              <div className="bg-[#FFF8F6] border border-rose-100/60 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  {/* Custom Switch Toggle */}
                  <button
                    onClick={() =>
                      setWeekdaySchedule((prev) => ({
                        ...prev,
                        active: !prev.active,
                      }))
                    }
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ${
                      weekdaySchedule.active ? "bg-[#B34510]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                        weekdaySchedule.active
                          ? "-translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-bold text-gray-700">
                    الأحد - الخميس
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-xs">
                  <input
                    type="text"
                    value={weekdaySchedule.to}
                    onChange={(e) =>
                      setWeekdaySchedule({
                        ...weekdaySchedule,
                        to: e.target.value,
                      })
                    }
                    className="w-1/2 bg-white border border-rose-100/80 rounded-lg p-2 text-center text-gray-700 outline-none"
                  />
                  <span className="text-gray-400 font-medium">إلى</span>
                  <input
                    type="text"
                    value={weekdaySchedule.from}
                    onChange={(e) =>
                      setWeekdaySchedule({
                        ...weekdaySchedule,
                        from: e.target.value,
                      })
                    }
                    className="w-1/2 bg-white border border-rose-100/80 rounded-lg p-2 text-center text-gray-700 outline-none"
                  />
                </div>
              </div>

              {/* Friday - Saturday */}
              <div className="bg-[#FFF8F6] border border-rose-100/60 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() =>
                      setWeekendSchedule((prev) => ({
                        ...prev,
                        active: !prev.active,
                      }))
                    }
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ${
                      weekendSchedule.active ? "bg-[#B34510]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                        weekendSchedule.active
                          ? "-translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-bold text-gray-700">
                    الجمعة - السبت
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-xs">
                  <input
                    type="text"
                    value={weekendSchedule.to}
                    onChange={(e) =>
                      setWeekendSchedule({
                        ...weekendSchedule,
                        to: e.target.value,
                      })
                    }
                    className="w-1/2 bg-white border border-rose-100/80 rounded-lg p-2 text-center text-gray-700 outline-none"
                  />
                  <span className="text-gray-400 font-medium">إلى</span>
                  <input
                    type="text"
                    value={weekendSchedule.from}
                    onChange={(e) =>
                      setWeekendSchedule({
                        ...weekendSchedule,
                        from: e.target.value,
                      })
                    }
                    className="w-1/2 bg-white border border-rose-100/80 rounded-lg p-2 text-center text-gray-700 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Settings Card */}
          <div className="bg-white rounded-2xl border border-rose-100/60 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">إعدادات الدفع</h2>
            </div>

            <div className="bg-[#FFF1EC]/60 border border-rose-100 rounded-xl p-4 flex items-center justify-between opacity-60">
              <span className="text-xs font-bold text-gray-400">قريبًا</span>
              <div className="text-left space-y-1">
                <span className="text-[10px] text-gray-400 block">
                  الحساب البنكي المربوط
                </span>
                <div className="flex items-center gap-2 dir-ltr">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-400">
                    مش متاح بعد
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Changes Button (Mobile View Placement) */}
          <div className="space-y-2">
            <button
              onClick={handleSave}
              className="w-full bg-[#B34510] hover:bg-[#A03E0F] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saved ? "تم الحفظ" : "حفظ التغييرات"}</span>
            </button>
            <p className="text-[10px] text-gray-400 text-center">
              بتتحفظ محليًا مؤقتًا — الباك إند لسه معندوش endpoint لتحديث بيانات المطبخ.
            </p>
          </div>
        </div>

        {/* Right Column (General Info & Delivery Orders Settings) - Takes 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="bg-white rounded-2xl border border-rose-100/60 p-6 shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-gray-900">
              المعلومات العامة
            </h2>

            <div className="space-y-4">
              {/* Kitchen Name Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 block">
                  اسم المطبخ
                </label>
                <input
                  type="text"
                  value={kitchenName}
                  onChange={(e) => setKitchenName(e.target.value)}
                  className="w-full bg-[#FFF8F6] border border-rose-100/80 rounded-xl py-3 px-4 text-sm font-bold text-gray-800 outline-none focus:border-[#B34510] transition-colors"
                />
              </div>

              {/* Bio Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 block">
                  نبذة عن المطبخ (Bio)
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#FFF8F6] border border-rose-100/80 rounded-xl p-4 text-sm font-medium text-gray-700 leading-relaxed outline-none focus:border-[#B34510] transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Delivery & Orders Settings */}
          <div className="bg-white rounded-2xl border border-rose-100/60 p-6 shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-gray-900">
              التوصيل والطلبات
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Delivery Radius */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 block">
                  نطاق التوصيل (كم)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={deliveryRadius}
                    onChange={(e) => setDeliveryRadius(e.target.value)}
                    className="w-full bg-[#FFF8F6] border border-rose-100/80 rounded-xl py-3 pr-4 pl-12 text-sm font-bold text-gray-800 outline-none focus:border-[#B34510] transition-colors"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                    كم
                  </span>
                </div>
              </div>

              {/* Min Order Value */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 block">
                  الحد الأدنى للطلب
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    className="w-full bg-[#FFF8F6] border border-rose-100/80 rounded-xl py-3 pr-4 pl-16 text-sm font-bold text-gray-800 outline-none focus:border-[#B34510] transition-colors"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                    درهم
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
