import LogoutButton from "../components/LogoutButton";

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl m-4">Tervetuloa koti-sivulle</h1>
      <p className="m-4">Tässä on perusohjelman sisääntulo.</p>
      <LogoutButton />
    </div>
  );
};

export default Home;
