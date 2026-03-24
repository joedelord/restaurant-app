const baseClasses =
  "inline-flex items-center justify-center rounded-base px-4 py-2.5 text-sm font-medium shadow-xs transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary:
    "bg-black text-white hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md active:scale-95 disabled:hover:bg-black disabled:hover:translate-y-0 disabled:hover:shadow-none",
  secondary:
    "border border-default-medium bg-white text-heading hover:bg-neutral-secondary-medium hover:-translate-y-0.5 hover:shadow-md active:scale-95 disabled:hover:bg-white disabled:hover:translate-y-0 disabled:hover:shadow-none",
  danger:
    "border border-red-300 bg-white text-red-700 hover:bg-red-50 hover:-translate-y-0.5 hover:shadow-md active:scale-95 disabled:hover:bg-white disabled:hover:translate-y-0 disabled:hover:shadow-none",
  ghost:
    "bg-transparent text-heading hover:bg-neutral-secondary-medium active:scale-95",
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) => {
  const variantClasses = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
