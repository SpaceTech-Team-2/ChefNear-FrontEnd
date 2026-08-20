interface ButtonProps {
  type?: "button" | "submit" | "reset";
  text: string;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export default function Button({
  type = "button",
  text,
  disabled,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const base =
    "w-full py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-[#B34510] hover:bg-[#A03E0F] text-white shadow-sm"
      : "bg-[#FFEAE3] hover:bg-[#FFDDD1] text-[#A03E0F]";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${styles}`}
    >
      {text}
    </button>
  );
}
