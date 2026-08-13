import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, X, Upload } from "lucide-react";
import {getCategories} from "../../../services/api";

interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    title: "مندي لحم",
    description:
      "أرز مندي تقليدي مع لحم الغنم الطازج المطهو ببطء، يقدم مع صلصة الفلفل الحار.",
    price: 85,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    category: "الأطباق الرئيسية",
    isAvailable: true,
  },
  {
    id: 2,
    title: "كنافة نابلسية",
    description: "كنافة بالجبن النابلسي تقدم ساخنة مع القطر والفستق الحلبي.",
    price: 35,
    image:
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80",
    category: "الحلويات",
    isAvailable: false,
  },
];
const response = await getCategories();

const categories = [{ name: "الكل" }, ...response.data];

export default function MenuManagement() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  // حالة التحكم في الـ Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // حالة تحديد ما إذا كنا في وضع التعديل (يحمل ID الطبق) أم الإضافة (null)
  const [editingDishId, setEditingDishId] = useState<number | null>(null);

  // حالة نموذج الإضافة / التعديل
  const [dishForm, setDishForm] = useState({
    chefId: "",
    title: "",
    description: "",
    price: "",
    category: "أطباق رئيسية",
    image: "",
  });

  // فتح Modal للإضافة
  const handleOpenAddModal = () => {
    setEditingDishId(null);
    setDishForm({
      chefId: localStorage.getItem("token") || "",
      title: "",
      description: "",
      price: "",
      category: "أطباق رئيسية",
      image: "",
    });
    setIsModalOpen(true);
  };

  // فتح Modal للتعديل بتعبئة بيانات الطبق المحدد
  const handleOpenEditModal = (item: MenuItem) => {
    setEditingDishId(item.id);
    setDishForm({
      chefId: localStorage.getItem("token") || "",
      title: item.title,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
    });
    setIsModalOpen(true);
  };

  const toggleAvailability = (id: number) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const handleDelete = (id: number) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  // حفظ التغيرات (سواء إضافة جديد أو تعديل طبق قائم)
  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishForm.title || !dishForm.price) return;

    if (editingDishId !== null) {
      // تعديل طبق موصوف سابقاً
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingDishId
            ? {
                ...item,
                title: dishForm.title,
                description: dishForm.description || "لا يوجد وصف متاح.",
                price: Number(dishForm.price),
                category: dishForm.category,
                image:
                  dishForm.image ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
              }
            : item
        )
      );
    } else {
      // إضافة طبق جديد
      const newDish: MenuItem = {
        id: Date.now(),
        title: dishForm.title,
        description: dishForm.description || "لا يوجد وصف متاح.",
        price: Number(dishForm.price),
        category: dishForm.category,
        image:
          dishForm.image ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
        isAvailable: true,
      };
      setMenuItems([newDish, ...menuItems]);
    }

    setIsModalOpen(false);
  };

  const filteredItems = menuItems.filter((item) => {

    
    const matchesCategory =
      selectedCategory === "الكل" || item.category === selectedCategory;
      
    const matchesSearch =
      item.title.includes(searchQuery) ||
      item.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
    
  });

  return (
    <div dir="rtl" className="space-y-8 font-sans pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">إدارة القائمة</h1>
          <p className="text-sm text-gray-500 mt-1">
            قم بإدارة أطباقك، وأسعارك، وتوافرها.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-[#B34510] hover:bg-[#A03E0F] text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة طبق جديد</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.name
                  ? "bg-[#B34510] text-white shadow-sm"
                  : "bg-amber-100/60 text-amber-900 hover:bg-amber-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن طبق..."
            className="w-full bg-[#FFF8F6] border border-rose-100/80 rounded-xl py-2.5 pr-10 pl-4 text-sm outline-none text-gray-800 placeholder:text-gray-400 focus:border-[#B34510] transition-colors"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Placeholder Add Card */}
        <button
          onClick={handleOpenAddModal}
          className="bg-rose-50/30 border-2 border-dashed border-rose-200/80 rounded-2xl min-h-[360px] flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-[#B34510] hover:border-[#B34510] hover:bg-rose-50/60 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-gray-600 group-hover:text-[#B34510]" />
          </div>
          <span className="text-sm font-bold text-gray-600 group-hover:text-[#B34510]">
            إضافة طبق جديد
          </span>
        </button>

        {/* Dish Items */}
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-rose-100/60 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="relative h-44 w-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`absolute top-3 right-3 w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                    item.isAvailable ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      item.isAvailable ? "-translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-base">
                    {item.title}
                  </h3>
                  <div className="text-amber-900 font-extrabold text-sm">
                    {item.price}{" "}
                    <span className="text-xs font-normal">درهم</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Actions Card Footer */}
            <div className="p-4 pt-0 flex items-center gap-2">
              <button
                onClick={() => handleOpenEditModal(item)}
                className="flex-1 bg-rose-50/80 hover:bg-rose-100/80 text-gray-700 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                <span>تعديل</span>
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-rose-50/80 hover:bg-rose-100 text-rose-600 p-2 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup (إضافة / تعديل) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-rose-100 space-y-6 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingDishId !== null
                  ? "تعديل بيانات الطبق"
                  : "إضافة طبق جديد"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveDish} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">
                  اسم الطبق *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كبسة دجاج"
                  value={dishForm.title}
                  onChange={(e) =>
                    setDishForm({ ...dishForm, title: e.target.value })
                  }
                  className="w-full bg-[#FFF8F6] border border-rose-100 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#B34510] text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">
                    السعر (درهم) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={dishForm.price}
                    onChange={(e) =>
                      setDishForm({ ...dishForm, price: e.target.value })
                    }
                    className="w-full bg-[#FFF8F6] border border-rose-100 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#B34510] text-gray-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">
                    التصنيف *
                  </label>
                  <select
                    value={dishForm.category}
                    onChange={(e) =>
                      setDishForm({ ...dishForm, category: e.target.value })
                    }
                    className="w-full bg-[#FFF8F6] border border-rose-100 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#B34510] text-gray-800"
                  >
                    {categories.slice(1).map((categorie) => (
                      <option key={categorie.id} value={categorie.name}>
                        {categorie.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">
                  وصف الطبق
                </label>
                <textarea
                  rows={3}
                  placeholder="اكتب وصفاً قصيراً ومكونات الطبق..."
                  value={dishForm.description}
                  onChange={(e) =>
                    setDishForm({ ...dishForm, description: e.target.value })
                  }
                  className="w-full bg-[#FFF8F6] border border-rose-100 rounded-xl p-3 text-sm outline-none focus:border-[#B34510] text-gray-800 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">
                  رابط صورة الطبق (URL)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={dishForm.image}
                    onChange={(e) =>
                      setDishForm({ ...dishForm, image: e.target.value })
                    }
                    className="w-full bg-[#FFF8F6] border border-rose-100 rounded-xl py-2.5 pr-4 pl-10 text-sm outline-none focus:border-[#B34510] text-gray-800 dir-ltr"
                  />
                  <Upload className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[#B34510] hover:bg-[#A03E0F] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  {editingDishId !== null ? "تحديث الطبق" : "حفظ الطبق"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
