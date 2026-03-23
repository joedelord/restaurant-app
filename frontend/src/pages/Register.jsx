import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const Register = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (!data) return "Rekisteröityminen epäonnistui.";

    if (data.email?.[0]) return data.email[0];
    if (data.password?.[0]) return data.password[0];
    if (data.first_name?.[0]) return data.first_name[0];
    if (data.last_name?.[0]) return data.last_name[0];
    if (data.phone_number?.[0]) return data.phone_number[0];
    if (data.detail) return data.detail;

    return "Rekisteröityminen epäonnistui.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Salasanat eivät täsmää.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/users/register/", {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        marketing_consent: marketingConsent,
      });

      alert("Rekisteröityminen onnistui. Voit nyt kirjautua sisään.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-10">
      <h1 className="text-2xl text-center m-10">Rekisteröidy</h1>

      <div className="w-full max-w-xl border-black border-2 p-5 rounded-md mx-auto">
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Sähköposti
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="firstName"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Etunimi
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="Etunimi"
              autoComplete="given-name"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="lastName"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Sukunimi
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="Sukunimi"
              autoComplete="family-name"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="phoneNumber"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Puhelinnumero
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="+358 40 123 4567"
              autoComplete="tel"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Salasana
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="Vähintään 8 merkkiä"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="confirmPassword"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Vahvista salasana
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="Kirjoita salasana uudelleen"
              autoComplete="new-password"
              required
            />
          </div>

          <label htmlFor="marketingConsent" className="flex items-center mb-5">
            <input
              id="marketingConsent"
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
            />
            <p className="ms-2 text-sm font-medium text-heading select-none">
              Haluan vastaanottaa markkinointiviestintää
            </p>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="text-white bg-black box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none disabled:opacity-50"
          >
            {loading ? "Luodaan tiliä..." : "Rekisteröidy"}
          </button>

          <p className="mt-4 text-sm text-body">
            Onko sinulla jo tili?{" "}
            <Link to="/login" className="underline">
              Kirjaudu sisään
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
