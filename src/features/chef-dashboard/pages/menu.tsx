import { useState } from "react";
import { Plus, Search, Edit2, Trash2, X, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getChefDishes,
  getMyProfile,
  createDish,
  updateDish,
  deleteDish,
  type DishStatus,
} from "../../../services/api";
import DishImagesManager from "./DishImagesManager";
import DishIngredientsManager from "./DishIngredientsManager";

interface Dish {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  category?: string;
  quantityAvailable?: number;
  status?: DishStatus;
  primaryImageUrl?: string;
  chefId?: string;
  chef?: { id?: string };
}

export default function MenuManagement() {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [dishForm, setDishForm] = useState({
    name: "",
    description: "",
    price: "",
    quantityAvailable: "10",
    categoryId: "",
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const categories = categoriesRes?.data ?? [];

  const { data: profileRes } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });
  const myChefId = profileRes?.data?.id;

  // GET /Chef/{chefId}/Dishes: endpoint مخصص لأطباق الشيف بس (اتضاف حديثًا
  // في الـ backend — كان قبل كده بيتعمل جلب 100 طبق وفلترة محلية).
  const {
    data: dishesRes,
    isLoading: dishesLoading,
    isError: dishesError,
  } = useQuery({
    queryKey: ["chef-dishes", myChefId],
    queryFn: () => getChefDishes(myChefId as string),
    enabled: Boolean(myChefId),
  });

  const menuItems: Dish[] = dishesRes?.data ?? [];

  const invalidateDishes = () =>
    queryClient.invalidateQueries({ queryKey: ["chef-dishes", myChefId] });

  const [formError, setFormError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () =>
      createDish({
        categoryId: dishForm.categoryId,
        name: dishForm.name,
        description: dishForm.description,
        price: Number(dishForm.price),
        quantityAvailable: Number(dishForm.quantityAvailable) || 0,
      }),
    onSuccess: () => {
      setIsModalOpen(false);
      invalidateDishes();
    },
    onError: (err: any) =>
      setFormError(err?.response?.data?.message || "تعذر حفظ الطبق، حاول تاني."),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateDish(editingDishId as string, {
        categoryId: dishForm.categoryId,
        name: dishForm.name,
        description: dishForm.description,
        price: Number(dishForm.price),
        quantityAvailable: Number(dishForm.quantityAvailable) || 0,
        status: "Available",
      }),
    onSuccess: () => {
      setIsModalOpen(false);
      invalidateDishes();
    },
    onError: (err: any) =>
      setFormError(err?.response?.data?.message || "تعذر تحديث الطبق، حاول تاني."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDish(id),
    onSuccess: () => invalidateDishes(),
  });

  const handleOpenAddModal = () => {
    setFormError(null);
    setEditingDishId(null);
    setDishForm({
      name: "",
      description: "",
      price: "",
      quantityAvailable: "10",
      categoryId: categories[0]?.id ?? "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Dish) => {
    setFormError(null);
    setEditingDishId(item.id);
    setDishForm({
      name: item.name,
      description: item.description ?? "",
      price: String(item.price),
      quantityAvailable: String(item.quantityAvailable ?? 10),
      categoryId: item.categoryId ?? categories[0]?.id ?? "",
    });
    setIsModalOpen(true);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!dishForm.name || !dishForm.price || !dishForm.categoryId) {
      setFormError("من فضلك املأ اسم الطبق والسعر والتصنيف.");
      return;
    }
    if (editingDishId !== null) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const categoryName =
      categories.find((c: any) => c.id === item.categoryId)?.name ?? item.category;
    const matchesCategory = selectedCategory === "الكل" || categoryName === selectedCategory;
    const matchesSearch =
      item.name?.includes(searchQuery) || item.description?.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div dir="rtl" className="space-y-8 font-sans pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">إدارة القائمة</h1>
          <p className="text-sm text-gray-500 mt-1">قم بإدارة أطباقك، وأسعارك، وتوافرها.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-[#B34510] hover:bg-[#A03E0F] text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة طبق جديد</span>
        </button>
      </div>

      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("الكل")}
            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === "الكل"
                ? "bg-[#B34510] text-white shadow-sm"
                : "bg-amber-100/60 text-amber-900 hover:bg-amber-100"
            }`}
          >
            الكل
          </button>
          {categories.map((cat: any) => (
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

      {dishesLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[360px] bg-white border border-rose-100/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {dishesError && (
        <div className="text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-6">
          تعذر تحميل قائمة الأطباق. تأكد إنك مسجل دخول كشيف وحاول تاني.
        </div>
      )}

      {!dishesLoading && !dishesError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-rose-100/60 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative h-44 w-full bg-rose-50">
                  {item.primaryImageUrl && (
                    <img
                      src={item.primaryImageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {item.status && (
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        item.status === "Available"
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {item.status === "Available" ? "متاح" : "غير متاح"}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                    <div className="text-amber-900 font-extrabold text-sm">
                      {item.price} <span className="text-xs font-normal">ج.م</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="flex-1 bg-rose-50/80 hover:bg-rose-100/80 text-gray-700 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                  <span>تعديل</span>
                </button>
                <button
                  onClick={() => deleteMutation.mutate(item.id)}
                  disabled={deleteMutation.isPending}
                  className="bg-rose-50/80 hover:bg-rose-100 text-rose-600 p-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-rose-100 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingDishId !== null ? "تعديل بيانات الطبق" : "إضافة طبق جديد"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="space-y-4">
              {formError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                  {formError}
                </p>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">اسم الطبق *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كبسة دجاج"
                  value={dishForm.name}
                  onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                  className="w-full bg-[#FFF8F6] border border-rose-100 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#B34510] text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">السعر (ج.م) *</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={dishForm.price}
                    onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                    className="w-full bg-[#FFF8F6] border border-rose-100 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#B34510] text-gray-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">التصنيف *</label>
                  <select
                    value={dishForm.categoryId}
                    onChange={(e) => setDishForm({ ...dishForm, categoryId: e.target.value })}
                    className="w-full bg-[#FFF8F6] border border-rose-100 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#B34510] text-gray-800"
                  >
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">الكمية المتاحة</label>
                <input
                  type="number"
                  value={dishForm.quantityAvailable}
                  onChange={(e) =>
                    setDishForm({ ...dishForm, quantityAvailable: e.target.value })
                  }
                  className="w-full bg-[#FFF8F6] border border-rose-100 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#B34510] text-gray-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">وصف الطبق</label>
                <textarea
                  rows={3}
                  placeholder="اكتب وصفاً قصيراً ومكونات الطبق..."
                  value={dishForm.description}
                  onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                  className="w-full bg-[#FFF8F6] border border-rose-100 rounded-xl p-3 text-sm outline-none focus:border-[#B34510] text-gray-800 resize-none"
                />
              </div>

              {editingDishId !== null ? (
                <div className="space-y-4 border-t border-gray-100 pt-4">
                  <DishImagesManager dishId={editingDishId} />
                  <DishIngredientsManager dishId={editingDishId} />
                </div>
              ) : (
                <p className="text-[11px] text-gray-400 bg-gray-50 rounded-lg p-2.5 text-center">
                  احفظي الطبق الأول، وبعدين تقدري تضيفي صور ومكوّنات من "تعديل".
                </p>
              )}

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
                  disabled={isSaving}
                  className="bg-[#B34510] hover:bg-[#A03E0F] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-60 flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingDishId !== null ? "تحديث الطبق" : "حفظ الطبق"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
