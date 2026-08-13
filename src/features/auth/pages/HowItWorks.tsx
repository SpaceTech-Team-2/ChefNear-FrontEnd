import React from "react";
import {
  Search,
  ChefHat,
  Utensils,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowLeft,
} from "lucide-react";

interface Step {
  id: number;
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  {
    id: 1,
    number: "01",
    title: "تصفح الطهاة والقائمة",
    description:
      "ابحث عن الأطباق المفضلة لديك أو اختر الشيف القريب منك والمناسب لذوقك.",
    icon: Search,
  },
  {
    id: 2,
    number: "02",
    title: "اطلب طبقك المحضر بحب",
    description:
      "حدد كمياتك وملاحظاتك الخاصة، وسيقوم الشيف بتحضير وجبتك طازجة خصيصاً لك.",
    icon: ChefHat,
  },
  {
    id: 3,
    number: "03",
    title: "استمتع بطعم البيت الأصيل",
    description:
      "تصلك الوجبة ساخنة وطازجة حتى باب بيتك لتستمتع بأجمل الأوقات مع عائلتك.",
    icon: Utensils,
  },
];

const features = [
  {
    icon: Sparkles,
    title: "طعام طازج 100%",
    description: "يتم تحضير الوجبات فور طلبك بمكونات طازجة عالية الجودة.",
  },
  {
    icon: ShieldCheck,
    title: "طهاة معتمدون",
    description:
      "نختار أمهر الطهاة المحليين بدقة لضمان أعلى معايير النظافة والجودة.",
  },
  {
    icon: Clock,
    title: "توصيل مريح",
    description: "نضمن وصول وجبتك في الوقت المحدد وبأفضل حالة ممكنة.",
  },
];

export default function HowItWorks() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FFF8F6] p-4 md:p-10 font-sans text-gray-800 flex flex-col justify-between"
    >
      <div className="max-w-5xl mx-auto w-full space-y-16 py-8">
        {/* Header Section */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="bg-amber-100/70 text-[#B34510] text-xs font-bold px-3 py-1 rounded-full inline-block">
            بساطة وسهولة
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
            كيف يعمل ChefNear؟
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            ثلاث خطوات بسيطة تفصلك عن الاستمتاع بأشهى المأكولات المنزلية المحضرة
            بيد أمهر الطهاة.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="bg-white rounded-3xl p-8 border border-rose-100/60 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between space-y-6 group"
              >
                {/* Step Number Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#B34510] flex items-center justify-center group-hover:bg-[#B34510] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-rose-200 group-hover:text-amber-400 transition-colors">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Why Us / Mini Features Section */}
        <div className="bg-white rounded-3xl p-8 border border-rose-100/60 shadow-sm space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-black text-gray-900">
              لماذا يفضلنا الجميع؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="space-y-2 p-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100/60 text-[#B34510] flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-4">
          <a
            href="/chefs"
            className="inline-flex items-center gap-2 bg-[#B34510] hover:bg-[#A03E0F] text-white font-bold px-8 py-3.5 rounded-full text-sm transition-colors shadow-sm"
          >
            <span>استكشف الطهاة الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
