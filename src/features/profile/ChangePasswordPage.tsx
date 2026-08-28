import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { changePassword } from "../../services/api";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }
    setStatus("loading");
    try {
      await changePassword({ oldPassword, newPassword, confirmPassword });
      setStatus("done");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setStatus("error");
      setError(err?.response?.data?.message || "تعذر تغيير كلمة المرور، تأكدي من كلمة المرور الحالية.");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF9F6] p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="p-2 bg-white border border-rose-100 rounded-full text-[#A03E0F] hover:bg-rose-50 transition-colors shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">تغيير كلمة المرور</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-rose-100/80 shadow-sm p-6 space-y-4"
        >
          {status === "done" && (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>تم تغيير كلمة المرور بنجاح.</span>
            </div>
          )}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 text-center">
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600">كلمة المرور الحالية</label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full bg-[#FFF8F6] border border-[#EACEC5] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#B34510]/40"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600">كلمة المرور الجديدة</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#FFF8F6] border border-[#EACEC5] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#B34510]/40"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600">تأكيد كلمة المرور الجديدة</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#FFF8F6] border border-[#EACEC5] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#B34510]/40"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full flex items-center justify-center gap-2 bg-[#B34510] hover:bg-[#A03E0F] text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
          >
            {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>حفظ كلمة المرور</span>
          </button>
        </form>
      </div>
    </div>
  );
}
