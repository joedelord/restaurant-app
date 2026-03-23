const AuthField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
}) => {
  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block mb-2.5 text-sm font-medium text-heading"
      >
        {label}
      </label>

      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand"
      />
    </div>
  );
};

export default AuthField;
