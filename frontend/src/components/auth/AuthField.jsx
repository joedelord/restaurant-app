const AuthField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  disabled = false,
  error = "",
}) => {
  const hasError = Boolean(error);

  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="mb-2.5 block text-sm font-medium text-heading"
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
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={`block w-full rounded-base border px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body disabled:opacity-50 ${
          hasError
            ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500"
            : "border-default-medium bg-neutral-secondary-medium focus:border-brand focus:ring-brand"
        }`}
      />

      {hasError && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthField;
