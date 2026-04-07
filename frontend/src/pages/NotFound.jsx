import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-sm backdrop-blur-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          404
        </p>

        <h1 className="mb-4 text-3xl font-bold text-heading sm:text-4xl">
          {t("notFound.title")}
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-sm leading-6 text-body sm:text-base">
          {t("notFound.description")}
        </p>

        <Button
          type="button"
          size="xl"
          variant="primary"
          onClick={() => navigate("/")}
        >
          {t("notFound.backHome")}
        </Button>
      </div>
    </section>
  );
};

export default NotFound;
