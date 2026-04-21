import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 80);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-bottom from-[#f8f9fb] via-white to-[#f3f4f6] px-4 py-12 text-gray-900 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-600px w-600px -translate-x-1/2 rounded-full bg-amber-400/20 blur-120px" />
      </div>

      <div
        className={`relative mx-auto grid max-w-7xl items-center gap-10 rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-xl backdrop-blur-md transition-all duration-700 ease-out md:grid-cols-2 md:p-10 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div className="order-2 flex flex-col justify-center md:order-1">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
            {t("home.story.kicker")}
          </p>

          <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-3xl lg:text-4xl">
            {t("home.story.title")}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
            {t("home.story.text1")}
          </p>

          <p className="mt-4 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
            {t("home.story.text2")}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button
              type="button"
              size="xl"
              variant="primary"
              onClick={() => navigate("/menu")}
              className="w-full sm:w-auto"
            >
              {t("home.story.primaryButton")}
            </Button>

            <Button
              type="button"
              size="xl"
              variant="secondary"
              onClick={() => navigate("/reservations")}
              className="w-full sm:w-auto"
            >
              {t("home.story.secondaryButton")}
            </Button>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-gray-200 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
              alt={t("home.story.imageAlt")}
              className="h-320px w-full object-cover transition-transform duration-700 hover:scale-105 md:h-520px"
            />
            <div className="absolute inset-0 bg-gradient-to-top from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
