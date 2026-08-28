import { useState } from "react";
import { Link } from "react-router-dom";
import { ChefHat, Loader2, MailCheck } from "lucide-react";
import { requestPasswordReset } from "../../../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await requestPasswordReset(email);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF9F6] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#B34510] text-white flex items-center justify-center shadow-sm">
            <ChefHat className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#5F2108]">نسيت كلمة المرور؟</h1>
          <p className="text-sm text-[#A87C69] text-center">
            اكتبي إيميلك وهنبعتلك رابط تقدري تظبطي بيه كلمة مرور جديدة
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-rose-100/80 shadow-sm">
          {status === "sent" ? (
            <div className="text-center space-y-3 py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                <MailCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-sm text-gray-700 font-bold">لو الإيميل ده مسجّل عندنا، هيوصلك رابط إعادة التعيين.</p>
              <Link to="/login" className="inline-block text-xs font-bold text-[#B34510] hover:underline">
                رجوع لتسجيل الدخول
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {status === "error" && (
                <div className="text-red-600 text-xs bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                  حصلت مشكلة، حاولي تاني.
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#5F2108]">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full bg-[#FFF8F6] border border-[#EACEC5] rounded-xl px-4 py-2.5 text-sm text-[#5F2108] placeholder:text-[#A87C69] outline-none focus:ring-2 focus:ring-[#B34510]/40"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 bg-[#B34510] hover:bg-[#A03E0F] text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
              >
                {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>ابعتي رابط إعادة التعيين</span>
              </button>
              <p className="text-center text-sm text-[#5F2108]">
                <Link to="/login" className="font-bold text-[#B34510] hover:underline">
                  رجوع لتسجيل الدخول
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
