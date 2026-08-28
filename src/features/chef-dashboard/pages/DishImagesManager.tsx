import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Trash2, Upload, Loader2 } from "lucide-react";
import {
  getDishImages,
  uploadDishImage,
  setPrimaryDishImage,
  deleteDishImage,
} from "../../../services/api";

interface DishImage {
  id: string;
  url?: string;
  imageUrl?: string;
  isPrimary?: boolean;
}

export default function DishImagesManager({ dishId }: { dishId: string }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["dish-images", dishId],
    queryFn: () => getDishImages(dishId),
  });
  const images: DishImage[] = data?.data ?? [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["dish-images", dishId] });

  const uploadMutation = useMutation({
    mutationFn: (file: File) =>
      uploadDishImage({ dishId, file, isPrimary: images.length === 0 }),
    onSuccess: invalidate,
    onError: (err: any) =>
      setUploadError(err?.response?.data?.message || "تعذر رفع الصورة، حاول تاني."),
  });

  const primaryMutation = useMutation({
    mutationFn: (imageId: string) => setPrimaryDishImage(imageId),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (imageId: string) => deleteDishImage(imageId),
    onSuccess: invalidate,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-2.5">
      <label className="text-xs font-bold text-gray-600">صور الطبق</label>

      {isLoading && (
        <div className="flex gap-2">
          {[1, 2].map((i) => (
            <div key={i} className="w-20 h-20 bg-rose-50 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-wrap gap-2.5">
          {images.map((img) => (
            <div key={img.id} className="relative w-20 h-20 rounded-xl overflow-hidden border border-rose-100 group">
              <img
                src={img.url ?? img.imageUrl}
                alt="صورة الطبق"
                className="w-full h-full object-cover"
              />
              {img.isPrimary && (
                <span className="absolute top-1 right-1 bg-amber-400 text-white rounded-full p-0.5">
                  <Star className="w-3 h-3 fill-current" />
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => primaryMutation.mutate(img.id)}
                    title="اجعلها الصورة الرئيسية"
                    className="p-1.5 bg-white/90 rounded-full text-amber-600"
                  >
                    <Star className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(img.id)}
                  title="حذف"
                  className="p-1.5 bg-white/90 rounded-full text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-rose-200 flex items-center justify-center text-gray-400 hover:text-[#B34510] hover:border-[#B34510] transition-colors disabled:opacity-50"
          >
            {uploadMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
    </div>
  );
}
