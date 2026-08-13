import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../services/api';
import Button from '../../../components/ui/Button'; 
import TextBox from '../../../components/ui/TextBox';

export default function LoginPage() {
  const navigate = useNavigate();

  async function handleLogin(values:any, { setSubmitting, setStatus }:any) {
    
    try {
      const response = await loginUser({ email: values.email, password: values.password });
      console.log('Login successful:', response.data);
      // TODO: Save the token from response.data to local storage or context
      setStatus({ success: 'Login successful! Redirecting...' });

      localStorage.setItem("token", response.data.data?.accessToken); // Save token to local storage

      setTimeout(() => {

        if (response.data.data?.role === "Chef") {

          navigate("/chef"); // Redirect to chef dashboard on success
        } else {

          navigate("/"); // Redirect to homepage on success
        }

      }, 1500);
    } catch (error:any) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      setStatus({ error: 'Login failed. ' + error.response.data.message });
      setSubmitting(false);
    }
  }

  const loginSchema = Yup.object().shape({
    email: Yup.string().email('البريد الإلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
    password: Yup.string().required('كلمه المرور مطلوبه'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: handleLogin,
  });

  return (
    <>
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-3 w-80 m-2 bg-amber-200 p-4 rounded-lg border-1 border-amber-400"
        >
          {formik.status && formik.status.error && (
            <div className="text-red-500 text-center">
              {formik.status.error}
            </div>
          )}
          {formik.status && formik.status.success && (
            <div className="text-green-500 text-center">
              {formik.status.success}
            </div>
          )}

          <h1 className="text-2xl font-bold mb-4 text-center caret-amber-600 ">
            تسجيل الدخول
          </h1>
          <TextBox
            formik={formik}
            name="email"
            placeholder="البريد الإلكتروني"
            type="email"
          />
          <TextBox
            formik={formik}
            name="password"
            placeholder="كلمة المرور"
            type="password"
          />

          <Button type="submit" text="دخول" disabled={formik.isSubmitting} />
          <button
            onClick={() => navigate("/chef")}
            className="bg-amber-500 text-white py-2 px-4 rounded hover:bg-amber-600"
          >
            انتقل إلى لوحةChef
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-amber-500 text-white py-2 px-4 rounded hover:bg-amber-600"
          >
           home
          </button>
          <a
            href="/register"
            className="text-blue-500 hover:underline text-center"
          >
            ليس لديك حساب؟ سجل الآن
          </a>
        </form>
      </div>
    </>
  );
}