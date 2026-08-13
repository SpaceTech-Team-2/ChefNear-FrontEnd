import React, { useState } from "react";
import {
  Check,
  Fish,
  Cake,
  Leaf,
  UtensilsCrossed,
  Croissant,
  Coffee,
  Flame,
  ArrowLeft,
} from "lucide-react";

interface SpecialtyOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  bgImage: string;
}

const specialtiesData: SpecialtyOption[] = [
  {
    id: "traditional",
    title: "تقليدي",
    description: "أطباق أصيلة بلمسة منزلية",
    icon: UtensilsCrossed,
    bgImage:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "healthy",
    title: "صحي",
    description: "خيارات خفيفة ومغذية",
    icon: Leaf,
    bgImage:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "sweets",
    title: "حلويات",
    description: "لمن يحب المذاق الحلو",
    icon: Cake,
    bgImage:
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "seafood",
    title: "مأكولات بحرية",
    description: "نكهات من البحر",
    icon: Fish,
    bgImage:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "spicy",
    title: "حار",
    description: "نكهات قوية ولاذعة",
    icon: Flame,
    bgImage:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "vegan",
    title: "نباتي",
    description: "وصفات غنية بالخضار",
    icon: UtensilsCrossed,
    bgImage:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "breakfast",
    title: "فطور",
    description: "لبداية يوم مثالية",
    icon: Coffee,
    bgImage:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "bakery",
    title: "مخبوزات",
    description: "طازجة من الفرن",
    icon: Croissant,
    bgImage:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
  },
];

export default function Specialties() {
  // مصفوفة لتخزين معرفات التخصصات المختارة (معرف افتراضي "تقليدي")
  const [selectedIds, setSelectedIds] = useState<string[]>(["traditional"]);

  const toggleSpecialty = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FFF8F6] p-4 md:p-10 font-sans text-gray-800 flex flex-col justify-between"
    >
      <div className="max-w-6xl mx-auto w-full space-y-8 pb-24">
        {/* Header Section */}
        <div className="text-right space-y-2">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">
            تفضيلاتك المطبخية
          </h1>
          <p className="text-sm md:text-base text-gray-500">
            اختر النكهات والأطباق التي تحبها لنتمكن من تخصيص تجربتك واقتراح أفضل
            الطهاة لك.
          </p>
        </div>

        {/* Grid Options (2 Rows, 4 Cols in Large Screens) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {specialtiesData.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => toggleSpecialty(item.id)}
                className={`relative rounded-2xl overflow-hidden h-44 cursor-pointer transition-all duration-200 border-2 select-none group ${
                  isSelected
                    ? "border-[#B34510] shadow-md ring-2 ring-[#B34510]/10"
                    : "border-rose-100/60 hover:border-rose-200 shadow-sm"
                }`}
              >
                {/* Background Image with Light Overlay */}
                <img
                  src={item.bgImage}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay layer to soften background like the image */}
                <div
                  className={`absolute inset-0 transition-colors ${
                    isSelected ? "bg-white/85" : "bg-white/90 hover:bg-white/85"
                  }`}
                />

                {/* Checkmark Badge for Selected Item */}
                {isSelected && (
                  <div className="absolute top-3 left-3 bg-[#B34510] text-white p-1 rounded-full shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Card Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 text-center space-y-2">
                  <div className="p-2.5 rounded-full text-[#B34510]">
                    <Icon className="w-7 h-7 stroke-[1.8]" />
                  </div>

                  <h3 className="text-xl font-black text-gray-900">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-500 font-medium max-w-[180px]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-6 right-0 left-0 px-4">
        <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl border border-rose-100/80 p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Selected Count Text */}
          <div className="text-sm font-bold text-gray-700">
            تم اختيار{" "}
            <span className="text-[#B34510] font-black text-base">
              {selectedIds.length}
            </span>{" "}
            تفضيلات
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold px-6 py-2.5 rounded-full text-xs transition-colors">
              تخطي الآن
            </button>

            <button className="flex-1 sm:flex-none bg-[#B34510] hover:bg-[#A03E0F] text-white font-bold px-7 py-2.5 rounded-full text-xs flex items-center justify-center gap-2 transition-colors shadow-sm">
              <span>حفظ التفضيلات</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
