import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Trash2, MessageSquare } from "lucide-react";
import { getAdminReviews, deleteAdminReview } from "../../../../services/api";

interface Review {
  id: string;
  comment: string;
  rating: number;
  userName?: string;
  clientName?: string;
  dishName?: string;
  createdAt?: string;
}

export const AdminReviewsView: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () => getAdminReviews({ pageSize: 50 }),
  });
  const reviews: Review[] = data?.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminReview(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-orange-500" /> إدارة التقييمات
      </h2>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white border rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-6">
          تعذر تحميل التقييمات.
        </div>
      )}

      {!isLoading && !isError && reviews.length === 0 && (
        <div className="text-center text-sm text-gray-500 bg-white border border-dashed rounded-xl p-10">
          مفيش تقييمات لمراجعتها حاليًا.
        </div>
      )}

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white p-4 rounded-xl border shadow-sm flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 text-sm">
                  {r.userName ?? r.clientName ?? "عميل"}
                </span>
                {r.dishName && (
                  <span className="text-xs text-gray-400">على {r.dishName}</span>
                )}
              </div>
              <div className="flex text-amber-400">
                {[...Array(r.rating ?? 0)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-sm text-gray-600">{r.comment}</p>
            </div>
            <button
              onClick={() => deleteMutation.mutate(r.id)}
              disabled={deleteMutation.isPending}
              title="حذف التقييم"
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
