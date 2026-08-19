import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button'; 
import TextBox from '../../../components/ui/TextBox';
import { useLogin } from '../../../services/useUser';



export default function LoginPage() {

  const { mutate: login, isPending, isError, error, isSuccess } = useLogin();
  const navigate = useNavigate();
  
  async function handleLogin(values:any, { setSubmitting, setStatus }:any) {
    // Reset status before new attempt
    setStatus(null);
    setSubmitting(true);

    // Call the mutate function from useLogin hook
    login(values, {
      onSuccess: (response) => {
        console.log('Login successful:', response.data);

        // TODO: Save the token from response.data to local storage or context
        setStatus({ success: 'Login successful! Redirecting...' });
        
        setTimeout(() => {
          if (response.data.role === "Chef") {
            
            navigate("/chef"); // Redirect to chef dashboard on success
          } else {
            navigate("/"); // Redirect to homepage on success
          }
        }, 1500);
      },
      onError: (err: any) => {
        console.error('Login failed:', err.response?.data || err.message);
        setStatus({ error: 'Login failed. ' + (err.response?.data?.message || err.message) });
        setSubmitting(false);
      },
      onSettled: () => {
        setSubmitting(false); // Ensure submitting state is reset
      }
    });
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

  // Handle status messages based on useLogin hook state
  let statusMessage = null;
  if (isError) {
    statusMessage = <div className="text-red-500 text-center">{'Login failed. ' + (error as any)?.response?.data?.message || (error as any)?.message}</div>;
  } else if (isSuccess && formik.status?.success) { // Use formik.status for success message after navigation logic
    statusMessage = <div className="text-green-500 text-center">{formik.status.success}</div>;
  } else if (isPending) {
    statusMessage = <div className="text-blue-500 text-center">جاري تسجيل الدخول...</div>; // Changed from isLoading
  }

  return (
    <>
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-3 w-80 m-2 bg-amber-200 p-4 rounded-lg border-1 border-amber-400"
        >
          {statusMessage}

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

          <Button type="submit" text="دخول" disabled={formik.isSubmitting || isPending} />
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