import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Dispute {
  id: string;
  orderId: string;
  customerName: string;
  chefName: string;
  reason: string;
  status: "pending" | "resolved" | "rejected";
  date: string;
  details: string;
}

const mockDisputes: Dispute[] = [
  {
    id: "1",
    orderId: "#1082",
    customerName: "أحمد محمود",
    chefName: "مطعم الشيف طارق",
    reason: "تأخر التوصيل لأكثر من ساعة والأكل وصل بارد",
    status: "pending",
    date: "2026-08-18",
    details:
      "العميل يطالب باسترداد المبلغ كاملاً بسبب التأخير الشديد وعدم صلاحية الوجبة للاستهلاك.",
  },
  {
    id: "2",
    orderId: "#1075",
    customerName: "سارة علي",
    chefName: "مطبخ البيتي",
    reason: "صنف مفقود من الطلب",
    status: "resolved",
    date: "2026-08-17",
    details: "تم تعويض العميل بقيمة الصنف المفقود كصيدلي/رصيد في المحفظة.",
  },
];

export const AdminDisputesView: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  const handleStatusChange = (
    id: string,
    newStatus: "resolved" | "rejected"
  ) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
    if (selectedDispute?.id === id) {
      setSelectedDispute((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
    }
  };

  return (
    <div className="space-y-6 text-right dir-rtl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-500" /> إدارة الشكاوى
          والنزاعات
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disputes List */}
        <div className="lg:col-span-1 space-y-3">
          {disputes.map((dispute) => (
            <div
              key={dispute.id}
              onClick={() => setSelectedDispute(dispute)}
              className={`p-4 rounded-xl border cursor-pointer transition bg-white shadow-sm hover:border-orange-500 ${
                selectedDispute?.id === dispute.id
                  ? "border-orange-500 ring-1 ring-orange-500"
                  : ""
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800">
                  {dispute.orderId}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    dispute.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : dispute.status === "resolved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {dispute.status === "pending"
                    ? "قيد الانتظار"
                    : dispute.status === "resolved"
                    ? "تم الحل"
                    : "مرفوض"}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-700 line-clamp-1">
                {dispute.reason}
              </p>
              <p className="text-xs text-gray-400 mt-2">{dispute.date}</p>
            </div>
          ))}
        </div>

        {/* Dispute Details View */}
        <div className="lg:col-span-2">
          {selectedDispute ? (
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  تفاصيل الشكوى للطلب {selectedDispute.orderId}
                </h3>
                <span className="text-xs text-gray-400">
                  تاريخ البلاغ: {selectedDispute.date}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg text-sm">
                <div>
                  <span className="text-gray-500 block">العميل:</span>
                  <span className="font-medium text-gray-800">
                    {selectedDispute.customerName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">الشيف / المطعم:</span>
                  <span className="font-medium text-gray-800">
                    {selectedDispute.chefName}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  سبب النزاع:
                </h4>
                <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg border border-red-100">
                  {selectedDispute.reason}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  التفاصيل والوصف:
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedDispute.details}
                </p>
              </div>

              {selectedDispute.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() =>
                      handleStatusChange(selectedDispute.id, "resolved")
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition"
                  >
                    <CheckCircle className="w-4 h-4" /> قبول التعويض وحل النزاع
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedDispute.id, "rejected")
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition"
                  >
                    <XCircle className="w-4 h-4" /> رفض الشكوى
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border text-center text-gray-400">
              اختر شكوى من القائمة الجانبية لمراجعة التفاصيل واتخاذ الإجراء.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
