import type { FormikProps } from 'formik';

interface TextBoxProps<T extends object = any> {
    formik: FormikProps<T>;
    name: keyof T & string; 
    placeholder: string;
    type?: string;
}

export default function TextBox({ formik, name, placeholder, type = "text" }: TextBoxProps){
    const value = formik.values[name];
    const error = formik.errors[name];
    const touched = formik.touched[name];

    return(
    <>
        <input 
            type={type} 
            name={name}
            placeholder={placeholder}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={value}
            className="p-2 border rounded-lg h-10 border-gray-500"
        />
        {error && touched && <div className="text-red-500 text-xs">{error as string}</div>}
    </>
    )
}