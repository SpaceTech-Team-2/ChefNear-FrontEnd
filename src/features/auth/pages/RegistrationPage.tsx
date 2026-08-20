import { useFormik } from 'formik';
import Button from '../../../components/ui/Button';
import { registerUser } from '../../../services/api';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import TextBox from '../../../components/ui/TextBox';

export default function RegistrationPage() {
  const navigate = useNavigate();

  async function handleRegister(values: any, { setSubmitting, setStatus }: any) {
    const role = values.usertype === "chef" ? "chef" : "client";
    const apiData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      confirmPassword: values.repassword,
      displayName: `${values.firstName} ${values.lastName}`,
      phoneNumber: values.phone,
      role: role,
      description: "",
    };

    try {
      await registerUser(apiData);
      setStatus({ success: 'تم إنشاء الحساب بنجاح! جاري تحويلك لتسجيل الدخول...' });
      setTimeout(() => {
        navigate('/login');
      }, 1800);
    } catch (error: any) {
      setStatus({
        error:
          error?.response?.data?.message ||
          'حصل خطأ أثناء إنشاء الحساب، حاول مرة أخرى.',
      });
      setSubmitting(false);
    }
  }

  const userSchema = Yup.object().shape({
    usertype: Yup.string().oneOf(['chef', 'user'], 'يجب اختيار نوع المستخدم').required('نوع المستخدم مطلوب'),
    firstName: Yup.string().min(3, "الاسم يجب أن يكون أكثر من 3 أحرف").max(10, "الاسم يجب أن يكون أقل من 10 أحرف").required('الاسم مطلوب'),
    lastName: Yup.string().min(3, "الاسم يجب أن يكون أكثر من 3 أحرف").max(10, "الاسم يجب أن يكون أقل من 10 أحرف").required('الاسم مطلوب'),
    email: Yup.string().email('البريد الإلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
    password: Yup.string().min(6, "كلمة المرور يجب أن تكون أكثر من 6 أحرف").required('كلمة المرور مطلوبة'),
    repassword: Yup.string().oneOf([Yup.ref('password'), undefined], 'كلمتا المرور غير متطابقتين').required('تأكيد كلمة المرور مطلوب'),
    phone: Yup.string().matches(/^[0-9]{11}$/, 'رقم الهاتف غير صحيح').required('رقم الهاتف مطلوب'),
  });

  const formik = useFormik({
    initialValues: {
      usertype: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      repassword: '',
      phone: '',
    },
    validationSchema: userSchema,
    onSubmit: handleRegister,
  });

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF9F6] flex items-center justify-center p-4 py-10 font-sans">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#B34510] text-white flex items-center justify-center shadow-sm">
            <ChefHat className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#5F2108]">إنشاء حساب</h1>
          <p className="text-sm text-[#A87C69]">انضم لعائلة ChefNear في دقيقة</p>
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

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5F2108]">نوع الحساب</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "user", label: "مستخدم" },
                { value: "chef", label: "شيف" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => formik.setFieldValue("usertype", opt.value)}
                  className={`py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                    formik.values.usertype === opt.value
                      ? "bg-[#B34510] text-white border-[#B34510]"
                      : "bg-[#FFF8F6] text-[#5F2108] border-[#EACEC5]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {formik.errors.usertype && formik.touched.usertype && (
              <div className="text-red-500 text-xs">{formik.errors.usertype}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextBox formik={formik} name="firstName" placeholder="الاسم" label="الاسم الأول" />
            <TextBox formik={formik} name="lastName" placeholder="الاسم العائلي" label="اسم العائلة" />
          </div>
          <TextBox formik={formik} name="email" placeholder="example@email.com" type="email" label="البريد الإلكتروني" />
          <TextBox formik={formik} name="password" placeholder="••••••••" type="password" label="كلمة المرور" />
          <TextBox formik={formik} name="repassword" placeholder="••••••••" type="password" label="تأكيد كلمة المرور" />
          <TextBox formik={formik} name="phone" placeholder="01xxxxxxxxx" type="tel" label="رقم الهاتف" />

          <div className="pt-1">
            <Button type="submit" text={formik.isSubmitting ? 'جاري الإنشاء...' : 'إنشاء الحساب'} disabled={formik.isSubmitting} />
          </div>

          <p className="text-center text-sm text-[#5F2108]">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="font-bold text-[#B34510] hover:underline">
              سجّل الدخول
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
