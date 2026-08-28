import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ChefHat, Loader2, CheckCircle2 } from "lucide-react";
import { resetPassword } from "../../../services/api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const linkValid = Boolean(email && token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }
    setStatus("loading");
    try {
      await resetPassword({ email, token, newPassword, confirmPassword });
      setStatus("done");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err: any) {
      setStatus("error");
      setError(err?.response?.data?.message || "تعذر إعادة تعيين كلمة المرور، الرابط ممكن يكون منتهي.");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF9F6] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#B34510] text-white flex items-center justify-center shadow-sm">
            <ChefHat className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#5F2108]">تعيين كلمة مرور جديدة</h1>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-rose-100/80 shadow-sm">
          {!linkValid ? (
            <div className="text-center space-y-3 py-2">
              <p className="text-sm text-red-600">الرابط ده غير صالح أو ناقص بيانات.</p>
              <Link to="/forgot-password" className="inline-block text-xs font-bold text-[#B34510] hover:underline">
                اطلبي رابط جديد
              </Link>
            </div>
          ) : status === "done" ? (
            <div className="text-center space-y-3 py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-sm text-gray-700 font-bold">تم تغيير كلمة المرور! جاري تحويلك لتسجيل الدخول...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="text-red-600 text-xs bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                  {error}
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#5F2108]">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FFF8F6] border border-[#EACEC5] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#B34510]/40"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#5F2108]">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FFF8F6] border border-[#EACEC5] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#B34510]/40"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 bg-[#B34510] hover:bg-[#A03E0F] text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
              >
                {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>حفظ كلمة المرور الجديدة</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
