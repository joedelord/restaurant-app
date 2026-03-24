const PrimaryButton = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="
        bg-black text-white
        px-4 py-2.5 rounded-base text-sm font-medium
        transition-all duration-200
        hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:bg-black disabled:hover:translate-y-0 disabled:hover:shadow-none
      "
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
