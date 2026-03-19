import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Tervetuloa koti-sivulle</h1>
      <p>Tässä on perusohjelman sisääntulo.</p>
      <Link to="/about">Siirry About-sivulle</Link>
    </div>
  );
};

export default Home;
