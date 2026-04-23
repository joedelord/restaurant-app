import Button from "../../components/ui/Button";

const AuthSubmitButton = ({
  loading,
  idleText = "Submit",
  loadingText = "Loading...",
  ...props
}) => {
  return (
    <Button type="submit" variant="primary" disabled={loading} {...props}>
      {loading ? loadingText : idleText}
    </Button>
  );
};

export default AuthSubmitButton;
