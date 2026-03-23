const AuthSubmitButton = ({ loading, idleText, loadingText }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="box-border rounded-base border border-transparent bg-black px-4 py-2.5 text-sm font-medium leading-5 text-white shadow-xs focus:outline-none focus:ring-4 focus:ring-brand-medium hover:bg-brand-strong disabled:opacity-50"
    >
      {loading ? loadingText : idleText}
    </button>
  );
};

export default AuthSubmitButton;
