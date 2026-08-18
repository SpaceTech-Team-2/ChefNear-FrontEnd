import React, { useState } from "react";
import {
  HelpCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "كيف يمكنني تتبع طلبي؟",
    answer:
      'يمكنك تتبع طلبك لحظة بلحظة من خلال الانتقال إلى صفحة "طلباتي" ثم الضغط على "تتبع الطلب".',
  },
  {
    question: "ما هي طرق الدفع المتاحة؟",
    answer:
      "نوفر الدفع النقدي عند الاستلام، بالإضافة إلى البطاقات الائتمانية والمحافظ الإلكترونية.",
  },
  {
    question: "كيف يمكنني إلغاء الطلب؟",
    answer:
      "يمكنك إلغاء الطلب من صفحة تفاصيل الطلب طالما لم يبدأ الشيف في تحضيره بعد.",
  },
];

export default function HelpCenter()  {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 dir-rtl text-right">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <HelpCircle className="w-8 h-8 text-orange-500" /> مركز المساعدة
      </h1>
      <p className="text-gray-600 mb-8">كيف يمكننا مساعدتك اليوم؟</p>

      {/* FAQs Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">الأسئلة الشائعة</h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-right font-medium text-lg text-gray-800"
              >
                <span>{faq.question}</span>
                {openIndex === index ? <ChevronUp /> : <ChevronDown />}
              </button>
              {openIndex === index && (
                <p className="mt-3 text-gray-600 text-sm leading-relaxed border-t pt-3">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Contact Options */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border p-4 rounded-lg bg-orange-50 border-orange-200 flex items-center gap-4">
          <Mail className="w-8 h-8 text-orange-600" />
          <div>
            <h3 className="font-semibold text-gray-800">تواصل عبر البريد</h3>
            <p className="text-sm text-gray-600">support@chefnear.com</p>
          </div>
        </div>
        <Link
          to="/report-issue"
          className="border p-4 rounded-lg bg-gray-50 border-gray-200 flex items-center gap-4 hover:bg-gray-100 transition"
        >
          <MessageSquare className="w-8 h-8 text-gray-700" />
          <div>
            <h3 className="font-semibold text-gray-800">الإبلاغ عن مشكلة</h3>
            <p className="text-sm text-gray-600">
              أرسل لنا تفاصيل المشكلة مباشرة
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};
