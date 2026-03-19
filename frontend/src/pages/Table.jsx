import { Link } from "react-router-dom";

const Table = () => {
  return (
    <div>
      <h1>Pöydän varaus</h1>
      <p>Tästä voit varata pyödän ravintolaamme.</p>
      <Link to="/about">Siirry About-sivulle</Link>
    </div>
  );
};

export default Table;
