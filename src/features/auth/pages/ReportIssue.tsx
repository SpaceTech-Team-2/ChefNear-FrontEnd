import { useFormik } from "formik";
import * as Yup from "yup";
import { AlertCircle, Send } from "lucide-react";

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

export default function ReportIssue () {
  const formik = useFormik<ReportFormValues>({
    initialValues: {
      subject: "",
      orderNumber: "",
      description: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log("Report Data:", values);
      alert("تم إرسال بلاغك بنجاح، وسنتواصل معك قريباً!");
      resetForm();
    },
  });

  return (
    <div className="max-w-2xl mx-auto p-6 text-right">
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
};
