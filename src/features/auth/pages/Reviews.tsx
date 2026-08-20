import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowRight, Star, MessageSquarePlus, User } from "lucide-react";
import { getDishesID } from "../../../services/api";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// الـ backend حالياً معندوش endpoint لجلب/إضافة تقييمات الأطباق (مفيش GET/POST
// موثّق في الـ swagger لحد دلوقتي)، فبنعرض تقييمات تجريبية ونضيف تقييم المستخدم
// محليًا لحد ما الـ endpoint يبقى جاهز.
const mockReviews: Review[] = [
  {
    id: "1",
    userName: "أحمد محمود",
    rating: 5,
    comment: "الأكل ممتاز جداً ووصل ساخن في الميعاد.",
    date: "2026-02-10",
  },
  {
    id: "2",
    userName: "سارة علي",
    rating: 4,
    comment: "الطعم جبار والتغليف ممتاز، محتاج بس زيادة التوابل شوية.",
    date: "2026-02-08",
  },
];

export default function ReviewsPage() {
  const { id } = useParams();
  const [dishName, setDishName] = useState<string>("");
  const [reviewsList, setReviewsList] = useState<Review[]>(mockReviews);

  useEffect(() => {
    if (!id) return;
    getDishesID(id)
      .then((res) => setDishName(res?.data?.name || ""))
      .catch(() => setDishName(""));
  }, [id]);

  const avgRating =
    reviewsList.reduce((sum, r) => sum + r.rating, 0) / (reviewsList.length || 1);

  const formik = useFormik({
    initialValues: { rating: 5, comment: "" },
    validationSchema: Yup.object({
      rating: Yup.number().min(1, "الرجاء اختيار تقييم").required(),
      comment: Yup.string()
        .min(5, "التعليق يجب أن يكون 5 أحرف على الأقل")
        .required("التعليق مطلوب"),
    }),
    onSubmit: (values, { resetForm }) => {
      const newReview: Review = {
        id: Date.now().toString(),
        userName: "أنت",
        rating: Number(values.rating),
        comment: values.comment,
        date: new Date().toISOString().split("T")[0],
      };
      setReviewsList([newReview, ...reviewsList]);
      resetForm();
    },
  });

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF9F6] p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            to={id ? `/DishDetailsModal/${id}` : "/"}
            className="p-2 bg-white border border-rose-100 rounded-full text-[#A03E0F] hover:bg-rose-50 transition-colors shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">التقييمات</h1>
            {dishName && <p className="text-sm text-gray-500">{dishName}</p>}
          </div>
        </div>

        {/* ملخص التقييم */}
        <div className="bg-white rounded-3xl border border-rose-100/80 shadow-sm p-6 flex items-center gap-5">
          <div className="text-center">
            <div className="text-3xl font-black text-[#B34510]">{avgRating.toFixed(1)}</div>
            <div className="flex text-amber-400 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(avgRating) ? "fill-current" : "text-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-500 border-r border-gray-100 pr-5">
            بناءً على {reviewsList.length} تقييم
          </div>
        </div>

        {/* التقييمات السابقة */}
        <div className="space-y-3">
          <h2 className="font-black text-gray-900">التقييمات السابقة</h2>
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-4 rounded-2xl border border-rose-100/80 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <User className="w-4 h-4 text-amber-800" />
                  </div>
                  <span className="font-bold text-sm text-gray-900">{rev.userName}</span>
                </div>
                <span className="text-xs text-gray-400">{rev.date}</span>
              </div>
              <div className="flex text-amber-400 mb-2">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>

        {/* إضافة تقييم */}
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white p-6 rounded-3xl border border-rose-100/80 shadow-sm space-y-4"
        >
          <h2 className="font-black text-gray-900 flex items-center gap-2">
            <MessageSquarePlus className="w-4.5 h-4.5 text-[#B34510]" />
            إضافة تقييم جديد
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">التقييم بالنجوم</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => formik.setFieldValue("rating", star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= formik.values.rating
                        ? "text-amber-400 fill-current"
                        : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">تعليقك</label>
            <textarea
              rows={3}
              name="comment"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.comment}
              className="w-full bg-[#FFF8F6] border border-[#EACEC5] rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#B34510]/40 transition-colors"
              placeholder="اكتب انطباعك عن جودة الطعام والتوصيل..."
            />
            {formik.touched.comment && formik.errors.comment && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.comment}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#B34510] hover:bg-[#A03E0F] text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors"
          >
            نشر التقييم
          </button>
        </form>
      </div>
    </div>
  );
}
