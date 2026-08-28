import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Loader2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import TextBox from '../../../components/ui/TextBox';
import { useLogin } from '../../../services/useUser';

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const navigate = useNavigate();

  async function handleLogin(values: any, { setSubmitting, setStatus }: any) {
    setStatus(null);
    setSubmitting(true);

    login(values, {
      onSuccess: (response) => {
        // useLogin (services/useUser.ts) بيحفظ الـ accessToken في localStorage
        // ("token") لوحده أول ما اللوجن ينجح، هنا بس بنكمّل باقي البيانات
        // (refreshToken وعلم الأدمن) اللي مش شغل الـ hook.
        const payload = response?.data ?? {};

        if (payload.refreshToken) {
          localStorage.setItem("refreshToken", payload.refreshToken);
        }
        if (String(payload.role).toLowerCase() === "admin") {
          localStorage.setItem("admin", "true");
        }

        setStatus({ success: 'تم تسجيل الدخول! جاري التحويل...' });

        setTimeout(() => {
          if (String(payload.role).toLowerCase() === "admin") {
            navigate("/adminDashboard");
          } else if (payload.role === "Chef") {
            navigate("/chef");
          } else {
            navigate("/");
          }
        }, 900);
      },
      onError: (err: any) => {
        setStatus({
          error:
            err?.response?.data?.message ||
            'فشل تسجيل الدخول، تأكد من البريد الإلكتروني وكلمة المرور.',
        });
        setSubmitting(false);
      },
      onSettled: () => {
        setSubmitting(false);
      },
    });
  }

  const loginSchema = Yup.object().shape({
    email: Yup.string().email('البريد الإلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
    password: Yup.string().required('كلمة المرور مطلوبة'),
  });

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: handleLogin,
  });

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF9F6] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#B34510] text-white flex items-center justify-center shadow-sm">
            <ChefHat className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#5F2108]">تسجيل الدخول</h1>
          <p className="text-sm text-[#A87C69]">اهلاً بيك تاني في ChefNear</p>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 bg-white p-6 rounded-3xl border border-rose-100/80 shadow-sm"
        >
          {formik.status?.error && (
            <div className="text-red-600 text-xs bg-red-50 border border-red-100 rounded-xl p-3 text-center">
              {formik.status.error}
            </div>
          )}
          {formik.status?.success && (
            <div className="text-green-700 text-xs bg-green-50 border border-green-100 rounded-xl p-3 text-center">
              {formik.status.success}
            </div>
          )}

          <TextBox formik={formik} name="email" placeholder="example@email.com" type="email" label="البريد الإلكتروني" />
          <div className="space-y-1">
            <TextBox formik={formik} name="password" placeholder="••••••••" type="password" label="كلمة المرور" />
            <div className="text-left">
              <Link to="/forgot-password" className="text-xs font-bold text-[#B34510] hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>
          </div>

          <div className="pt-1">
            <Button
              type="submit"
              text={isPending || formik.isSubmitting ? 'جاري الدخول...' : 'دخول'}
              disabled={formik.isSubmitting || isPending}
            />
          </div>

          {(isPending || formik.isSubmitting) && (
            <div className="flex items-center justify-center gap-2 text-xs text-[#A87C69]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>لحظات وبنتحقق من بياناتك...</span>
            </div>
          )}

          <p className="text-center text-sm text-[#5F2108]">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="font-bold text-[#B34510] hover:underline">
              سجّل الآن
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
