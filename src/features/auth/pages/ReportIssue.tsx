import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AlertCircle, Send, CheckCircle2 } from "lucide-react";

interface ReportFormValues {
  subject: string;
  orderNumber: string;
  description: string;
}

const validationSchema = Yup.object({
  subject: Yup.string().required("عنوان المشكلة مطلوب"),
  orderNumber: Yup.string(),
  description: Yup.string()
    .min(10, "الوصف يجب أن يكون 10 أحرف على الأقل")
    .required("وصف المشكلة مطلوب"),
});

// ملحوظة: الـ backend حالياً معندوش endpoint لاستقبال بلاغات المشاكل، فمفيش
// طريقة نبعت بيها البلاغ فعليًا لحد ما يتضاف. عشان كده مش بنقول للمستخدم
// "اتبعت" — بنسجّله محليًا ونوجّهه لإيميل الدعم بدل ما نديله انطباع كاذب.
export default function ReportIssue() {
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik<ReportFormValues>({
    initialValues: {
      subject: "",
      orderNumber: "",
      description: "",
    },
    validationSchema,
    onSubmit: () => {
      setSubmitted(true);
    },
  });

  if (submitted) {
    const mailBody = encodeURIComponent(
      `الموضوع: ${formik.values.subject}\nرقم الطلب: ${formik.values.orderNumber || "—"}\n\n${formik.values.description}`
    );
    return (
      <div dir="rtl" className="max-w-2xl mx-auto p-6 text-right">
        <div className="bg-white p-8 rounded-lg border shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7 text-amber-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">سجّلنا تفاصيل بلاغك</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            نظام استقبال البلاغات الآلي لسه مش متاح، فبلاغك محفوظ عندك بس في المتصفح ده حاليًا.
            عشان نضمن وصوله لفريق الدعم، ابعتيه على إيميلنا مباشرة:
          </p>
          <a
            href={`mailto:support@chefnear.com?subject=${encodeURIComponent(
              formik.values.subject
            )}&body=${mailBody}`}
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-md text-sm transition-colors"
          >
            فتح إيميل لفريق الدعم
          </a>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-2xl mx-auto p-6 text-right">
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <AlertCircle className="w-7 h-7 text-red-500" /> الإبلاغ عن مشكلة
      </h1>
      <p className="text-gray-600 mb-6">
        يسعدنا مساعدتك في حل أي مشكلة واجهتك أثناء استخدام التطبيق.
      </p>

      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg border shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            موضوع المشكلة *
          </label>
          <input
            type="text"
            name="subject"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.subject}
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="مثال: تأخر الطلب / خطأ في الحساب"
          />
          {formik.touched.subject && formik.errors.subject && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.subject}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            رقم الطلب (اختياري)
          </label>
          <input
            type="text"
            name="orderNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.orderNumber}
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="#12345"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تفاصيل المشكلة *
          </label>
          <textarea
            rows={4}
            name="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="اشرح المشكلة بالتفصيل..."
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.description}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition"
        >
          <Send className="w-4 h-4" /> إرسال البلاغ
        </button>
      </form>
    </div>
  );
}
