import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Tervetuloa koti-sivulle</h1>
      <p>Tässä on perusohjelman sisääntulo.</p>
      <Link to="/about">Kirjaudu ulos</Link>
    </div>
  );
};

export default Home;
