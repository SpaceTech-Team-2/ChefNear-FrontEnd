import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowRight, MapPin, Plus, Star, Loader2, Pencil, Trash2 } from "lucide-react";
import {
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../services/api";

interface Address {
  id: string;
  label?: string;
  city?: string;
  details?: string;
  isDefault?: boolean;
}

interface ApiEnvelope<T> {
  data: T;
}

export default function AddressesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ label: "", city: "", details: "" });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<ApiEnvelope<Address[]>>({
    queryKey: ["my-addresses"],
    queryFn: getMyAddresses,
  });

  const addresses = data?.data ?? [];

  const resetForm = () => {
    setForm({ label: "", city: "", details: "" });
    setShowForm(false);
    setEditingId(null);
  };

  const createMutation = useMutation({
    mutationFn: () =>
      createAddress({
        label: form.label || "عنوان جديد",
        city: form.city,
        details: form.details,
        latitude: 0,
        longitude: 0,
        isDefault: addresses.length === 0,
      }),
    onSuccess: () => {
      resetForm();
      refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateAddress(editingId as string, {
        label: form.label || "عنوان",
        city: form.city,
        details: form.details,
        latitude: 0,
        longitude: 0,
      }),
    onSuccess: () => {
      resetForm();
      refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (addressId: string) => deleteAddress(addressId),
    onMutate: (addressId) => setDeletingId(addressId),
    onSettled: () => setDeletingId(null),
    onSuccess: () => refetch(),
  });

  const startEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({ label: addr.label || "", city: addr.city || "", details: addr.details || "" });
    setShowForm(true);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF9F6] p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="p-2 bg-white border border-rose-100 rounded-full text-[#A03E0F] hover:bg-rose-50 transition-colors shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">عناويني</h1>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-rose-100/80 shadow-sm p-4 h-20 animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-4">
            تعذر تحميل عناوينك. تأكد إنك مسجل دخول وحاول تاني.
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-3">
            {addresses.length === 0 && !showForm && (
              <div className="bg-white rounded-3xl border border-dashed border-rose-200 p-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6 text-[#B34510]" />
                </div>
                <p className="text-sm text-gray-500">لسه مفيش عناوين مضافة</p>
              </div>
            )}

            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white rounded-2xl border border-rose-100/80 shadow-sm p-4 flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-sm">{addr.label || "عنوان"}</h3>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        افتراضي
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {addr.city} {addr.details ? `— ${addr.details}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(addr)}
                    className="p-2 text-gray-400 hover:text-[#B34510] hover:bg-rose-50 rounded-full transition-colors"
                    aria-label="تعديل العنوان"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(addr.id)}
                    disabled={deletingId === addr.id}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                    aria-label="حذف العنوان"
                  >
                    {deletingId === addr.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm ? (
          <div className="bg-white rounded-3xl border border-rose-100/80 shadow-sm p-5 space-y-3">
            <h2 className="font-bold text-gray-900 text-sm">
              {editingId ? "تعديل العنوان" : "إضافة عنوان جديد"}
            </h2>
            <input
              placeholder="اسم العنوان (المنزل، العمل...)"
              value={form.label}
              onChange={(e) => setForm((s) => ({ ...s, label: e.target.value }))}
              className="w-full text-sm border border-[#EACEC5] bg-[#FFF8F6] rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#B34510]/40"
            />
            <input
              placeholder="المدينة"
              value={form.city}
              onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
              className="w-full text-sm border border-[#EACEC5] bg-[#FFF8F6] rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#B34510]/40"
            />
            <input
              placeholder="تفاصيل العنوان (الشارع، رقم الدور...)"
              value={form.details}
              onChange={(e) => setForm((s) => ({ ...s, details: e.target.value }))}
              className="w-full text-sm border border-[#EACEC5] bg-[#FFF8F6] rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#B34510]/40"
            />
            <div className="flex gap-2 pt-1">
              <button
                onClick={resetForm}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#FFEAE3] text-[#A03E0F]"
              >
                إلغاء
              </button>
              <button
                onClick={() =>
                  editingId ? updateMutation.mutate() : createMutation.mutate()
                }
                disabled={createMutation.isPending || updateMutation.isPending || !form.city}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-[#B34510] hover:bg-[#A03E0F] text-white disabled:opacity-60"
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                <span>حفظ العنوان</span>
              </button>
            </div>
            {(createMutation.isError || updateMutation.isError) && (
              <p className="text-xs text-red-600 text-center">تعذر حفظ العنوان، حاول تاني.</p>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-rose-200 text-[#A03E0F] font-bold py-3.5 rounded-2xl hover:bg-rose-50/60 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عنوان جديد</span>
          </button>
        )}
      </div>
    </div>
  );
}
