/**
 * AuthSubmitButton
 *
 * Reusable submit button for authentication forms.
 *
 * Responsibilities:
 * - Displays loading and idle button text
 * - Disables the button while a request is loading
 * - Uses the shared Button component for consistent styling
 */

import Button from "./Button";

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
