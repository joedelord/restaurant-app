import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="py-10 px-4 text-center">
      <div className="">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-4xl">
          {t("home.story.title")}
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-gray-600">
          {t("home.story.text1")}
        </p>

        <p className="mt-4 mb-6 text-lg leading-relaxed text-gray-600">
          {t("home.story.text2")}
        </p>

        <div className="overflow-hidden rounded-3xl shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
            alt={t("home.story.imageAlt")}
            className="h-320px w-full object-cover md:h-420px"
          />
        </div>

        <div className="mt-10 m-auto text-center">
          <Button
            className="mr-2"
            type="button"
            size="xl"
            variant="primary"
            onClick={() => navigate("/menu")}
          >
            {t("home.story.primaryButton")}
          </Button>

          <Button
            className="ml-2"
            type="button"
            size="xl"
            variant="secondary"
            onClick={() => navigate("/reservations")}
          >
            {t("home.story.secondaryButton")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Home;
