import type { FormikProps } from 'formik';

interface TextBoxProps<T extends object = any> {
    formik: FormikProps<T>;
    name: keyof T & string;
    placeholder: string;
    type?: string;
    label?: string;
}

export default function TextBox({ formik, name, placeholder, type = "text", label }: TextBoxProps){
    const value = formik.values[name];
    const error = formik.errors[name];
    const touched = formik.touched[name];
    const hasError = Boolean(error && touched);

    return(
    <div className="space-y-1">
        {label && (
            <label htmlFor={name} className="text-xs font-bold text-[#5F2108]">
                {label}
            </label>
        )}
        <input
            id={name}
            type={type}
            name={name}
            placeholder={placeholder}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={value}
            className={`w-full bg-[#FFF8F6] border rounded-xl px-4 py-2.5 text-sm text-[#5F2108] placeholder:text-[#A87C69] outline-none transition-colors focus:ring-2 focus:ring-[#B34510]/40 ${
                hasError ? "border-red-300" : "border-[#EACEC5] focus:border-[#B34510]"
            }`}
        />
        {hasError && <div className="text-red-500 text-xs">{error as string}</div>}
    </div>
    )
}
