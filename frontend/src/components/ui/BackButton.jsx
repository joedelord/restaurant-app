/**
 * BackButton
 *
 * Reusable navigation button for returning to previous or specific page.
 *
 * Props:
 * - to: route path (optional)
 * - label: translation key (optional)
 * - onClick: custom handler (optional)
 */

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Button from "./Button";

const BackButton = ({ to, label = "common.back", onClick, className = "" }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    if (onClick) return onClick();
    if (to) return navigate(to);

    navigate(-1);
  };

  return (
    <div className={`mb-6 ${className}`}>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={handleClick}
        className="inline-flex items-center gap-2"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        {t(label)}
      </Button>
    </div>
  );
};

export default BackButton;
