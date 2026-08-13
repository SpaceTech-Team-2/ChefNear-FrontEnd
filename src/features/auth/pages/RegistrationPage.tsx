import { useFormik } from 'formik';
import Button from '../../../components/ui/Button';
import { registerUser } from '../../../services/api';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import TextBox from '../../../components/ui/TextBox';

export default function RegistrationPage(){

    const navigate = useNavigate();

    async function handleRegister(values:any, { setSubmitting, setStatus }:any){
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
          description :""
        };

        try {
            const response = await registerUser(apiData);
            console.log('Registration successful:', response.data);
            setStatus({ success: 'Registration successful! Redirecting to login...' });
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error:any) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            setStatus({ error: 'Registration failed. ' + error.response.data.message });
            setSubmitting(false);
        }
    }

    let userSchema =Yup.object().shape({
    usertype: Yup.string().oneOf(['chef', 'user'], 'يجب اختيار نوع المستخدم').required('نوع المستخدم مطلوب'),
    firstName: Yup.string().min(3,"الاسم يجب أن يكون أكثر من 3 أحرف").max(10,"الاسم يجب أن يكون أقل من 10 أحرف").required('الاسم مطلوب'),
    lastName: Yup.string().min(3,"الاسم يجب أن يكون أكثر من 3 أحرف").max(10,"الاسم يجب أن يكون أقل من 10 أحرف").required('الاسم مطلوب'),
    email: Yup.string().email('البريد الإلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
    password: Yup.string().min(6,"كلمه المرور يجب ان تكون اكثر من 6 احرف").required('كلمه المرور مطلوبه'),
    repassword: Yup.string().oneOf([Yup.ref('password'), undefined], 'كلمتا المرور غير متطابقتين').required('تأكيد كلمة المرور مطلوب'),
    phone: Yup.string().matches(/^[0-9]{11}$/, 'رقم الهاتف غير صحيح').required('رقم الهاتف مطلوب')
    
    // ,
    // website: Yup.string().url().nullable()
    })

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
    validationSchema: userSchema 
    ,onSubmit: handleRegister
    
    });

    return(
        <>
<div className="flex flex-1 items-center justify-center min-h-screen">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3 w-80 m-2 bg-amber-100 p-4 rounded-lg border-1 border-amber-400">

            <select
                name="usertype"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.usertype}
                className="p-2 border rounded-lg h-10 border-gray-500"
            >
                <option value="" label="اختر نوع الحساب" />
                <option value="user">مستخدم</option>
                <option value="chef">شيف</option>
            </select>
            {formik.errors.usertype && formik.touched.usertype && <div className="text-red-500 text-xs">{formik.errors.usertype}</div>}
            <TextBox formik={formik} name="firstName" placeholder="الاسم" />
            <TextBox formik={formik} name="lastName" placeholder="الاسم العائلي" />
            <TextBox formik={formik} name="email" placeholder="البريد الإلكتروني" type="email" />
            <TextBox formik={formik} name="password" placeholder="كلمة المرور" type="password" />  
            <TextBox formik={formik} name="repassword" placeholder="تأكيد كلمة المرور" type="password" />
            <TextBox formik={formik} name="phone" placeholder="رقم الهاتف" type="tel" />

        {formik.status && formik.status.error && <div className="text-red-500 text-center">{formik.status.error}</div>}
        {formik.status && formik.status.success && <div className="text-green-500 text-center">{formik.status.success}</div>}


            <Button type="submit" text="Register" disabled={formik.isSubmitting} />

            <a href="/login" className="text-blue-500 hover:underline text-center">
             لديك حساب بالفعل؟ سجل الدخول
            </a>
        </form>
</div>
        </>
    )
}