import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Star, MessageSquarePlus, User } from "lucide-react";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

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
    comment: "الطعم جبار والتغليف ممتاز، محتاج بس زيادة التوابل شيك.",
    date: "2026-02-08",
  },
];

export const Reviews: React.FC = () => {
  const [reviewsList, setReviewsList] = useState<Review[]>(mockReviews);

  const formik = useFormik({
    initialValues: {
      rating: 5,
      comment: "",
    },
    validationSchema: Yup.object({
      rating: Yup.number().min(1, "الرجاء اختيار تقييم").required(),
      comment: Yup.string()
        .min(5, "التعليق يجب أن يكون 5 أحرف على الأقل")
        .required("التعليق مطلوب"),
    }),
    onSubmit: (values, { resetForm }) => {
      const newReview: Review = {
        id: Date.now().toString(),
        userName: "أنت (مستخدم)",
        rating: Number(values.rating),
        comment: values.comment,
        date: new Date().toISOString().split("T")[0],
      };
      setReviewsList([newReview, ...reviewsList]);
      resetForm();
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-6 text-right">
      {/* Reviews List */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg border-b pb-2">
          التقييمات السابقة
        </h2>
        {reviewsList.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-4 rounded-lg border shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-2 rounded-full">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="font-medium text-sm">{rev.userName}</span>
              </div>
              <span className="text-xs text-gray-400">{rev.date}</span>
            </div>
            <div className="flex text-yellow-400 mb-2">
              {[...Array(rev.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-gray-700 text-sm">{rev.comment}</p>
          </div>
        ))}
      </div>
      <hr className=" m-7"/>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Star className="w-7 h-7 text-yellow-500 fill-current" /> كتابة وتقييم
        الأطباق
      </h1>

      {/* Add Review Form */}
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-6 rounded-lg border shadow-sm mb-8 space-y-4"
      >
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <MessageSquarePlus className="w-5 h-5 text-orange-500" /> إضافة تقييم
          جديد
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            التقييم بالنجوم
          </label>
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
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تعليقك *
          </label>
          <textarea
            rows={3}
            name="comment"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.comment}
            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="اكتب انطباعك عن جودة الطعام والتوصيل..."
          />
          {formik.touched.comment && formik.errors.comment && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.comment}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md text-sm transition"
        >
          نشر التقييم
        </button>
      </form>
    </div>
  );
};
