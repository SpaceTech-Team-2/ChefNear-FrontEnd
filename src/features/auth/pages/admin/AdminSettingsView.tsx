import React, { useState } from "react";
import { Settings, Save, ShieldAlert, Truck, Sliders } from "lucide-react";

export const AdminSettingsView: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [autoAssignDrivers, setAutoAssignDrivers] = useState<boolean>(true);
  const [commissionRate, setCommissionRate] = useState<number>(15);
  const [minOrderValue, setMinOrderValue] = useState<number>(50);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const settingsData = {
      maintenanceMode,
      autoAssignDrivers,
      commissionRate,
      minOrderValue,
    };
    console.log("Saved Admin Settings:", settingsData);
    alert("تم حفظ إعدادات النظام بنجاح!");
  };

  return (
    <div className="space-y-6 text-right dir-rtl max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Settings className="w-6 h-6 text-orange-500" /> إعدادات النظام
      </h2>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* System Status Controls */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 border-b pb-3">
            <ShieldAlert className="w-5 h-5 text-red-500" /> حالة المنصة
          </h3>

          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
            <div>
              <span className="font-medium text-gray-800 block">
                وضع الصيانة (Maintenance Mode)
              </span>
              <span className="text-xs text-gray-500">
                إيقاف استقبال الطلبات والتصفح مؤقتاً لجميع المستخدمين.
              </span>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-5 h-5 text-red-600 rounded focus:ring-red-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Operational Settings */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 border-b pb-3">
            <Truck className="w-5 h-5 text-blue-500" /> إعدادات التشغيل والتوصيل
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-800 block">
                تعيين كباتن التوصيل تلقائياً
              </span>
              <span className="text-xs text-gray-500">
                إرسال الطلب لأقرب كابتن توصيل متاح فور إسناده من الشيف.
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoAssignDrivers}
              onChange={(e) => setAutoAssignDrivers(e.target.checked)}
              className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نسبة عمولة المنصة (%)
              </label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الحد الأدنى للطلب (ج.م)
              </label>
              <input
                type="number"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(Number(e.target.value))}
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-6 rounded-lg flex items-center gap-2 transition"
        >
          <Save className="w-4 h-4" /> حفظ التعديلات
        </button>
      </form>
    </div>
  );
};
